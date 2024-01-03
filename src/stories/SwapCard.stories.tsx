import { Button, InputAdornment } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Paper from "src/components/library/Paper";
import SwapCard from "src/components/library/SwapCard";

export default {
  title: "Visualization/SwapCard",
  component: SwapCard,
  parameters: {},
} as ComponentMeta<typeof SwapCard>;

const Template: ComponentStory<typeof SwapCard> = args => (
  <Paper>
    <SwapCard {...args} />
  </Paper>
);

export const Default = Template.bind({});
export const HelperText = Template.bind({});
export const EndAdornment = Template.bind({});
export const MegaAdornment = Template.bind({});
export const EndString = Template.bind({});
export const Error = Template.bind({});
export const InfoElement = Template.bind({});

Default.args = {
  label: "Unstaked Balance",
  id: "unstaked-balance",
};
HelperText.args = {
  label: "Unstaked Balance",
  id: "unstaked-balance",
  helperText: "Just some helper text, here",
};
InfoElement.args = {
  label: "Unstaked Balance",
  id: "unstaked-balance",
  helperText: "Just some helper text, here",
  info: "Some additional info",
};
EndAdornment.args = {
  label: "Unstaked Balance",
  id: "unstaked-balance",
  helperText: "Just some helper text, here",
  endAdornment: (
    <InputAdornment position="end">
      <Button variant="text">Max</Button>
    </InputAdornment>
  ),
};
MegaAdornment.args = {
  id: "mega-adornment",
  placeholder: "Enter an Amount",
  type: "number",
  label: "sOHM Allocation",
  startAdornment: "wsOHM",
  endAdornment: (
    <InputAdornment position="end">
      <Button variant="text">Max</Button>
    </InputAdornment>
  ),
};
EndString.args = {
  id: "mega-adornment",
  placeholder: "Enter an Amount",
  endString: "Hello",
  endStringOnClick: () => console.log("Clicked"),
};
Error.args = {
  label: "Unstaked Balance",
  id: "unstaked-balance",
  helperText: "Just some helper text, here",
  error: true,
};
