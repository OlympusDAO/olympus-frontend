import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import Alert from "src/components/library/Alert";

export default {
  title: "Visualization/Alert",
  component: Alert,
  parameters: {},
} as ComponentMeta<typeof Alert>;

export const Template: ComponentStory<typeof Alert> = args => {
  return <Alert {...args} />;
};

export const Default = Template.bind({});
export const Error = Template.bind({});

Default.args = {
  open: true,
  severity: "info",
  progress: 50,
  title: "Information",
  text: "Safety Check: Always verify you're on app.olympusdao.finance!",
};

Error.args = {
  open: true,
  severity: "error",
  progress: 50,
  title: "Error",
  text: "Error: This is a bad error",
};
