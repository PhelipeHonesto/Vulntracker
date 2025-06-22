from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import os
from datetime import datetime

def generate_proposal_pdf(vuln, output_path="proposal.pdf"):
    """Generate a professional vulnerability proposal PDF"""
    
    doc = SimpleDocTemplate(output_path, pagesize=A4)
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.darkblue
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        spaceBefore=20,
        textColor=colors.darkblue
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=6
    )
    
    # Header
    story.append(Paragraph("VULNTRACKER - Security Report", title_style))
    story.append(Spacer(1, 20))
    
    # Site Information
    story.append(Paragraph("Site Information", heading_style))
    site_data = [
        ["Site URL:", vuln.site],
        ["Vulnerability:", vuln.title],
        ["Risk Level:", vuln.risk.upper()],
        ["Date:", datetime.now().strftime("%B %d, %Y")]
    ]
    
    site_table = Table(site_data, colWidths=[2*inch, 4*inch])
    site_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('BACKGROUND', (0, 0), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(site_table)
    story.append(Spacer(1, 20))
    
    # Vulnerability Description
    if vuln.description:
        story.append(Paragraph("Vulnerability Description", heading_style))
        story.append(Paragraph(vuln.description, normal_style))
        story.append(Spacer(1, 15))
    
    # Impact Assessment
    story.append(Paragraph("Impact Assessment", heading_style))
    impact_text = f"""
    This {vuln.risk.lower()} severity vulnerability could potentially compromise the security 
    of {vuln.site}. Immediate attention is recommended to prevent potential exploitation.
    """
    story.append(Paragraph(impact_text, normal_style))
    story.append(Spacer(1, 15))
    
    # Recommendations
    if vuln.recommendation:
        story.append(Paragraph("Recommendations", heading_style))
        story.append(Paragraph(vuln.recommendation, normal_style))
        story.append(Spacer(1, 15))
    
    # Tags
    if vuln.tags:
        story.append(Paragraph("Related Categories", heading_style))
        tags_text = ", ".join(vuln.tags)
        story.append(Paragraph(tags_text, normal_style))
        story.append(Spacer(1, 15))
    
    # Pricing
    story.append(Paragraph("Service Pricing", heading_style))
    pricing_data = [
        ["Service", "Description", "Price"],
        ["Vulnerability Assessment", f"Detailed analysis of {vuln.title}", f"${vuln.price}"],
        ["Remediation Guidance", "Step-by-step fix instructions", "Included"],
        ["Follow-up Support", "30-day support after implementation", "Included"]
    ]
    
    pricing_table = Table(pricing_data, colWidths=[2*inch, 3*inch, 1*inch])
    pricing_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ]))
    story.append(pricing_table)
    story.append(Spacer(1, 20))
    
    # Contact Information
    story.append(Paragraph("Contact Information", heading_style))
    contact_text = """
    <b>VULNTRACKER Security Services</b><br/>
    Email: security@vulntracker.com<br/>
    Phone: +1 (555) 123-4567<br/>
    Website: https://vulntracker.com<br/>
    <br/>
    <i>Professional cybersecurity assessment and remediation services</i>
    """
    story.append(Paragraph(contact_text, normal_style))
    
    # Build PDF
    doc.build(story)
    return output_path 