import type { AstroURL } from "astro";

type TranslationDict = Record<string, string>;

const dictionaries: Record<string, () => Promise<TranslationDict>> = {
  en: () => import("../../i18n/en.json").then((m) => m.default),
  es: () => import("../../i18n/es.json").then((m) => m.default),
};

const cache = new Map<string, TranslationDict>();

export function getLangFromUrl(url: AstroURL | URL): string {
  const lang = url.pathname.split("/")[1];
  if (lang === "es") return "es";
  return "en";
}

export async function loadTranslations(lang: string): Promise<TranslationDict> {
  if (cache.has(lang)) return cache.get(lang)!;
  const loader = dictionaries[lang] || dictionaries.en;
  const dict = await loader();
  cache.set(lang, dict);
  return dict;
}

export function useTranslations(dict: TranslationDict) {
  return function t(key: string, fallback?: string): string {
    return dict[key] ?? fallback ?? key;
  };
}
