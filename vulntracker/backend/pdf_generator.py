from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import os

def generate_proposal_pdf(vuln, output_path="proposal.pdf"):
    """
    Generates a professional vulnerability proposal PDF from an HTML template.
    
    Args:
        vuln (Vulnerability): The vulnerability data model.
        output_path (str): The path to save the generated PDF file.
        
    Returns:
        str: The path to the generated PDF file.
    """
    
    # Set up Jinja2 environment
    env = Environment(loader=FileSystemLoader(os.path.dirname(__file__)))
    template = env.get_template('proposal_template.html')
    
    # Render the HTML template with vulnerability data
    html_out = template.render(vuln=vuln)
    
    # Use WeasyPrint to generate PDF from rendered HTML
    html = HTML(string=html_out)
    html.write_pdf(output_path)
    
    return output_path 