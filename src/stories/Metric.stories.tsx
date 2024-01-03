import { ComponentMeta, ComponentStory } from "@storybook/react";
import Metric from "src/components/library/Metric";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/Metric",
  component: Metric,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Metric>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Metric> = args => <Metric {...args} />;

export const Loading = Template.bind({});
export const MetricAndLabel = Template.bind({});
export const Tooltip = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Loading.args = {
  label: "APY",
  metric: "5000%",
  isLoading: true,
};
MetricAndLabel.args = {
  label: "APY",
  metric: "5000%",
  isLoading: false,
};
Tooltip.args = {
  label: "Current Index",
  tooltip:
    "The current index tracks the amount of sOHM accumulated since the beginning of staking. Basically, how much sOHM one would have if they staked and held a single OHM from day 1.",
  metric: "40.3",
};
