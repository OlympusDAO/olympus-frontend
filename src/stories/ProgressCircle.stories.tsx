import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import ProgressCircle from "src/components/library/ProgressCircle";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/ProgressCircle",
  component: ProgressCircle,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof ProgressCircle>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof ProgressCircle> = args => <ProgressCircle {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  balance: "$714k",
  label: "Profit",
  progress: 80,
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
