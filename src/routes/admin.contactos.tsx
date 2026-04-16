import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Trash2, CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export const Route = createFileRoute("/admin/contactos")({
  component: AdminContacts,
});

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source_page: string | null;
  is_read: boolean;
  created_at: string;
}

function AdminContacts() {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Submission | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar.");
    } else {
      setItems((data as Submission[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(s: Submission) {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: !s.is_read })
      .eq("id", s.id);
    if (error) {
      toast.error("Erro ao atualizar.");
      return;
    }
    setItems((xs) => xs.map((x) => (x.id === s.id ? { ...x, is_read: !s.is_read } : x)));
  }

  async function remove(id: string) {
    if (!confirm("Eliminar esta submissão?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao eliminar.");
      return;
    }
    setItems((xs) => xs.filter((x) => x.id !== id));
    setOpen(null);
    toast.success("Eliminada.");
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#C5A065]" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Contactos"
        description="Submissões recebidas pelo formulário de contacto do site."
      />

      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
          Sem mensagens recebidas.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="w-10 p-3"></th>
                <th className="p-3">Nome</th>
                <th className="p-3">Email</th>
                <th className="p-3">Assunto</th>
                <th className="p-3">Data</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr
                  key={s.id}
                  className={`cursor-pointer border-b border-slate-100 hover:bg-slate-50 ${
                    !s.is_read ? "font-semibold" : ""
                  }`}
                  onClick={() => setOpen(s)}
                >
                  <td className="p-3">
                    {s.is_read ? (
                      <CheckCircle2 className="h-4 w-4 text-slate-300" />
                    ) : (
                      <Circle className="h-4 w-4 fill-[#C5A065] text-[#C5A065]" />
                    )}
                  </td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3 text-slate-600">{s.email}</td>
                  <td className="p-3 text-slate-600">{s.subject ?? "—"}</td>
                  <td className="p-3 text-xs text-slate-500">
                    {new Date(s.created_at).toLocaleString("pt-PT")}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(s.id);
                      }}
                      className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-serif text-xl text-[#0A192F]">{open.subject ?? "Sem assunto"}</h3>
              <button
                onClick={() => setOpen(null)}
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <dl className="mb-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="w-24 text-slate-500">Nome:</dt>
                <dd className="font-medium">{open.name}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 text-slate-500">Email:</dt>
                <dd>
                  <a href={`mailto:${open.email}`} className="text-[#C5A065] hover:underline">
                    {open.email}
                  </a>
                </dd>
              </div>
              {open.phone && (
                <div className="flex gap-2">
                  <dt className="w-24 text-slate-500">Telefone:</dt>
                  <dd>{open.phone}</dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="w-24 text-slate-500">Página:</dt>
                <dd className="text-slate-600">{open.source_page ?? "—"}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 text-slate-500">Data:</dt>
                <dd className="text-slate-600">
                  {new Date(open.created_at).toLocaleString("pt-PT")}
                </dd>
              </div>
            </dl>
            <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
              {open.message}
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => toggleRead(open)}
                className="flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
              >
                <Mail className="h-4 w-4" />
                Marcar como {open.is_read ? "não lido" : "lido"}
              </button>
              <a
                href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject ?? "")}`}
                className="rounded-md bg-[#C5A065] px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[#0A192F]"
              >
                Responder
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
