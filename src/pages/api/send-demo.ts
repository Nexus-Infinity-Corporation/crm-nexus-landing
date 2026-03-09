import type { APIRoute } from "astro";
import FormData from "form-data";
import Mailgun from "mailgun.js";

export const prerender = false;

const MAILGUN_API_KEY = import.meta.env.MAILGUN_API_KEY as string;
const MAILGUN_DOMAIN = "crm.nexusinfinity.site";
const RECIPIENT_EMAIL = "sale@nexusinfinitycorp.com";
const FROM_EMAIL = import.meta.env.MAILGUN_FROM_EMAIL
  ? `Nexus Meeting Form <${import.meta.env.MAILGUN_FROM_EMAIL}>`
  : `Nexus Meeting Form <noreply@${MAILGUN_DOMAIN}>`;

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({ username: "api", key: MAILGUN_API_KEY });

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, company, email, phone, agents, lang, source } = body as {
      name: string;
      company: string;
      email: string;
      phone: string;
      agents: string;
      lang: "en" | "es";
      source: "CRM" | "ERP" | "MAIN";
    };
    const productSource = source === "ERP" ? "ERP" : source === "MAIN" ? "MAIN" : "CRM";

    // Basic validation
    if (!name || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Name and email are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const isEs = lang === "es";

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #0a0f1e; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0,212,255,0.3); }
    .header { background: linear-gradient(135deg, #00D4FF, #7B2FFF); padding: 30px; text-align: center; }
    .header h1 { margin: 0; color: #fff; font-size: 22px; }
    .body { padding: 30px; }
    .field { margin-bottom: 18px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #00D4FF; margin-bottom: 4px; }
    .value { font-size: 16px; color: #f1f5f9; }
    .footer { text-align: center; padding: 20px; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.05); }
    .badge { display: inline-block; background: rgba(0,212,255,0.12); border: 1px solid rgba(0,212,255,0.4); border-radius: 20px; padding: 4px 14px; font-size: 11px; color: #00D4FF; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 New Meeting Request</h1>
    </div>
    <div class="body">
      <div class="badge">Lead · Nexus ${productSource}</div>
      <div class="field">
        <div class="label">Full Name</div>
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <div class="label">Company</div>
        <div class="value">${company || "—"}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${email}" style="color:#00D4FF">${email}</a></div>
      </div>
      <div class="field">
        <div class="label">Phone</div>
        <div class="value">${phone || "—"}</div>
      </div>
      <div class="field">
        <div class="label">Team Size (agents)</div>
        <div class="value">${agents || "—"}</div>
      </div>
      <div class="field">
        <div class="label">Language preference</div>
        <div class="value">${lang?.toUpperCase() || "EN"}</div>
      </div>
    </div>
    <div class="footer">Submitted via nexusinfinitycorp.com · Nexus Infinity Corporation</div>
  </div>
</body>
</html>`;

    const confirmationHtml = isEs
      ? `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #0a0f1e; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0,212,255,0.3); }
    .header { background: linear-gradient(135deg, #00D4FF, #7B2FFF); padding: 30px; text-align: center; }
    .header h1 { margin: 0; color: #fff; font-size: 22px; }
    .body { padding: 30px; line-height: 1.7; color: #cbd5e1; }
    .footer { text-align: center; padding: 20px; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.05); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>¡Tu reunion está en camino! 🚀</h1></div>
    <div class="body">
      <p>Hola <strong>${name}</strong>,</p>
      <p>Hemos recibido tu solicitud de reunion personalizada. Un miembro de nuestro equipo se pondrá en contacto contigo para agendar tu sesión.</p>
      <p>Mientras tanto, puedes explorar más sobre Nexus CRM en <a href="https://crm.nexusinfinitycorp.site" style="color:#00D4FF">nexusinfinitycorp.com</a>.</p>
      <p>¿Prefieres elegir el horario tú mismo? <a href="https://calendly.com/sale-nexusinfinitycorp/30min" style="color:#B088FF;font-weight:bold">Reserva directo en Calendly →</a></p>
      <p>¡Gracias por confiar en nosotros!</p>
      <p>— El equipo de Nexus Infinity</p>
    </div>
    <div class="footer">© Nexus Infinity Corporation · nexusinfinitycorp.com</div>
  </div>
</body>
</html>`
      : `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #0a0f1e; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #111827; border-radius: 12px; overflow: hidden; border: 1px solid rgba(0,212,255,0.3); }
    .header { background: linear-gradient(135deg, #00D4FF, #7B2FFF); padding: 30px; text-align: center; }
    .header h1 { margin: 0; color: #fff; font-size: 22px; }
    .body { padding: 30px; line-height: 1.7; color: #cbd5e1; }
    .footer { text-align: center; padding: 20px; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.05); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Your meeting is on its way! 🚀</h1></div>
    <div class="body">
      <p>Hi <strong>${name}</strong>,</p>
      <p>We've received your personalized meeting request. A member of our team will contact you  to schedule your session.</p>
      <p>In the meantime, feel free to explore more about Nexus CRM at <a href="https://crm.nexusinfinitycorp.site" style="color:#00D4FF">nexusinfinitycorp.com</a>.</p>
      <p>Want to pick a time yourself? <a href="https://calendly.com/sale-nexusinfinitycorp/30min" style="color:#B088FF;font-weight:bold">Book directly on Calendly →</a></p>
      <p>Thank you for choosing us!</p>
      <p>— The Nexus Infinity Team</p>
    </div>
    <div class="footer">© Nexus Infinity Corporation · nexusinfinitycorp.com</div>
  </div>
</body>
</html>`;

    // Send notification to sales team
    await mg.messages.create(MAILGUN_DOMAIN, {
      from: FROM_EMAIL,
      to: [RECIPIENT_EMAIL],
      subject: `🚀 New ${productSource} Meeting Request — ${name} (${company || "No company"}) <${email}>`,
      html: htmlBody,
    });

    // Send confirmation to the lead
    if (email) {
      await mg.messages.create(MAILGUN_DOMAIN, {
        from: FROM_EMAIL,
        to: [email],
        subject: isEs
          ? "¡Recibimos tu solicitud de reunion! — Nexus Infinity"
          : "We received your meeting request! — Nexus Infinity",
        html: confirmationHtml,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[send-demo] Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send email." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
