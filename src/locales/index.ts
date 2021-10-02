import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { messages as enMessages } from "./en/messages";
import { messages as frMessages } from "./fr/messages";
import { Locale, Messages, AllMessages } from "@lingui/core";

interface LocaleDefinition {
  locale: Locale;
  flag: String;
  messages: Messages;
}

const localeDefinitions: Record<Locale, LocaleDefinition> = {
  en: { locale: "en", messages: enMessages, flag: "us" },
  fr: { locale: "fr", messages: frMessages, flag: "fr" },
};
const defaultLanguage: Locale = "fr";

for (const [locale, localeDefinition] of Object.entries(localeDefinitions)) {
  i18n.load(locale, localeDefinition.messages);
}

i18n.activate(defaultLanguage);

export { i18n, I18nProvider, localeDefinitions };
