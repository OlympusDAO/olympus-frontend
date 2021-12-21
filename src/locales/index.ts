import { i18n } from "@lingui/core";
import { en, fr, ko, tr, zh, ar, es, vi } from "make-plural/plurals";

// Declare locales
interface ILocale {
  flag: string;
  plurals: (n: number | string, ord?: boolean) => "zero" | "one" | "two" | "few" | "many" | "other";
  direction: "inherit" | "rtl";
}
interface ILocales {
  [locale: string]: ILocale;
}
export const locales: ILocales = {
  en: { flag: "gb", plurals: en, direction: "inherit" },
  fr: { flag: "fr", plurals: fr, direction: "inherit" },
  ko: { flag: "kr", plurals: ko, direction: "inherit" },
  tr: { flag: "tr", plurals: tr, direction: "inherit" },
  zh: { flag: "cn", plurals: zh, direction: "inherit" },
  ar: { flag: "sa", plurals: ar, direction: "rtl" },
  es: { flag: "es", plurals: es, direction: "inherit" },
  vi: { flag: "vn", plurals: vi, direction: "inherit" },
};
// Create translations style element
const translations_style_dom = document.createElement("style");
translations_style_dom.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(translations_style_dom);

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
  translations_style_dom.innerHTML = `.MuiTypography-root { direction: ${locales[locale].direction}; !important}`;
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
