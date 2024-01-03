import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { InfoNotification } from "src/components/library/Notification";
import Paper from "src/components/library/Paper";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Layout/Paper",
  component: Paper,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Paper>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Paper> = args => <Paper {...args} />;

export const HeaderText = Template.bind({});
export const EmptyCard = Template.bind({});
export const WithTooltip = Template.bind({});
export const FullWidth = Template.bind({});
export const TopRightCTA = Template.bind({});
export const TopLeftCTA = Template.bind({});
export const TopLeftAndRightCTA = Template.bind({});
export const Testing = () => (
  <Paper>
    <InfoNotification>This is a test notification </InfoNotification>
  </Paper>
);

// More on args: https://storybook.js.org/docs/react/writing-stories/args
HeaderText.args = {
  headerText: "Single Stake (3,3)",
  subHeader: (
    <div>
      <strong>7 hrs, 4 min</strong> to next rebase
    </div>
  ),
};
EmptyCard.args = { children: "" };
WithTooltip.args = {
  headerText: "Single Stake (3,3)",
  tooltip: "This is a tooltip",
};
FullWidth.args = {
  headerText: "Single Stake (3,3)",
  fullWidth: true,
};
TopRightCTA.args = {
  headerText: "Single Stake (3,3)",
  topRight: <div>X</div>,
};
TopLeftCTA.args = {
  headerText: "Single Stake (3,3)",
  topLeft: <div>X</div>,
};
TopLeftAndRightCTA.args = {
  headerText: "Single Stake (3,3)",
  topLeft: <div>X</div>,
  topRight: <div>X</div>,
};
