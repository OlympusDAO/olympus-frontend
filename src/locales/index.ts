import { i18n } from "@lingui/core";
import { en, fr, ko, tr, zh, ar, es } from "make-plural/plurals";

// Declare locales
interface ILocale {
  flag: string;
  plurals: (n: number | string, ord?: boolean) => "zero" | "one" | "two" | "few" | "many" | "other";
}
interface ILocales {
  [locale: string]: ILocale;
}
export const locales: ILocales = {
  en: { flag: "gb", plurals: en },
  fr: { flag: "fr", plurals: fr },
  ko: { flag: "kr", plurals: ko },
  tr: { flag: "tr", plurals: tr },
  zh: { flag: "cn", plurals: zh },
  ar: { flag: "sa", plurals: ar },
  es: { flag: "es", plurals: es },
};

// Load locale data
for (var [key, locale] of Object.entries(locales)) {
  i18n.loadLocaleData(key, { plurals: locale.plurals });
}

async function fetchLocale(locale: string = "en") {
  const { messages } = await import(
    /* webpackChunkName: "[request]" */ `../locales/translations/olympus-frontend/${locale}/messages`
  );
  i18n.load(locale, messages);
  i18n.activate(locale);
}
export function selectLocale(locale: string) {
  window.localStorage.setItem("locale", locale);
  return fetchLocale(locale);
}
export function initLocale() {
  var locale = window.localStorage.getItem("locale") as string;
  if (!Object.keys(locales).includes(locale)) locale = "en";
  fetchLocale(locale);
}
