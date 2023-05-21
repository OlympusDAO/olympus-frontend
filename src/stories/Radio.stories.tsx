import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import Radio from "src/components/library/Radio";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/Radio",
  component: Radio,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof Radio>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Radio> = args => <Radio {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
