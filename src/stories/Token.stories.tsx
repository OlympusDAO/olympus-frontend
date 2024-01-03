import { Box } from "@mui/material";
import { ComponentMeta } from "@storybook/react";
import React from "react";
import Token from "src/components/library/Token/Token";
import tokensLib from "src/components/library/Token/tokensLib";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/Token",
  component: Token,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof Token>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

export const Library = () => {
  const tokens = Object.keys(tokensLib).map(name => {
    const tokenName = name as keyof typeof tokensLib;
    return (
      <Box mr={2} flexDirection="column">
        <Token key={tokenName} name={tokenName} />
        <p>{tokenName}</p>
      </Box>
    );
  });
  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap" textAlign="center">
      {tokens}
    </Box>
  );
};
// More on args: https://storybook.js.org/docs/react/writing-stories/args
