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
    const {
      name,
      company,
      email,
      phone,
      agents,
      product,
      industry,
      requirement,
      lang,
      source,
    } = body as {
      name: string;
      company: string;
      email: string;
      phone: string;
      agents: string;
      product: "CRM" | "ERP" | "BOTH";
      industry: string;
      requirement: string;
      lang: "en" | "es";
      source: "CRM" | "ERP" | "MAIN";
    };
    const productSource =
      source === "ERP" ? "ERP" : source === "MAIN" ? "MAIN" : "CRM";

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
        <div class="label">Product Interest</div>
        <div class="value">${product || "—"}</div>
      </div>
      <div class="field">
        <div class="label">Industry</div>
        <div class="value">${industry || "—"}</div>
      </div>
      <div class="field">
        <div class="label">Main Requirement</div>
        <div class="value">${requirement || "—"}</div>
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
    .cta { display:block; margin: 24px auto; text-align: center; }
    .cta a { display: inline-block; background: linear-gradient(135deg, #7B2FFF, #00D4FF); color: #fff; font-weight: bold; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 100px; }
    .footer { text-align: center; padding: 20px; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.05); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>¡Solicitud recibida! 🎉</h1></div>
    <div class="body">
      <p>Hola <strong>${name}</strong>,</p>
      <p>Hemos recibido tu solicitud. Si no agendaste tu reunión, elige el horario que mejor te convenga directamente en nuestro calendario:</p>
      <div class="cta"><a href="https://calendly.com/sale-nexusinfinitycorp/30min">📅 Agendar mi reunión ahora →</a></div>
      <p>Si ya elegiste un horario, ¡perfecto! Puedes usar el mismo enlace para reagendar en cualquier momento.</p>
      <p>¿Tienes alguna duda? Escríbenos a <a href="mailto:sale@nexusinfinitycorp.com" style="color:#00D4FF">sale@nexusinfinitycorp.com</a>.</p>
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
    .cta { display:block; margin: 24px auto; text-align: center; }
    .cta a { display: inline-block; background: linear-gradient(135deg, #7B2FFF, #00D4FF); color: #fff; font-weight: bold; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 100px; }
    .footer { text-align: center; padding: 20px; font-size: 11px; color: #64748b; border-top: 1px solid rgba(255,255,255,0.05); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>Request received! 🎉</h1></div>
    <div class="body">
      <p>Hi <strong>${name}</strong>,</p>
      <p>We've received your request. If you haven't scheduled your meeting yet, pick the time that works best for you directly on our calendar:</p>
      <div class="cta"><a href="https://calendly.com/sale-nexusinfinitycorp/30min">📅 Schedule my meeting now →</a></div>
      <p>If you've already picked a slot, great! You can use the same link to reschedule at any time.</p>
      <p>Any questions? Reach us at <a href="mailto:sale@nexusinfinitycorp.com" style="color:#00D4FF">sale@nexusinfinitycorp.com</a>.</p>
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
          ? "Agenda tu reunión con Nexus Infinity 📅"
          : "Schedule your meeting with Nexus Infinity 📅",
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
