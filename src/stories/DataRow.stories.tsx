import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import DataRow from "src/components/library/DataRow";
import Paper from "src/components/library/Paper";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/DataRow",
  component: DataRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof DataRow>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof DataRow> = args => (
  <Paper>
    <DataRow {...args} />
  </Paper>
);

export const Primary = Template.bind({});
export const SubItem = Template.bind({});
export const Loading = Template.bind({});
export const WithChildren = Template.bind({});
export const WithTooltip = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  title: "Unstaked Balance",
  balance: "23.32",
  isLoading: false,
};
WithTooltip.args = {
  title: "Unstaked Balance",
  balance: "23.32",
  isLoading: false,
  tooltip: "Unstaked Balance",
};
SubItem.args = {
  title: "Unstaked Balance",
  balance: "23.32",
  indented: true,
  isLoading: false,
};
WithChildren.args = {
  title: "Unstaked Balance",
  balance: "23.32",
  children: <DataRow title="Unstaked Balance" balance="23.32" />,
};
Loading.args = {
  title: "Unstaked Balance",
  balance: "23.32",
  isLoading: true,
};

export const StakeViewExample = () => (
  <Paper>
    <DataRow title="Unstaked Balance" balance="23.32" />
    <DataRow title="Unstaked Balance" balance="23.32" />
    <DataRow title="Staked Balance" balance="23.32">
      <DataRow title="Staked Balance" balance="23.32" />
      <DataRow title="Staked Balance" balance="23.32" />
      <DataRow title="Staked Balance" balance="23.32" />
    </DataRow>
  </Paper>
);
