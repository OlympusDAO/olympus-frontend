import { ComponentMeta, ComponentStory } from "@storybook/react";
import Proposal from "src/components/library/Proposal";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Governance/Proposal",
  component: Proposal,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof Proposal>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof Proposal> = args => <Proposal {...args} />;

export const Default = Template.bind({});
export const EndingSoon = Template.bind({});
export const WithVotes = Template.bind({});
export const ActiveProposal = Template.bind({});
export const Endorsement = Template.bind({});
export const Draft = Template.bind({});
export const Closed = Template.bind({});

const props = {
  status: "discussion",
  chipLabel: "Discussion",
  voteEndDate: Date.now() + 100000000,
  proposalTitle: "OIP-91: Olympus Governance Council",
  publishedDate: Date.now() - 100000000,
};
Default.args = {
  ...props,
};

EndingSoon.args = { ...props, voteEndDate: Date.now() + 1000000 };
WithVotes.args = { ...props, votesFor: 20, votesAgainst: 25, votesAbstain: 10 };
ActiveProposal.args = {
  ...props,
  status: "active",
  chipLabel: "Active",
  votesFor: 20,
  votesAgainst: 25,
  votesAbstain: 10,
};
Endorsement.args = { ...props, status: "endorsement", chipLabel: "Endorsement" };
Draft.args = { ...props, status: "draft", chipLabel: "Draft" };
Closed.args = { ...props, status: "closed", chipLabel: "Closed" };

// More on args: https://storybook.js.org/docs/react/writing-stories/args
