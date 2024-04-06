export const LangValues = ['en', 'ru', 'ua'] as const;
export type TypeLang = typeof LangValues[number];

export const Locale: Record<TypeLang, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  ua: 'uk-UA'
}

