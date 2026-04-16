import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock } from "lucide-react";
import logoUrl from "@/assets/logo-paulo-reis.png";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError("Credenciais inválidas.");
      setLoading(false);
      return;
    }
    router.navigate({ to: "/admin" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A192F] px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <img src={logoUrl} alt="Paulo Reis" className="mx-auto h-12 w-auto" />
          <h1 className="mt-4 font-serif text-2xl text-[#0A192F]">Painel Administrativo</h1>
          <p className="mt-1 text-sm text-slate-500">Acesso restrito</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#C5A065] focus:outline-none focus:ring-1 focus:ring-[#C5A065]"
              placeholder="geral@paulo-reis.pt"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#C5A065] focus:outline-none focus:ring-1 focus:ring-[#C5A065]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#C5A065] px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-[#0A192F] transition-colors hover:bg-[#C5A065]/90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
