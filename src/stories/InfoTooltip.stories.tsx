import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import InfoTooltip from "src/components/library/InfoTooltip";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/InfoTooltip",
  component: InfoTooltip,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof InfoTooltip>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof InfoTooltip> = args => <InfoTooltip {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  message: "This is a tooltip",
};
