import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import WalletBalance from "src/components/library/WalletBalance";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/WalletBalance",
  component: WalletBalance,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof WalletBalance>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof WalletBalance> = args => <WalletBalance {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  title: "Total Balance",
  usdBalance: "$476,694.54",
  underlyingBalance: "4,904.26 sOHM",
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
