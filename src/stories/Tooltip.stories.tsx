import { ComponentMeta } from "@storybook/react";
import React from "react";
import Tooltip from "src/components/library/Tooltip/Tooltip";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/Tooltip",
  component: Tooltip,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof Tooltip>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Test = () => <>Testing Message</>;
export const ToolTipExample = () => (
  <Tooltip message="hello">
    <>This can be any type of child element</>
  </Tooltip>
);
export const ToolTipExampleComponent = () => (
  <Tooltip message={<Test />}>
    <>This can be any type of child element</>
  </Tooltip>
);
// More on args: https://storybook.js.org/docs/react/writing-stories/args
