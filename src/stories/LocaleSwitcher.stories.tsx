import { ComponentMeta, ComponentStory } from "@storybook/react";
import LocaleSwitcher from "src/components/library/LocaleSwitcher";

export default {
  title: "Visualization/LocaleSwitcher",
  component: LocaleSwitcher,
} as ComponentMeta<typeof LocaleSwitcher>;

const Template: ComponentStory<typeof LocaleSwitcher> = args => <LocaleSwitcher {...args} />;

export const Primary = Template.bind({});

Primary.args = {
  initialLocale: "en",
  locales: {
    en: { flag: "gb", plurals: {}, direction: "inherit" },
    fr: { flag: "fr", plurals: {}, direction: "inherit" },
    ko: { flag: "kr", plurals: {}, direction: "inherit" },
    de: { flag: "de", plurals: {}, direction: "inherit" },
  },
  onLocaleChange: (locale: string) => console.log(`localeChanged to ${locale}`),
};
