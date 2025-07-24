from flask import Flask, send_from_directory, request, jsonify
from email.message import EmailMessage
import smtplib
import os
from datetime import datetime

app = Flask(__name__)

# === Gmail Credentials (App Password recommended)
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")



# === Serve Home Page (index.html)
@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

# === Serve Common Pages (like /contact, /request, etc.)
@app.route('/<page>.html')
def html_page(page):
    return send_from_directory('.', f'{page}.html')

@app.route('/<page>')
def html_page_shortcut(page):
    if os.path.exists(page + '.html'):
        return send_from_directory('.', f'{page}.html')
    else:
        return "Page not found", 404

# === Serve All Files (CSS, JS, Images, etc.)
@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory('.', filename)

def create_email_template(template_type, data):
    """Create a nicely formatted HTML email template"""
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    if template_type == 'contact':
        return f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">New Contact Form Submission</h2>
                <p><strong>Time:</strong> {current_time}</p>
                
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h3 style="color: #1e40af; margin-top: 0;">Contact Details</h3>
                    <p><strong>Name:</strong> {data.get('name', 'N/A')}</p>
                    <p><strong>Email:</strong> {data.get('email', 'N/A')}</p>
                    <p><strong>Subject:</strong> {data.get('subject', 'N/A')}</p>
                </div>
                
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h3 style="color: #047857; margin-top: 0;">Message</h3>
                    <p>{data.get('message', 'No message provided').replace('\n', '<br>')}</p>
                </div>
                
                <p style="font-size: 0.9em; color: #6b7280;">
                    This message was sent from the contact form on WebDuos website.
                </p>
            </body>
        </html>
        """
    
    elif template_type == 'quote':
        return f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">New Project Quote Request</h2>
                <p><strong>Time:</strong> {current_time}</p>
                
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h3 style="color: #1e40af; margin-top: 0;">Client Information</h3>
                    <p><strong>Name:</strong> {data.get('firstName', 'N/A')} {data.get('lastName', 'N/A')}</p>
                    <p><strong>Email:</strong> {data.get('email', 'N/A')}</p>
                    <p><strong>Phone:</strong> {data.get('phone', 'N/A')}</p>
                    <p><strong>Company:</strong> {data.get('company', 'Not provided')}</p>
                </div>
                
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h3 style="color: #047857; margin-top: 0;">Project Details</h3>
                    <p><strong>Project Type:</strong> {data.get('projectType', 'N/A')}</p>
                    <p><strong>Budget:</strong> {data.get('budget', 'N/A')} PKR</p>
                    <p><strong>Description:</strong></p>
                    <p>{data.get('projectDescription', 'No description provided').replace('\n', '<br>')}</p>
                </div>
                
                <div style="background: #f5f3ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h3 style="color: #5b21b6; margin-top: 0;">Additional Information</h3>
                    <p><strong>Inspiration:</strong> {data.get('inspiration', 'None provided')}</p>
                    <p><strong>Requirements:</strong> {data.get('additionalInfo', 'None provided')}</p>
                </div>
                
                <p style="font-size: 0.9em; color: #6b7280;">
                    This request was submitted through the WebDuos project quote form.
                </p>
            </body>
        </html>
        """

# === Contact Form Endpoint ===
@app.route('/submit_contact', methods=['POST'])
def submit_contact():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    try:
        msg = EmailMessage()
        msg['Subject'] = f"WebDuos Contact: {subject}"
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = EMAIL_ADDRESS
        
        # Add both plain text and HTML versions
        msg.set_content(
            f"New Contact Form Submission\n\n"
            f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
            f"Name: {name}\n"
            f"Email: {email}\n"
            f"Subject: {subject}\n\n"
            f"Message:\n{message}"
        )
        
        msg.add_alternative(
            create_email_template('contact', {
                'name': name,
                'email': email,
                'subject': subject,
                'message': message
            }), 
            subtype='html'
        )

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)

        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# === Quote Form Endpoint ===
@app.route('/submit_quote', methods=['POST'])
def submit_quote():
    data = request.get_json()
    
    try:
        msg = EmailMessage()
        msg['Subject'] = f"New Project Quote: {data.get('firstName', '')} {data.get('lastName', '')}"
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = EMAIL_ADDRESS
        
        # Plain text version
        msg.set_content(
            f"New Project Quote Request\n\n"
            f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
            f"Client: {data.get('firstName', 'N/A')} {data.get('lastName', 'N/A')}\n"
            f"Email: {data.get('email', 'N/A')}\n"
            f"Phone: {data.get('phone', 'N/A')}\n"
            f"Company: {data.get('company', 'Not provided')}\n\n"
            f"Project Type: {data.get('projectType', 'N/A')}\n"
            f"Budget: {data.get('budget', 'N/A')} PKR\n\n"
            f"Description:\n{data.get('projectDescription', 'No description provided')}\n\n"
            f"Inspiration: {data.get('inspiration', 'None provided')}\n"
            f"Additional Requirements: {data.get('additionalInfo', 'None provided')}"
        )
        
        # HTML version
        msg.add_alternative(
            create_email_template('quote', data), 
            subtype='html'
        )

        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)

        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# === Run App ===
if __name__ == '__main__':
    app.run(debug=True)