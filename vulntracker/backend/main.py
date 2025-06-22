from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
import uuid
import json
import os
from pdf_generator import generate_proposal_pdf

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Vulnerability(BaseModel):
    id: str = ""
    site: str
    title: str
    risk: str
    tags: List[str] = []
    description: str = ""
    recommendation: str = ""
    status: str = "detected"  # detected / contacted / closed
    price: float = 0.0

vulns: List[Vulnerability] = []
VULNS_FILE = "vulns.json"

def load_vulns():
    if os.path.exists(VULNS_FILE):
        with open(VULNS_FILE, 'r') as f:
            data = json.load(f)
            return [Vulnerability(**v) for v in data]
    return []

def save_vulns():
    with open(VULNS_FILE, 'w') as f:
        json.dump([v.dict() for v in vulns], f, indent=2)

# Load existing vulnerabilities on startup
vulns = load_vulns()

@app.get("/vulns", response_model=List[Vulnerability])
def get_vulns():
    return vulns

@app.post("/vulns", response_model=Vulnerability)
def add_vuln(vuln: Vulnerability):
    vuln.id = str(uuid.uuid4())
    vulns.append(vuln)
    save_vulns()
    return vuln

@app.put("/vulns/{vuln_id}", response_model=Vulnerability)
def update_vuln(vuln_id: str, vuln: Vulnerability):
    for i, existing_vuln in enumerate(vulns):
        if existing_vuln.id == vuln_id:
            vuln.id = vuln_id
            vulns[i] = vuln
            save_vulns()
            return vuln
    raise HTTPException(status_code=404, detail="Vulnerability not found")

@app.delete("/vulns/{vuln_id}")
def delete_vuln(vuln_id: str):
    for i, vuln in enumerate(vulns):
        if vuln.id == vuln_id:
            vulns.pop(i)
            save_vulns()
            return {"ok": True}
    raise HTTPException(status_code=404, detail="Vulnerability not found")

@app.post("/proposal/{vuln_id}")
def generate_proposal(vuln_id: str):
    """Generate PDF proposal for a vulnerability"""
    vuln = None
    for v in vulns:
        if v.id == vuln_id:
            vuln = v
            break
    
    if not vuln:
        raise HTTPException(status_code=404, detail="Vulnerability not found")
    
    # Generate PDF
    pdf_filename = f"proposal_{vuln_id[:8]}.pdf"
    pdf_path = generate_proposal_pdf(vuln, pdf_filename)
    
    # Return the PDF file
    return FileResponse(
        path=pdf_path,
        filename=pdf_filename,
        media_type='application/pdf'
    ) 