import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nome demasiado curto")
    .max(100, "Nome demasiado longo"),
  email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(255, "Email demasiado longo"),
  phone: z
    .string()
    .trim()
    .max(30, "Telefone demasiado longo")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .max(150, "Assunto demasiado longo")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Mensagem demasiado curta (min. 10 caracteres)")
    .max(2000, "Mensagem demasiado longa (max. 2000 caracteres)"),
  source_page: z.string().trim().max(100).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
