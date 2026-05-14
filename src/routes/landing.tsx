import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { submitContact } from "@/lib/contact.functions";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { usePageSections, sectionBySlug } from "@/hooks/use-site-data";
import { useReveal } from "@/hooks/use-reveal";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/PageHero";
import { toast } from "sonner";

export const Route = createFileRoute("/landing")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Landing — Paulo Reis | Orion Legacy" },
      {
        name: "description",
        content:
          "Formulário de contacto Paulo Reis. Consultoria imobiliária estratégica no Algarve.",
      },
      { property: "og:title", content: "Landing — Paulo Reis" },
      {
        property: "og:description",
        content: "Diga-me o que procura e ajudo-o a pensar com clareza antes de agir.",
      },
    ],
  }),
});

function LandingPage() {
  const { sections } = usePageSections("contactos");
  const hero = sectionBySlug(sections, "hero");
  const heroRef = useReveal();
  const formRef = useReveal();

  const submit = useServerFn(submitContact);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { source_page: "landing" },
  });

  const onSubmit = async (values: ContactInput) => {
    try {
      const res = await submit({ data: values });
      if (res.ok) {
        setSubmitted(true);
        toast.success("Mensagem enviada. Responderei em 24h úteis.");
        reset();
      } else {
        toast.error(res.error ?? "Erro ao enviar mensagem.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <>
      {/* Hero */}
      <div ref={heroRef} className="reveal">
        <PageHero
          eyebrow="Landing"
          title="Formulário de Contacto"
          description={hero?.content ?? "Cada decisão estruturada começa por uma conversa honesta."}
          imageUrl={hero?.image_url}
        />
      </div>

      {/* Form */}
      <section className="bg-[var(--light-bg)] px-4 py-20 sm:py-28">
        <div ref={formRef} className="reveal mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-md border border-[var(--neutral-dark)]/10 bg-white p-8 shadow-[var(--shadow-premium)] sm:p-12">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
            <h2 className="font-display text-3xl text-[var(--navy)] sm:text-4xl">
              Envie a sua mensagem
            </h2>
            <p className="mt-2 text-sm text-[var(--neutral-dark)]/70">
              Os campos marcados com * são obrigatórios.
            </p>

            {submitted ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-md border border-[var(--gold)]/30 bg-[var(--accent-soft)] p-12 text-center">
                <CheckCircle2 className="h-14 w-14 text-[var(--gold)]" />
                <h3 className="font-display text-2xl text-[var(--navy)]">Mensagem enviada</h3>
                <p className="max-w-sm text-[var(--neutral-dark)]">
                  Obrigado pelo seu contacto. Receberá resposta em 24h úteis.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-sm font-semibold uppercase tracking-wider text-[var(--gold)] hover:underline"
                >
                  Enviar nova mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Nome *" error={errors.name?.message}>
                    <Input
                      {...register("name")}
                      placeholder="O seu nome"
                      className="h-11 border-[var(--neutral-dark)]/20"
                    />
                  </Field>
                  <Field label="Email *" error={errors.email?.message}>
                    <Input
                      type="email"
                      {...register("email")}
                      placeholder="email@exemplo.com"
                      className="h-11 border-[var(--neutral-dark)]/20"
                    />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Telefone" error={errors.phone?.message}>
                    <Input
                      {...register("phone")}
                      placeholder="+351 ..."
                      className="h-11 border-[var(--neutral-dark)]/20"
                    />
                  </Field>
                  <Field label="Assunto" error={errors.subject?.message}>
                    <Input
                      {...register("subject")}
                      placeholder="Sobre o que pretende falar"
                      className="h-11 border-[var(--neutral-dark)]/20"
                    />
                  </Field>
                </div>
                <Field label="Mensagem *" error={errors.message?.message}>
                  <Textarea
                    {...register("message")}
                    placeholder="Descreva o que procura..."
                    rows={6}
                    className="border-[var(--neutral-dark)]/20"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-md px-7 py-4 text-sm font-semibold uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      A enviar…
                    </>
                  ) : (
                    <>
                      Enviar mensagem <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
                <p className="text-xs text-[var(--neutral-dark)]/60">
                  Ao enviar, concorda com a nossa{" "}
                  <a href="/politica-privacidade" className="text-[var(--gold)] hover:underline">
                    Política de Privacidade
                  </a>
                  .
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--navy)]">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}