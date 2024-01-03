import { Box } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import InfoCard from "src/components/library/InfoCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/InfoCard",
  component: InfoCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof InfoCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof InfoCard> = args => (
  <Box
    p={"15px"}
    display="flex"
    style={{ background: "linear-gradient(237.43deg, #2B313D -12.81%, #171A20 132.72%)", maxWidth: "460px" }}
    flexDirection={"column"}
  >
    <InfoCard {...args} />
  </Box>
);

export const Default = Template.bind({});
export const WithChip = Template.bind({});
export const PassedState = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  title: "Why do we need OlympusDAO in the first place?",
  content:
    "Dollar-pegged stablecoins have become an essential part of crypto due to their lack of volatility as compared to tokens such as Bitcoin and Ether.",
};
WithChip.args = {
  title: "Why do we need OlympusDAO in the first place?",
  content:
    "Dollar-pegged stablecoins have become an essential part of crypto due to their lack of volatility as compared to tokens such as Bitcoin and Ether.",
  timeRemaining: "ends in three days",
  status: "active",
  statusLabel: "Active",
};
PassedState.args = {
  title: "Why do we need OlympusDAO in the first place?",
  content:
    "Dollar-pegged stablecoins have become an essential part of crypto due to their lack of volatility as compared to tokens such as Bitcoin and Ether.",
  timeRemaining: "Has Passed",
  status: "passed",
  statusLabel: "Closed",
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
