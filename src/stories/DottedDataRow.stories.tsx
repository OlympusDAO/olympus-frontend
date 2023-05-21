import { Box } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import DottedDataRow from "src/components/library/DottedDataRow";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/DottedDataRow",
  component: DottedDataRow,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof DottedDataRow>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof DottedDataRow> = args => (
  <Box
    p={"15px"}
    display="flex"
    style={{ background: "linear-gradient(237.43deg, #2B313D -12.81%, #171A20 132.72%)", maxWidth: "460px" }}
    flexDirection={"column"}
  >
    <DottedDataRow {...args} />
    <DottedDataRow {...args} />
    <DottedDataRow {...args} />
    <DottedDataRow {...args} />
    <DottedDataRow bold {...args} />
  </Box>
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
