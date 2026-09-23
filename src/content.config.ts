import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Text that differs between languages. The brand lets src/i18n/cv.ts tell it
// apart from strings that stay the same in every language.
export const text = z.string().trim().min(1).brand<"text">();

// Names of people, organisations and projects stay the same in every language.
const properName = z.string().trim().min(1);

// Coerced because YAML reads an unquoted year like 2019 as a number.
const yearMonth = z.coerce
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, "Use YYYY or YYYY-MM");

const link = z.url({ protocol: /^https?$/ });

export const cvSchema = z.strictObject({
  name: properName,
  role: text,
  summary: text,
  about: text,
  experience: z
    .array(
      z.strictObject({
        title: text,
        organisation: properName,
        location: text,
        start: yearMonth,
        // Left out for a current role.
        end: yearMonth.optional(),
        achievements: z.array(text).min(2).max(4),
      }),
    )
    .min(1),
  work: z
    .array(
      z.strictObject({
        name: properName,
        description: text,
        role: text,
        url: link,
      }),
    )
    .min(1),
  skills: z
    .array(
      z.strictObject({
        name: text,
        items: z.array(text).min(1),
      }),
    )
    .min(1),
  education: z
    .array(
      z.strictObject({
        title: text,
        institution: text,
        // Left out for a certification with a single date.
        start: yearMonth.optional(),
        end: yearMonth,
      }),
    )
    .min(1),
  languages: z
    .array(
      z.strictObject({
        name: text,
        level: text,
      }),
    )
    .min(1),
  contact: z.strictObject({
    intro: text,
    email: z.email(),
    linkedin: link,
    github: link,
    business: z.strictObject({
      name: properName,
      url: link,
    }),
  }),
});

// A translation has the same shape as the English CV but keeps only the
// translatable text, all of it optional. Anything else is rejected, so a date
// or link in de.yaml fails the build instead of being silently ignored.
function translationShape(schema: z.ZodObject) {
  const shape: Record<string, z.ZodOptional<z.ZodType>> = {};
  for (const [key, field] of Object.entries(schema.shape)) {
    const translated = translationOf(field);
    if (translated) {
      shape[key] = translated.optional();
    }
  }
  return z.strictObject(shape);
}

function translationOf(schema: z.core.$ZodType): z.ZodType | undefined {
  if (schema === text) {
    return text;
  }
  if (schema instanceof z.ZodOptional) {
    return translationOf(schema.unwrap());
  }
  if (schema instanceof z.ZodArray) {
    const element = translationOf(schema.element);
    return element && z.array(element);
  }
  if (schema instanceof z.ZodObject) {
    const translated = translationShape(schema);
    return Object.keys(translated.shape).length > 0 ? translated : undefined;
  }
  return undefined;
}

const cv = defineCollection({
  loader: glob({ pattern: "en.yaml", base: "./src/content/cv" }),
  schema: cvSchema,
});

const cvTranslations = defineCollection({
  loader: glob({ pattern: ["de.yaml", "pl.yaml"], base: "./src/content/cv" }),
  schema: translationShape(cvSchema),
});

export const collections = { cv, cvTranslations };
