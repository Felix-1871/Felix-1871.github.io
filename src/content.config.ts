import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const text = z.string().trim().min(1);

// Coerced because YAML reads an unquoted year like 2019 as a number.
const yearMonth = z.coerce
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2]))?$/, "Use YYYY or YYYY-MM");

const link = z.url({ protocol: /^https?$/ });

const cv = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/cv" }),
  schema: z.object({
    name: text,
    role: text,
    summary: text,
    about: text,
    experience: z
      .array(
        z.object({
          title: text,
          organisation: text,
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
        z.object({
          name: text,
          description: text,
          role: text,
          url: link,
        }),
      )
      .min(1),
    skills: z
      .array(
        z.object({
          name: text,
          items: z.array(text).min(1),
        }),
      )
      .min(1),
    education: z
      .array(
        z.object({
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
        z.object({
          name: text,
          level: text,
        }),
      )
      .min(1),
    contact: z.object({
      intro: text,
      email: z.email(),
      linkedin: link,
      github: link,
      business: z.object({
        name: text,
        url: link,
      }),
    }),
  }),
});

export const collections = { cv };
