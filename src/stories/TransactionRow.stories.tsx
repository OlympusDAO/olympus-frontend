import { Box } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import TransactionRow from "src/components/library/TransactionRow";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/TransactionRow",
  component: TransactionRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof TransactionRow>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof TransactionRow> = args => (
  <Box
    p={"15px"}
    display="flex"
    style={{ background: "linear-gradient(237.43deg, #2B313D -12.81%, #171A20 132.72%)", maxWidth: "460px" }}
    flexDirection={"column"}
  >
    <TransactionRow {...args} />
    <TransactionRow {...args} />
    <TransactionRow {...args} />
    <TransactionRow {...args} />
    <TransactionRow {...args} />
  </Box>
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
