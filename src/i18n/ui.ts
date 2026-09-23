export const locales = ["en", "de", "pl"] as const;

export type Locale = (typeof locales)[number];

export function getLocale(value: string | undefined): Locale {
  const locale = locales.find((code) => code === value);
  if (!locale) {
    throw new Error(`Unknown locale: ${value}`);
  }
  return locale;
}

// Each language named in itself, so readers find their own language.
export const languageNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  pl: "Polski",
};

const en = {
  skipLink: "Skip to content",
  getInTouch: "Get in touch",
  downloadCv: "Download CV (PDF)",
  present: "present",
  sections: {
    about: "About",
    experience: "Experience",
    work: "Selected work",
    skills: "Skills",
    education: "Education",
    languages: "Languages",
    contact: "Contact",
  },
};

export type SectionId = keyof typeof en.sections;

export const ui: Record<Locale, typeof en> = {
  en,
  de: {
    skipLink: "Zum Inhalt springen",
    getInTouch: "Kontakt aufnehmen",
    downloadCv: "Lebenslauf herunterladen (PDF)",
    present: "heute",
    sections: {
      about: "Über mich",
      experience: "Berufserfahrung",
      work: "Ausgewählte Projekte",
      skills: "Kenntnisse",
      education: "Ausbildung",
      languages: "Sprachen",
      contact: "Kontakt",
    },
  },
  pl: {
    skipLink: "Przejdź do treści",
    getInTouch: "Skontaktuj się ze mną",
    downloadCv: "Pobierz CV (PDF)",
    present: "obecnie",
    sections: {
      about: "O mnie",
      experience: "Doświadczenie",
      work: "Wybrane projekty",
      skills: "Umiejętności",
      education: "Wykształcenie",
      languages: "Języki",
      contact: "Kontakt",
    },
  },
};
