import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: ContactInput) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    // 1) Persist
    const { error: dbError } = await supabaseAdmin
      .from("contact_submissions")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
        source_page: data.source_page || "contactos",
      });

    if (dbError) {
      console.error("Contact insert error:", dbError);
      return { ok: false, error: "Não foi possível registar a sua mensagem." };
    }

    // 2) Email notification (best-effort)
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
      console.warn("Resend keys missing — skipping email send.");
      return { ok: true, emailed: false };
    }

    try {
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#0A192F">
          <h2 style="color:#C5A065;border-bottom:2px solid #C5A065;padding-bottom:8px">
            Nova mensagem — Site Paulo Reis
          </h2>
          <p><strong>Nome:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          ${data.phone ? `<p><strong>Telefone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
          ${data.subject ? `<p><strong>Assunto:</strong> ${escapeHtml(data.subject)}</p>` : ""}
          <p><strong>Mensagem:</strong></p>
          <div style="background:#F8FAFC;padding:16px;border-left:3px solid #C5A065;white-space:pre-wrap">
            ${escapeHtml(data.message)}
          </div>
          <p style="color:#64748b;font-size:12px;margin-top:24px">
            Origem: ${escapeHtml(data.source_page || "contactos")}
          </p>
        </div>
      `;

      const res = await fetch(`${GATEWAY_URL}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": RESEND_API_KEY,
        },
        body: JSON.stringify({
          from: "Site Paulo Reis <onboarding@resend.dev>",
          to: ["geral@pauloreis.pt"],
          reply_to: data.email,
          subject: `Novo contacto: ${data.subject || data.name}`,
          html,
        }),
      });

      if (!res.ok) {
        console.error("Resend error:", res.status, await res.text());
        return { ok: true, emailed: false };
      }

      return { ok: true, emailed: true };
    } catch (e) {
      console.error("Email send failed:", e);
      return { ok: true, emailed: false };
    }
  });

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
