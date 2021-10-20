import { i18n } from "@lingui/core";
import { en, fr, ko } from "make-plural/plurals";

// Declare locales
interface ILocale {
  flag: string;
  plurals: (n: number | string, ord?: boolean) => "zero" | "one" | "two" | "few" | "many" | "other";
}
interface ILocales {
  [locale: string]: ILocale;
}
export const locales: ILocales = {
  en: { flag: "us", plurals: en },
  fr: { flag: "fr", plurals: fr },
  ko: { flag: "kr", plurals: ko },
};

// Load locale data
for (var [key, locale] of Object.entries(locales)) {
  i18n.loadLocaleData(key, { plurals: locale.plurals });
}

export async function fetchLocale(locale: string = "en") {
  const { messages } = await import(/* webpackChunkName: "[request]" */ `../locales/translations/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

fetchLocale();
