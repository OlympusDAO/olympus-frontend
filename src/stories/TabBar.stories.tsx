import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import TabBar from "src/components/library/TabBar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/TabBar",
  component: TabBar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof TabBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof TabBar> = args => <TabBar {...args} />;

export const Default = Template.bind({});
export const CustomIsActive = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  items: [
    { label: "Wallet", to: "/wallet" },
    { label: "Dapp", to: "/dapp" },
  ],
};
CustomIsActive.args = {
  disableRouting: true,
  items: [
    { label: "Wallet", to: "/wallet?123", isActive: false },
    { label: "Dapp", to: "/wallet?32", isActive: true },
  ],
};

CustomIsActive.args = {
  disableRouting: true,
  items: [
    { label: "Wallet", to: "/wallet?123", isActive: false },
    { label: "Dapp", to: "/wallet?32", isActive: true },
  ],
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
