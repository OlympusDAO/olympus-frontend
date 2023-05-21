import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import TokenStack from "src/components/library/TokenStack";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Visualization/TokenStack",
  component: TokenStack,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof TokenStack>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof TokenStack> = args => <TokenStack {...args} />;

export const TwoTokens = Template.bind({});
export const ThreeTokens = Template.bind({});
export const TokenImages = Template.bind({});
TwoTokens.args = {
  tokens: ["OHM", "wETH"],
};
ThreeTokens.args = {
  tokens: ["CVX", "DAI", "wETH"],
};
TokenImages.args = {
  images: [
    "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
    "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png",
    "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png",
  ],
  tokens: ["CVX", "DAI", "wETH"],
};
// More on args: https://storybook.js.org/docs/react/writing-stories/args
