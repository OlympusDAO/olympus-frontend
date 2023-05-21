import { ComponentMeta, ComponentStory } from "@storybook/react";
import InputWrapper from "src/components/library/InputWrapper";
import Paper from "src/components/library/Paper";

export default {
  title: "Layout/InputWrapper",
  component: InputWrapper,
  parameters: {},
} as ComponentMeta<typeof InputWrapper>;

const Template: ComponentStory<typeof InputWrapper> = args => (
  <Paper>
    <InputWrapper {...args} />
  </Paper>
);

export const Default = Template.bind({});
export const HelperText = Template.bind({});
export const Disabled = Template.bind({});

Default.args = {
  placeholder: "Enter an Amount",
  id: "unstaked-balance",
  endString: "Max",
  buttonText: "Stake to gOHM",
};
HelperText.args = {
  label: "Unstaked Balance",
  id: "unstaked-balance",
  endString: "Max",
  buttonText: "Stake to gOHM",
  helperText: "Just some helper text, here",
};
Disabled.args = {
  placeholder: "Enter an Amount",
  id: "unstaked-balance",
  endString: "Max",
  buttonText: "Pending",
  disabled: true,
};
