import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import VoteBreakdown from "src/components/library/VoteBreakdown";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Governance/VoteBreakdown",
  component: VoteBreakdown,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof VoteBreakdown>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof VoteBreakdown> = args => <VoteBreakdown {...args} />;

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  voteForLabel: "Yes",
  voteAgainstLabel: "No",
  voteParticipationLabel: "Maybe So",
  voteForCount: 20000,
  voteAgainstCount: 10000,
  quorum: 33000,
  totalHoldersCount: 100000,
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
