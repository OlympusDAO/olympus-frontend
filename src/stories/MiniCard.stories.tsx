import { ComponentMeta, ComponentStory } from "@storybook/react";
import MiniCard from "src/components/library/MiniCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/MiniCard",
  component: MiniCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof MiniCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof MiniCard> = args => <MiniCard {...args} />;

export const Default = Template.bind({});
export const NoLink = Template.bind({});
export const NoIcon = Template.bind({});
export const NoLabel = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  title: "Sample Title",
  label: "Sample Label",
  icon: "ETH",
  href: "https://www.google.com",
};

NoLink.args = {
  title: "Sample Title",
  label: "Sample Label",
  icon: "ETH",
};

NoIcon.args = {
  title: "Sample Title",
  label: "Sample Label",
};
NoLabel.args = {
  title: "Sample Title",
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
