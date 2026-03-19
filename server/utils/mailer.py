import smtplib
import logging
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_FROM = os.getenv("SMTP_FROM") or SMTP_USER or "no-reply@verimind.ai"


def send_otp_email(email, otp):
    """
    Sends a security OTP to the specified email address.
    """
    if not SMTP_USER or not SMTP_PASS:
        logger.warning(f"[EMAIL SIMULATION] No SMTP credentials found. OTP for {email}: {otp}")
        return True # Simulate success for development

    try:
        msg = MIMEMultipart()
        msg['From'] = f"VeriMind <{SMTP_FROM}>"
        msg['To'] = email
        msg['Subject'] = f"{otp} is your VeriMind verification code"

        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 10px;">
                    <h2 style="color: #6366f1;">VeriMind Identity Verification</h2>
                    <p>Hello,</p>
                    <p>Use the following code to verify your identity. This code will expire in 5 minutes.</p>
                    <div style="background: #f4f4f9; padding: 20px; text-align: center; border-radius: 8px;">
                        <h1 style="letter-spacing: 5px; color: #1e1b4b; margin: 0;">{otp}</h1>
                    </div>
                    <p>If you didn't request this code, you can safely ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #888;">&copy; 2026 VeriMind AI Suite. Secure verification enabled.</p>
                </div>
            </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
            
        logger.info(f"OTP successfully sent to {email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {email}: {str(e)}")
        return False
