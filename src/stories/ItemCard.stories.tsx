import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import ItemCard from "src/components/library/ItemCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/ItemCard",
  component: ItemCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof ItemCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof ItemCard> = args => (
  <>
    <ItemCard {...args} />
    <ItemCard {...args} />
  </>
);

export const Default = Template.bind({});
export const DisableFlip = Template.bind({});
export const CustomLabel = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  value: "$23.00",
  roi: "23.5%",
  tokens: ["FRAX"],
  days: "23 days",
  href: "/bonds",
  hrefText: "Bond DAI",
};
DisableFlip.args = {
  value: "$23.00",
  roi: "23.5%",
  tokens: ["OHM", "DAI"],
  days: "23 days",
  href: "/bonds",
  hrefText: "Bond DAI",
  disableFlip: true,
};
CustomLabel.args = {
  title: "Custom Label",
  value: "$23.00",
  roi: "23.5%",
  tokens: ["OHM", "DAI"],
  days: "23 days",
  href: "/bonds",
  hrefText: "Bond DAI",
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
