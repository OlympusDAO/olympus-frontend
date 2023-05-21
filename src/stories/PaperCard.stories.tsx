import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import PaperCard from "src/components/library/PaperCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/PaperCard",
  component: PaperCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof PaperCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof PaperCard> = args => <PaperCard {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
