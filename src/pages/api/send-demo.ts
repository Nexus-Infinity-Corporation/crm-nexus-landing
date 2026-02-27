import type { APIRoute } from "astro";
import { MAILGUN_API_KEY, MAILGUN_DOMAIN, ADMIN_EMAIL } from "@/config/config.constants";

interface DemoRequest {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  agentes: string;
}

export const POST: APIRoute = async ({ request }) => {
  // Only accept POST requests
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body: DemoRequest = await request.json();

    // Validate required fields
    if (!body.nombre || !body.empresa || !body.email || !body.telefono || !body.agentes) {
      return new Response(JSON.stringify({ error: "Faltan campos requeridos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(JSON.stringify({ error: "Email inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if Mailgun is configured
    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN || !ADMIN_EMAIL) {
      console.error("Mailgun no está configurado correctamente");
      return new Response(JSON.stringify({ error: "Servicio de email no disponible" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Send email to admin
    const adminEmailResult = await sendMailgunEmail({
      to: ADMIN_EMAIL,
      subject: `Nueva solicitud de demo - ${body.nombre}`,
      html: generateAdminEmail(body),
    });

    if (!adminEmailResult.success) {
      throw new Error("Error al enviar email al admin");
    }

    // Send confirmation email to user
    const userEmailResult = await sendMailgunEmail({
      to: body.email,
      subject: "Hemos recibido tu solicitud de demo - CRM Nexus",
      html: generateUserEmail(body),
    });

    if (!userEmailResult.success) {
      console.warn("Email de confirmación al usuario falló, pero la solicitud fue registrada");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "¡Solicitud enviada! Nos pondremos en contacto en menos de 2 horas.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error en send-demo:", error);
    return new Response(JSON.stringify({ error: "Error al procesar la solicitud" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

async function sendMailgunEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean }> {
  const auth = Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64");

  const formData = new URLSearchParams();
  formData.append("from", `CRM Nexus <noreply@${MAILGUN_DOMAIN}>`);
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("html", html);

  try {
    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Mailgun error: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Mailgun send error:", error);
    return { success: false };
  }
}

function generateAdminEmail(data: DemoRequest): string {
  return `
    <h2>Nueva Solicitud de Demo</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(data.nombre)}</p>
    <p><strong>Empresa:</strong> ${escapeHtml(data.empresa)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(data.telefono)}</p>
    <p><strong>Agentes:</strong> ${escapeHtml(data.agentes)}</p>
    <p>Ponte en contacto con el cliente lo antes posible.</p>
  `;
}

function generateUserEmail(data: DemoRequest): string {
  return `
    <h2>¡Gracias por tu interés, ${escapeHtml(data.nombre)}!</h2>
    <p>Hemos recibido tu solicitud de demo personalizada.</p>
    <p>Nuestro equipo se pondrá en contacto contigo en menos de 2 horas en el email <strong>${escapeHtml(data.email)}</strong> o al teléfono <strong>${escapeHtml(data.telefono)}</strong>.</p>
    <p>Detalles de tu solicitud:</p>
    <ul>
      <li><strong>Empresa:</strong> ${escapeHtml(data.empresa)}</li>
      <li><strong>Equipo de agentes:</strong> ${escapeHtml(data.agentes)}</li>
    </ul>
    <p>Si tienes preguntas antes de la llamada, responde a este email.</p>
    <p>¡Estamos emocionados de mostrarte nuestro CRM!</p>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
