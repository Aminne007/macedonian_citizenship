import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resendKey = process.env.RESEND_API_KEY?.trim();
const resend = resendKey ? new Resend(resendKey) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'Imperial Court <onboarding@resend.dev>';

function checkConfig(recipientEmail) {
  if (!resend) {
    console.warn(`[EMAIL] ⚠️ RESEND_API_KEY is not set in .env!`);
    console.warn(`[EMAIL] To send real emails to ${recipientEmail}, get a free key from https://resend.com and set RESEND_API_KEY=re_xxx in .env.`);
    return false;
  }
  return true;
}

/**
 * Send approval email with citizenship details
 */
export async function sendApprovalEmail(application) {
  if (!checkConfig(application.email)) return false;

  try {
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: application.email,
      subject: `👑 Citizenship Granted — ${application.national_code}`,
      html: `
        <div style="background:#090514;color:#F8F9FA;padding:40px 20px;font-family:'Segoe UI',sans-serif;text-align:center;">
          <div style="max-width:520px;margin:0 auto;background:linear-gradient(135deg,#180a33,#0d051c 60%,#260a4f);border:2px solid #FFD700;border-radius:18px;padding:32px;box-shadow:0 25px 50px rgba(0,0,0,0.8),0 0 30px rgba(255,215,0,0.3);">
            <h1 style="color:#FFD700;font-size:28px;margin-bottom:4px;">THE MACEDONIAN EMPIRE</h1>
            <p style="color:#FFF099;font-size:12px;letter-spacing:3px;margin-bottom:24px;">OFFICIAL CITIZEN IDENTIFICATION</p>
            
            <div style="background:rgba(42,8,92,0.5);border:1px solid rgba(255,215,0,0.3);border-radius:12px;padding:20px;margin-bottom:20px;text-align:left;">
              <p style="color:#FFD700;font-size:11px;margin-bottom:4px;">CITIZEN NAME</p>
              <h2 style="color:#FFFFFF;font-size:22px;margin-bottom:12px;">${application.full_name}</h2>
              
              <p style="color:#CBD5E1;font-size:11px;margin-bottom:4px;">INSTAGRAM</p>
              <p style="color:#FFD700;font-size:14px;margin-bottom:12px;">${application.instagram}</p>
              
              <p style="color:#CBD5E1;font-size:11px;margin-bottom:4px;">IMPERIAL TITLE</p>
              <p style="color:#FFF099;font-size:14px;font-weight:bold;">${application.royal_title}</p>
            </div>
            
            <div style="background:#FFD700;color:#0a0514;padding:10px 20px;border-radius:8px;display:inline-block;font-weight:bold;font-size:18px;letter-spacing:2px;">
              ${application.national_code}
            </div>
            <p style="color:#CBD5E1;font-size:11px;margin-top:8px;">NATIONAL IDENTIFICATION CODE</p>
            
            <hr style="border:1px solid rgba(255,215,0,0.2);margin:24px 0;" />
            <p style="color:#CBD5E1;font-size:12px;">Visit the portal to download your official ID card.</p>
            <p style="color:rgba(255,215,0,0.5);font-size:10px;margin-top:16px;">© 334 BC – 2026 AD Imperial Sovereign Court of Pella</p>
          </div>
        </div>
      `
    });
    console.log(`[EMAIL] ✅ Approval email sent successfully to ${application.email} (ID: ${res.id || 'ok'})`);
    return true;
  } catch (err) {
    console.error(`[EMAIL] ❌ Failed to send approval email to ${application.email}:`, err.message);
    return false;
  }
}

/**
 * Send rejection email
 */
export async function sendRejectionEmail(application) {
  if (!checkConfig(application.email)) return false;

  try {
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: application.email,
      subject: '⛔ Application Update — Macedonian Empire',
      html: `
        <div style="background:#090514;color:#F8F9FA;padding:40px 20px;font-family:'Segoe UI',sans-serif;text-align:center;">
          <div style="max-width:480px;margin:0 auto;background:linear-gradient(135deg,#1a0a30,#0d051c);border:2px solid rgba(220,38,38,0.5);border-radius:18px;padding:32px;">
            <h1 style="color:#EF4444;font-size:24px;">APPLICATION DECLINED</h1>
            <p style="color:#CBD5E1;font-size:14px;margin:16px 0;">Dear <strong style="color:#FFF;">${application.full_name}</strong>,</p>
            <p style="color:#CBD5E1;font-size:14px;line-height:1.6;">
              The Imperial Court of Pella has reviewed your application and regrets to inform you that your request for citizenship has been <strong style="color:#EF4444;">declined</strong>.
            </p>
            ${application.rejection_note ? `
              <div style="background:rgba(220,38,38,0.1);border:1px solid rgba(220,38,38,0.3);border-radius:8px;padding:16px;margin:16px 0;text-align:left;">
                <p style="color:#EF4444;font-size:11px;margin-bottom:4px;">REASON</p>
                <p style="color:#FCA5A5;font-size:13px;">${application.rejection_note}</p>
              </div>
            ` : ''}
            <hr style="border:1px solid rgba(255,215,0,0.1);margin:20px 0;" />
            <p style="color:rgba(203,213,225,0.5);font-size:11px;">© 334 BC – 2026 AD Imperial Sovereign Court of Pella</p>
          </div>
        </div>
      `
    });
    console.log(`[EMAIL] ✅ Rejection email sent to ${application.email}`);
    return true;
  } catch (err) {
    console.error(`[EMAIL] ❌ Failed to send rejection email:`, err.message);
    return false;
  }
}

/**
 * Send welcome email immediately upon application submission
 */
export async function sendWelcomeEmail(application) {
  if (!checkConfig(application.email)) return false;

  try {
    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to: application.email,
      subject: '🏛️ Application Received — Sovereign Court of Pella',
      html: `
        <div style="background:#090514;color:#F8F9FA;padding:40px 20px;font-family:'Segoe UI',sans-serif;text-align:center;">
          <div style="max-width:500px;margin:0 auto;background:linear-gradient(135deg,#180a33,#0d051c);border:2px solid #FFD700;border-radius:18px;padding:32px;box-shadow:0 25px 50px rgba(0,0,0,0.8),0 0 30px rgba(255,215,0,0.3);">
            <h1 style="color:#FFD700;font-size:24px;margin-bottom:4px;">THE MACEDONIAN EMPIRE</h1>
            <p style="color:#FFF099;font-size:12px;letter-spacing:2px;margin-bottom:20px;">ROYAL TRIAL SUBMISSION CONFIRMED</p>
            
            <p style="color:#CBD5E1;font-size:14px;line-height:1.6;margin-bottom:20px;">
              Greetings, <strong style="color:#FFFFFF;">${application.full_name}</strong> (@${application.instagram.replace(/^@/, '')}).
            </p>
            <p style="color:#CBD5E1;font-size:14px;line-height:1.6;margin-bottom:24px;">
              Your petition for citizenship and your answers to the Royal Trial have been delivered to the Sovereign Court of Pella. The King and Imperial Advisors are currently reviewing your allegiance.
            </p>
            
            <div style="background:rgba(42,8,92,0.6);border:1px dashed rgba(255,215,0,0.4);border-radius:12px;padding:16px;margin-bottom:24px;text-align:left;">
              <p style="color:#FFD700;font-size:11px;margin-bottom:4px;">STATUS</p>
              <p style="color:#FFF099;font-size:14px;font-weight:bold;margin:0;">AWAITING IMPERIAL REVIEW</p>
            </div>

            <p style="color:#CBD5E1;font-size:12px;">You can check your status anytime on the portal using your Instagram handle.</p>
            <hr style="border:1px solid rgba(255,215,0,0.15);margin:20px 0;" />
            <p style="color:rgba(255,215,0,0.5);font-size:10px;">© 334 BC – 2026 AD Imperial Sovereign Court of Pella</p>
          </div>
        </div>
      `
    });
    console.log(`[EMAIL] ✅ Welcome email sent to ${application.email}`);
    return true;
  } catch (err) {
    console.error(`[EMAIL] ❌ Failed to send welcome email:`, err.message);
    return false;
  }
}
