import re
import requests
from bs4 import BeautifulSoup
import PyPDF2
import io
import socket

def extract_text_from_pdf(file_bytes):
    """Extracts text from a PDF file."""
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        return f"Error processing PDF: {str(e)}"

def extract_text_from_url(url):
    """Extracts readable text from a URL with SSRF protection."""
    # SSRF Protection: Block internal/private IPs
    try:
        hostname = url.split("//")[-1].split("/")[0].split(":")[0]
        ip = socket.gethostbyname(hostname)
        if ip.startswith(("127.", "10.", "192.168.", "172.16.")):
             return "Error: Access to private IP addresses is blocked."
    except:
        pass

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()

        text = soup.get_text()
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        return text[:10000] # Limit to 10k chars
    except Exception as e:
        return f"Error extracting from URL: {str(e)}"

def validate_file(filename, allowed_extensions):
    """Simple file type validation."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions
