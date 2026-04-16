import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export const Route = createFileRoute("/admin/configuracoes")({
  component: AdminSettings,
});

const FIELDS: Array<{
  key: string;
  label: string;
  type: "text" | "textarea" | "email";
  category: string;
  placeholder?: string;
  hint?: string;
}> = [
  // Contact
  { key: "contact_email", label: "Email de contacto público", type: "email", category: "Contacto" },
  {
    key: "contact_form_to",
    label: "Email de destino do formulário",
    type: "email",
    category: "Contacto",
    hint: "Para onde são enviadas as submissões do formulário do site.",
  },
  { key: "contact_phone", label: "Telefone", type: "text", category: "Contacto" },
  { key: "contact_whatsapp", label: "Número de WhatsApp (formato +351...)", type: "text", category: "Contacto" },
  { key: "contact_address", label: "Morada", type: "textarea", category: "Contacto" },
  { key: "contact_map_url", label: "URL do mapa (Google Maps embed ou link)", type: "text", category: "Contacto" },
  // SEO
  { key: "site_title", label: "Meta title (global)", type: "text", category: "SEO" },
  { key: "site_description", label: "Meta description (global)", type: "textarea", category: "SEO" },
];

export function AdminSettings() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key, value")
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data ?? []).forEach((r) => (map[r.key] = r.value ?? ""));
        setValues(map);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      for (const f of FIELDS) {
        const { error } = await supabase
          .from("site_settings")
          .upsert(
            {
              key: f.key,
              value: values[f.key] ?? "",
              type: f.type === "textarea" ? "text" : f.type,
              category: f.category.toLowerCase(),
              label: f.label,
            },
            { onConflict: "key" }
          );
        if (error) throw error;
      }
      toast.success("Alterações publicadas com sucesso.");
    } catch (e) {
      toast.error("Erro ao guardar. Tente novamente.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#C5A065]" />
      </div>
    );
  }

  const grouped = FIELDS.reduce<Record<string, typeof FIELDS>>((acc, f) => {
    (acc[f.category] ??= []).push(f);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Configurações Gerais"
        description="Edite informações globais do site, contactos e SEO."
        action={
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-md bg-[#C5A065] px-5 py-2 text-sm font-semibold uppercase tracking-wider text-[#0A192F] transition-colors hover:bg-[#C5A065]/90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Publicar Alterações
          </button>
        }
      />

      <div className="space-y-8">
        {Object.entries(grouped).map(([cat, fields]) => (
          <section key={cat} className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-[#0A192F]">{cat}</h2>
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {f.label}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#C5A065] focus:outline-none focus:ring-1 focus:ring-[#C5A065]"
                    />
                  ) : (
                    <input
                      type={f.type}
                      value={values[f.key] ?? ""}
                      onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#C5A065] focus:outline-none focus:ring-1 focus:ring-[#C5A065]"
                    />
                  )}
                  {f.hint && <p className="mt-1 text-xs text-slate-500">{f.hint}</p>}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
