/**
 * Email service for sending form submissions
 * Supports Gmail SMTP and other providers
 */

import nodemailer from 'nodemailer';
import { SITE_URL } from '@/lib/metadata';

export interface ContactFormEmail {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  wantsConsultation?: boolean;
  locale: 'fr' | 'en';
  timestamp: string;
}

export interface DataRequestEmail {
  id: string;
  requestType: 'access' | 'rectification' | 'portability' | 'deletion' | 'consent-withdrawal';
  name: string;
  email: string;
  company?: string;
  details?: string;
  locale: 'fr' | 'en';
  createdAt: string;
}

// Email configuration from environment variables
const resolvedPort = parseInt(process.env.SMTP_PORT || '587');
const resolvedSecure = (process.env.SMTP_SECURE === 'true') || resolvedPort === 465;
const requireTLS = process.env.SMTP_REQUIRE_TLS === 'true';

const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: resolvedPort,
  secure: resolvedSecure, // true for 465 (SSL), false for 587 (STARTTLS)
  requireTLS,
  auth: {
    user: process.env.SMTP_USER, // mailbox address (e.g., user@domain.com)
    pass: process.env.SMTP_PASS  // app-specific password
  }
};

// Destination emails (configurable via env, fallback to @solutionsimpactweb.com addresses)
const CONTACT_FORM_TO_EMAIL =
  process.env.CONTACT_FORM_EMAIL_TO?.trim() || 'info@solutionsimpactweb.com';

const TO_EMAIL =
  process.env.DATA_REQUEST_EMAIL_TO?.trim() || 'privacy@solutionsimpactweb.com';

/**
 * Create nodemailer transporter
 */
function createTransporter() {
  if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
    console.warn('Email service not configured. Missing SMTP_USER or SMTP_PASS environment variables.');
    return null;
  }

  return nodemailer.createTransport(EMAIL_CONFIG);
}

/**
 * Format email content based on form data
 */
function formatEmailContent(formData: ContactFormEmail): { subject: string; html: string; text: string } {
  const isConsultation = formData.wantsConsultation;
  const language = formData.locale;
  
  // Subject line
  const subject = isConsultation 
    ? `🗓️ Demande de consultation — Solutions Impact Web`
    : `📧 Nouveau message — Solutions Impact Web`;

  // HTML content
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #3B82F6, #1E40AF); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 15px; }
        .field strong { color: #1E40AF; }
        .consultation-badge { background: #DC2626; color: white; padding: 5px 10px; border-radius: 20px; font-weight: bold; font-size: 12px; }
        .message-box { background: #F3F4F6; padding: 15px; border-left: 4px solid #3B82F6; margin: 15px 0; }
        .footer { background: #F9FAFB; padding: 15px; text-align: center; color: #6B7280; border-top: 1px solid #E5E7EB; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Solutions Impact Web</h1>
        <p>Une division de Nakoliss Studios — Fondé par Daniel Germain</p>
      </div>
      
      <div class="content">
        ${isConsultation ? '<p><span class="consultation-badge">CONSULTATION REQUESTED</span></p>' : ''}
        
        <div class="field">
          <strong>Name:</strong> ${formData.name}
        </div>
        
        <div class="field">
          <strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a>
        </div>
        
        ${formData.phone ? `<div class="field"><strong>Phone:</strong> ${formData.phone}</div>` : ''}
        ${formData.company ? `<div class="field"><strong>Company:</strong> ${formData.company}</div>` : ''}
        
        <div class="field">
          <strong>Language:</strong> ${language === 'fr' ? '🇫🇷 French' : '🇺🇸 English'}
        </div>
        
        <div class="field">
          <strong>Submitted:</strong> ${new Date(formData.timestamp).toLocaleString()}
        </div>
        
        <div class="field">
          <strong>Message:</strong>
          <div class="message-box">${formData.message.replace(/\n/g, '<br>')}</div>
        </div>
        
        ${isConsultation ? `
          <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; border-left: 4px solid #F59E0B; margin: 15px 0;">
            <h3 style="margin: 0 0 10px 0; color: #92400E;">📞 Consultation Details</h3>
            <p style="margin: 0; color: #92400E;">
              This client has specifically requested a <strong>free 30-minute consultation</strong>. 
              Please prioritize this request and contact them within 24 hours.
            </p>
          </div>
        ` : ''}
      </div>
      
      <div class="footer">
        <p>Courriel envoyé depuis le formulaire de contact de Solutions Impact Web</p>
        <p><a href="${SITE_URL}">Visiter Solutions Impact Web</a></p>
      </div>
    </body>
    </html>
  `;

  // Plain text version
  const text = `
 Solutions Impact Web — ${isConsultation ? 'Demande de consultation' : 'Nouveau message'}

${isConsultation ? '⚠️  CONSULTATION REQUESTED' : ''}

Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
${formData.company ? `Company: ${formData.company}` : ''}
Language: ${language === 'fr' ? 'French' : 'English'}
Submitted: ${new Date(formData.timestamp).toLocaleString()}

Message:
${formData.message}

${isConsultation ? `
📞 CONSULTATION REQUESTED
This client has specifically requested a free 30-minute consultation.
Please prioritize this request and contact them within 24 hours.
` : ''}

---
 Courriel envoyé depuis le formulaire de contact de Solutions Impact Web
 Visiter: ${SITE_URL}
  `.trim();

  return { subject, html, text };
}

/**
 * Send contact form email
 */
export async function sendContactFormEmail(formData: ContactFormEmail): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter();
    if (!CONTACT_FORM_TO_EMAIL) {
      const errorMessage = 'Contact form destination email is not configured';
      console.error(errorMessage);
      return { success: false, error: errorMessage };
    }
    
    if (!transporter) {
      const errorMessage = 'Email service not configured (missing SMTP credentials)';
      console.error(errorMessage);
      console.log('Logging contact form submission for follow-up:');
      console.log('------- CONTACT FORM SUBMISSION -------');
      console.log(`Name: ${formData.name}`);
      console.log(`Email: ${formData.email}`);
      console.log(`Phone: ${formData.phone || 'Not provided'}`);
      console.log(`Company: ${formData.company || 'Not provided'}`);
      console.log(`Consultation: ${formData.wantsConsultation ? 'YES - REQUESTED' : 'No'}`);
      console.log(`Language: ${formData.locale}`);
      console.log(`Message: ${formData.message}`);
      console.log(`Timestamp: ${formData.timestamp}`);
      console.log('----------------------------------------');
      
      return { success: false, error: errorMessage };
    }

    const { subject, html, text } = formatEmailContent(formData);

    // Use SMTP_USER if configured, otherwise default to info@solutionsimpactweb.com
    const fromEmail = EMAIL_CONFIG.auth.user || 'info@solutionsimpactweb.com';
    
    const mailOptions = {
      from: `"Solutions Impact Web — Contact" <${fromEmail}>`,
      to: CONTACT_FORM_TO_EMAIL,
      replyTo: formData.email, // Allow replying directly to the person who submitted
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return { 
      success: true, 
      messageId: info.messageId 
    };

  } catch (error) {
    console.error('Failed to send email:', error);
    
    // Log the form submission even if email fails
    console.log('------- CONTACT FORM SUBMISSION (EMAIL FAILED) -------');
    console.log(`Name: ${formData.name}`);
    console.log(`Email: ${formData.email}`);
    console.log(`Phone: ${formData.phone || 'Not provided'}`);
    console.log(`Company: ${formData.company || 'Not provided'}`);
    console.log(`Consultation: ${formData.wantsConsultation ? 'YES - REQUESTED' : 'No'}`);
    console.log(`Language: ${formData.locale}`);
    console.log(`Message: ${formData.message}`);
    console.log(`Timestamp: ${formData.timestamp}`);
    console.log('-------------------------------------------------------');
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    };
  }
}

export async function sendDataRequestEmail(payload: DataRequestEmail): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter();
    if (!TO_EMAIL) {
      console.log('[email disabled] Data request would be sent:', payload);
      return { success: true, messageId: 'disabled' };
    }

    const subject = `Data request (${payload.requestType}) - ${payload.name}`;
    const detailsBlock = payload.details
      ? `<span class="label">Details</span><div class="value">${payload.details.split('\n').join('<br />')}</div>`
      : '';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; }
          .header { background: #0f172a; color: #ffffff; padding: 20px; }
          .section { padding: 20px; border-bottom: 1px solid #e2e8f0; }
          .label { font-weight: 600; color: #1d4ed8; display: block; margin-bottom: 4px; text-transform: uppercase; font-size: 13px; }
          .value { margin-bottom: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Law 25 data request</h1>
          <p>ID: ${payload.id} | Received: ${new Date(payload.createdAt).toLocaleString()}</p>
        </div>
        <div class="section">
          <span class="label">Name</span>
          <div class="value">${payload.name}</div>

          <span class="label">Email</span>
          <div class="value"><a href="mailto:${payload.email}">${payload.email}</a></div>

          ${payload.company ? `<span class="label">Company</span><div class="value">${payload.company}</div>` : ''}

          <span class="label">Preferred language</span>
          <div class="value">${payload.locale === 'fr' ? 'French' : 'English'}</div>

          <span class="label">Request type</span>
          <div class="value">${payload.requestType}</div>

          ${detailsBlock}
        </div>
      </body>
      </html>
    `;

    const textParts: Array<string | undefined> = [
      'Law 25 data request',
      `ID: ${payload.id}`,
      `Received: ${new Date(payload.createdAt).toLocaleString()}`,
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.company ? `Company: ${payload.company}` : undefined,
      `Preferred language: ${payload.locale === 'fr' ? 'French' : 'English'}`,
      `Request type: ${payload.requestType}`,
      payload.details ? `Details: ${payload.details}` : undefined,
    ];
    const text = textParts.filter(Boolean).join('\n');

    if (!transporter) {
      console.log('Email service not configured. Logging data request instead:', payload);
      return { success: true, messageId: 'logged-only', error: 'Email service not configured - logged to console' };
    }

    // Use SMTP_USER if configured, otherwise default to privacy@solutionsimpactweb.com
    const fromEmail = EMAIL_CONFIG.auth.user || 'privacy@solutionsimpactweb.com';
    
    const info = await transporter.sendMail({
      from: `"Solutions Impact Web — Conformité" <${fromEmail}>`,
      to: TO_EMAIL,
      replyTo: payload.email,
      subject,
      html,
      text,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send data request email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown email error' };
  }
}

export async function sendWaitlistConfirmationEmail(toEmail: string, confirmUrl?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter();
    if (!toEmail) {
      console.log('[email disabled] Waitlist confirmation would be sent to:', toEmail, confirmUrl);
      return { success: true, messageId: 'disabled' };
    }
    const base = SITE_URL.replace(/\/$/, '');
    const url = confirmUrl || `${base}/api/waitlist/confirm`;
    const subject = 'Confirmez votre inscription — Version anglaise';
    const html = `<!doctype html><html><head><meta charset="utf-8" /><style>body{font-family:Arial,sans-serif;color:#0f172a} .btn{display:inline-block;padding:10px 16px;background:#111827;color:#fff;text-decoration:none;border-radius:8px} .muted{color:#64748b}</style></head><body><h2>Confirmez votre inscription</h2><p>Merci de votre intérêt pour la version anglaise de notre site. Cliquez ci-dessous pour confirmer votre inscription :</p><p><a class="btn" href="${url}">Confirmer mon inscription</a></p><p class="muted">Si le bouton ne fonctionne pas, copiez-collez ce lien : ${url}</p></body></html>`;
    const text = `Confirmez votre inscription\n\n${url}`;

    if (!transporter) {
      console.log('Email service not configured. Would send confirmation to', toEmail, url);
      return { success: true, messageId: 'logged-only', error: 'Email service not configured - logged to console' };
    }

    // Use SMTP_USER if configured, otherwise default to support@solutionsimpactweb.com
    const fromEmail = EMAIL_CONFIG.auth.user || 'support@solutionsimpactweb.com';
    
    const info = await transporter.sendMail({
      from: `"Solutions Impact Web" <${fromEmail}>`,
      to: toEmail,
      subject,
      html,
      text,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send waitlist confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown email error' };
  }
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration(): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      return { 
        success: false, 
        error: 'Email service not configured. Please set SMTP_USER and SMTP_PASS environment variables.' 
      };
    }

    await transporter.verify();
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
