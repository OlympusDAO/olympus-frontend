import { Box } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import ArticleCard from "src/components/library/ArticleCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/ArticleCard",
  component: ArticleCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  parameters: {},
} as ComponentMeta<typeof ArticleCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const Template: ComponentStory<typeof ArticleCard> = args => (
  <Box
    p={"15px"}
    display="flex"
    style={{ background: "linear-gradient(237.43deg, #2B313D -12.81%, #171A20 132.72%)", maxWidth: "460px" }}
    flexDirection={"column"}
  >
    <ArticleCard {...args} />
  </Box>
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  imageSrc: "https://miro.medium.com/max/1400/0*O3NGW_IplqVq1Y0x",
  title: "Olympus Pro Recap: January 2022",
  publishDate: "4 days ago",
  content:
    "Ohmies, welcome to the Olympus Pro recap where we'll be covering all of the developments, highlights, and data around Olympus Pro on a monthly basis.",
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
