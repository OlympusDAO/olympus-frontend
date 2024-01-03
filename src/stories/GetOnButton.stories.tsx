import { Box } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
//@ts-ignore
import image from "src/assets/images/sushiswap.png";
import GetOnButton from "src/components/library/GetOnButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/GetOnButton",
  component: GetOnButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof GetOnButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof GetOnButton> = args => (
  <Box
    p={"15px"}
    display="flex"
    style={{ background: "linear-gradient(237.43deg, #2B313D -12.81%, #171A20 132.72%)", maxWidth: "460px" }}
    flexDirection={"column"}
  >
    <GetOnButton {...args} />
  </Box>
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  logo: <img alt="test" src={image} />,
  exchangeName: "SushiSwap",
  href: "https://www.sushiswap.com",
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
