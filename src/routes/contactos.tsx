import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { submitContact } from "@/server/contact.functions";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { useSiteSettings, usePageSections, sectionBySlug } from "@/hooks/use-site-data";
import { useReveal } from "@/hooks/use-reveal";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/PageHero";
import { toast } from "sonner";

export const Route = createFileRoute("/contactos")({
  component: ContactosPage,
  head: () => ({
    meta: [
      { title: "Contactos — Paulo Reis | Orion Legacy" },
      {
        name: "description",
        content:
          "Fale com Paulo Reis. Consultoria imobiliária estratégica no Algarve. Resposta em 24h úteis.",
      },
      { property: "og:title", content: "Contactos — Paulo Reis" },
      {
        property: "og:description",
        content: "Diga-me o que procura e ajudo-o a pensar com clareza antes de agir.",
      },
    ],
  }),
});

function ContactosPage() {
  const { settings } = useSiteSettings();
  const { sections } = usePageSections("contactos");
  const hero = sectionBySlug(sections, "hero");
  const info = sectionBySlug(sections, "info");
  const heroRef = useReveal();
  const formRef = useReveal();

  const submit = useServerFn(submitContact);
  const [submitted, setSubmitted] = useState(false);

  const phone = settings["contact_phone"] ?? "+351 912 345 678";
  const email = settings["contact_email"] ?? "geral@pauloreis.pt";
  const address =
    settings["contact_address"] ?? "Rua Serpa Pinto 69, 8500-706 Portimão";
  const rawMap =
    settings["contact_map_url"] ??
    settings["contact_map_embed"] ??
    "Rua Serpa Pinto 69, 8500-706 Portimão, Portugal";
  // Aceita qualquer um destes formatos colados pelo admin:
  //  - HTML completo do <iframe ... src="..."> (Google Maps → Partilhar → Incorporar)
  //  - URL de embed direta (https://www.google.com/maps/embed?...)
  //  - URL normal/partilha do Google Maps (https://www.google.com/maps/place/.../@lat,lng,...)
  //  - URL curta (https://maps.app.goo.gl/...)
  //  - Apenas uma morada em texto
  const toEmbedSrc = (val: string): string => {
    const v = (val ?? "").trim();
    if (!v) {
      const q = encodeURIComponent(
        address || "Rua Serpa Pinto 69, 8500-706 Portimão, Portugal",
      );
      return `https://www.google.com/maps?q=${q}&output=embed`;
    }
    // 1) HTML de iframe → extrair src
    const iframeMatch = v.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i);
    if (iframeMatch) return iframeMatch[1];
    // 2) Já é uma URL embed válida
    if (/google\.[^/]+\/maps\/embed/i.test(v)) return v;
    if (/[?&]output=embed/i.test(v)) return v;
    // 3) URL do Google Maps com coordenadas @lat,lng
    const coord = v.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coord) {
      return `https://www.google.com/maps?q=${coord[1]},${coord[2]}&z=17&output=embed`;
    }
    // 4) URL com /place/<nome>
    const place = v.match(/\/place\/([^/@?]+)/i);
    if (place) {
      const name = decodeURIComponent(place[1]).replace(/\+/g, " ");
      return `https://www.google.com/maps?q=${encodeURIComponent(name)}&output=embed`;
    }
    // 5) Qualquer outra URL ou texto livre → tratar como query
    return `https://www.google.com/maps?q=${encodeURIComponent(v)}&output=embed`;
  };
  const mapEmbed = toEmbedSrc(rawMap);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { source_page: "contactos" },
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
          eyebrow={hero?.subtitle ?? "Contactos"}
          title={hero?.title ?? "Vamos conversar."}
          description={hero?.content ?? "Cada decisão estruturada começa por uma conversa honesta."}
          imageUrl={hero?.image_url}
        />
      </div>

      {/* Form + Info */}
      <section className="bg-[var(--light-bg)] px-4 py-20 sm:py-28">
        <div ref={formRef} className="reveal mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Form */}
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

          {/* Info card */}
          <aside className="space-y-4">
            <div className="rounded-md border border-[var(--neutral-dark)]/10 bg-[var(--navy-deep)] p-8 text-white shadow-[var(--shadow-premium)]">
              <h3 className="font-display text-2xl text-[var(--gold)]">
                {info?.title ?? "Informação de contacto"}
              </h3>
              {info?.content && (
                <p className="mt-2 text-sm text-white/70">{info.content}</p>
              )}

              <ul className="mt-6 space-y-5">
                <ContactRow icon={Phone} label="Telefone" href={`tel:${phone.replace(/\s/g, "")}`}>
                  {phone}
                </ContactRow>
                <ContactRow icon={Mail} label="Email" href={`mailto:${email}`}>
                  {email}
                </ContactRow>
                <ContactRow icon={MapPin} label="Localização">
                  {address}
                </ContactRow>
              </ul>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-md border border-[var(--neutral-dark)]/10 shadow-[var(--shadow-premium)]">
              <iframe
                title="Mapa Paulo Reis — Algarve"
                src={mapEmbed}
                width="100%"
                height="320"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
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

function ContactRow({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: typeof Mail;
  label: string;
  href?: string;
  children: React.ReactNode;
}) {
  const inner = (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--gold)]/15 text-[var(--gold)]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">{label}</div>
        <div className="mt-0.5 break-words text-sm text-white">{children}</div>
      </div>
    </div>
  );
  return (
    <li>
      {href ? (
        <a href={href} className="block transition-opacity hover:opacity-80">
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
}
