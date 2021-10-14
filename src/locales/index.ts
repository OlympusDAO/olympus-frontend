import { i18n } from "@lingui/core";
import { en, fr } from "make-plural/plurals";

export const locales = {
  en: "English",
  fr: "French",
};

i18n.loadLocaleData({
  en: { plurals: en },
  fr: { plurals: fr },
});

export async function fetchLocale(locale = "en") {
  const { messages } = await import(/* webpackChunkName: "[request]" */ `../locales/translations/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

fetchLocale();
