import { ComponentMeta } from "@storybook/react";
import React from "react";
import Accordion from "src/components/library/Accordion";
import Paper from "src/components/library/Paper";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/Accordion",
  component: Accordion,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof Accordion>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const Default = () => {
  return (
    <Paper>
      <Accordion summary={<div>An Accordion Example</div>}>
        <div>Child element inside the Accordion</div>
      </Accordion>
    </Paper>
  );
};
