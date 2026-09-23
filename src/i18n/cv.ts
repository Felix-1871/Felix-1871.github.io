import { getEntry, type CollectionEntry } from "astro:content";
import { z } from "astro/zod";
import { cvSchema, text } from "../content.config";
import type { Locale } from "./ui";

type Cv = CollectionEntry<"cv">["data"];

// Translatable text, marked lang="en" when it fell back to English.
export type Text = { text: string; lang?: "en" };

type Localized<T> =
  T extends z.infer<typeof text>
    ? Text
    : T extends (infer Item)[]
      ? Localized<Item>[]
      : T extends object
        ? { [Key in keyof T]: Localized<T[Key]> }
        : T;

export type LocalizedCv = Localized<Cv>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Walks the English CV alongside its schema. Translatable text is taken from
// the translation when present, otherwise from English with its path added to
// `missing`. Everything else, such as dates and links, comes from English.
function localize(
  schema: z.core.$ZodType,
  en: unknown,
  translation: unknown,
  path: string,
  missing: string[],
): unknown {
  if (schema === text) {
    if (typeof translation === "string") {
      return { text: translation };
    }
    missing.push(path);
    return { text: en, lang: "en" };
  }
  if (schema instanceof z.ZodOptional) {
    return localize(schema.unwrap(), en, translation, path, missing);
  }
  if (schema instanceof z.ZodArray && Array.isArray(en)) {
    const items = Array.isArray(translation) ? translation : [];
    if (items.length > en.length) {
      throw new Error(
        `${path} has ${items.length} entries, but en.yaml has only ${en.length}.`,
      );
    }
    return en.map((item, index) =>
      localize(schema.element, item, items[index], `${path}.${index}`, missing),
    );
  }
  if (schema instanceof z.ZodObject && isRecord(en)) {
    const fields = isRecord(translation) ? translation : {};
    return Object.fromEntries(
      Object.entries(en).map(([key, value]) => [
        key,
        localize(
          schema.shape[key],
          value,
          fields[key],
          path ? `${path}.${key}` : key,
          missing,
        ),
      ]),
    );
  }
  return en;
}

export async function loadCv(locale: Locale): Promise<LocalizedCv> {
  const en = await getEntry("cv", "en");
  if (!en) {
    throw new Error("No English CV found. Add src/content/cv/en.yaml.");
  }
  // localize() walks any schema, so its result is typed here instead.
  if (locale === "en") {
    return localize(cvSchema, en.data, en.data, "", []) as LocalizedCv;
  }

  const translation = await getEntry("cvTranslations", locale);
  if (!translation) {
    throw new Error(`No CV for ${locale}. Add src/content/cv/${locale}.yaml.`);
  }
  const missing: string[] = [];
  const cv = localize(
    cvSchema,
    en.data,
    translation.data,
    "",
    missing,
  ) as LocalizedCv;
  if (missing.length > 0) {
    console.warn(
      `${locale}.yaml: ${missing.length} fields fall back to English:\n  ${missing.join("\n  ")}`,
    );
  }
  return cv;
}
