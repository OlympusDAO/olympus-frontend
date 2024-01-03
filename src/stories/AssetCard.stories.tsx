import { Box } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import AssetCard from "src/components/library/AssetCard";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Wallet/AssetCard",
  component: AssetCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AssetCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const ListTemplate: ComponentStory<typeof AssetCard> = args => (
  <Box
    display="flex"
    style={{ background: "linear-gradient(237.43deg, #2B313D -12.81%, #171A20 132.72%)", maxWidth: "460px" }}
    flexDirection={"column"}
  >
    <Box>
      <AssetCard
        token={["DAI"]}
        assetValue={"$347,245.53"}
        assetBalance={"3,580,21 sOHM"}
        pnl={"+$124.67"}
        pnlColor="green"
        timeRemaining={"Vesting 1d 23h"}
      />
      <AssetCard
        token={["OHM"]}
        assetValue="$4,740.43"
        assetBalance="48.86 OHM"
        pnl="-$624.67"
        timeRemaining={"Stakes 1d 23h"}
        pnlColor="red"
      />
      <AssetCard
        token={["wsOHM"]}
        assetValue="$124,654.23"
        assetBalance="18.69 gOHM"
        pnl="+$10,24.67"
        pnlColor="green"
        timeRemaining={"Stakes 1d 23h"}
      />
      <AssetCard
        token={["sOHM"]}
        assetValue="$54,356.34"
        assetBalance="560.20 sOHM"
        pnl="+$7,124.67"
        pnlColor="green"
        timeRemaining={"Vesting 1d 23h"}
      />
      <AssetCard {...args} />
    </Box>
  </Box>
);
const Template: ComponentStory<typeof AssetCard> = args => (
  <Box display="flex" style={{ background: "rgba(63, 69, 82, 0.75)" }} flexDirection={"column"}>
    <AssetCard {...args} />
  </Box>
);

export const List = ListTemplate.bind({});
export const TokenCard = Template.bind({});
export const Loading = Template.bind({});

List.args = {};
TokenCard.args = {
  token: ["DAI"],
  assetValue: "$347,245.53",
  assetBalance: "3,580,21 sOHM",
  pnl: "+$124.67",
  pnlColor: "green",
  timeRemaining: "Stakes 1d 23h",
};

Loading.args = { token: ["DAI"] };
