import { ComponentMeta } from "@storybook/react";
import React from "react";
import SwapCard from "src/components/library/SwapCard";
import SwapCollection from "src/components/library/SwapCollection";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/SwapCollection",
  component: SwapCollection,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof SwapCollection>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const Default = () => (
  <SwapCollection
    UpperSwapCard={<SwapCard id={"uppper"} token="OHM" info="Balance 12343" endString="Max" />}
    LowerSwapCard={<SwapCard id={"lower"} token="DAI" />}
    arrowOnClick={function (): void {
      throw new Error("Function not implemented.");
    }}
  />
);

// More on args: https://storybook.js.org/docs/react/writing-stories/args
