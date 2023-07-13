import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Paper, Tab, Tabs } from "@olympusdao/component-library";
import { useState } from "react";

export const VaultFAQ = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Paper enableBackground fullWidth>
      <Tabs
        TabIndicatorProps={{ style: { display: "none" } }}
        value={activeTab}
        onChange={(_, view: number) => setActiveTab(view)}
        variant="scrollable"
      >
        <Tab label="Liquidity Without Compromise" />
        <Tab label="Hedge volatility" />
        <Tab label="Double your LP rewards" />
        <Tab label="What's in it for Olympus?" />
      </Tabs>
      <Box display="flex" flexWrap="wrap" mt="21px" gap="66px">
        {content[activeTab].map((item, index) => (
          <Box width={mobile ? "70%" : "45%"} key={index}>
            <Typography fontWeight={500} fontSize="15px" lineHeight="24px">
              {item.title}
            </Typography>
            <Typography color={theme.colors.gray[40]} mt="3px" lineHeight="24px">
              {item.content}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

interface VaultFaqContent {
  [key: number]: { title: string; content: string }[];
}

const content: VaultFaqContent = {
  0: [
    {
      title: "Provide liquidity without selling half your bag",
      content:
        "Avoid the slippage and trading fees of traditional LP deposits that require you to match equal assets before depositing.",
    },
    {
      title: "Let Olympus provide the pairing asset",
      content:
        "Olympus matches your deposit by minting OHM into the Boosted Vault. When you remove your liquidity, the corresponding OHM is returned to Olympus and removed from circulation.",
    },
  ],
  1: [
    {
      title: "Soften your exposure to drastic price swings",
      content:
        "The Boosted Vault is similar to asset-stablecoin pools, in which depositing positions the LP provider against the full exposure of price movements in either direction.",
    },
    {
      title: "OHM is volatility resistant",
      content:
        "OHM's price is loosely compressed by Olympus' Range Bound Stability monetary policy. This allows OHM to appreciate with market adoption, while remaining predictable. This stability provides the perfect pairing asset to hedge against volatility.",
    },
  ],
  2: [
    {
      title: "Make your asset work twice as hard compared to other LP pools.",
      content:
        "Olympus matches your deposit with OHM, but refrains from collecting rewards from the pool, instead passing those along to you as the depositor. Earn rewards as if you owned the entire LP position with only half the deposit.",
    },
    {
      title: "Share impermanent loss with Olympus, but not the rewards.",
      content:
        "As a depositor, you and Olympus will be exposed to impermanent loss as if you were depositing to a traditional LP pool; however, you keep all the rewards.",
    },
  ],
  3: [
    {
      title: "Liquidity proliferation",
      content:
        "As more native assets utilizes the Boosted Vaults, the deeper the OHM-asset becomes, and the lower the slippage is enabled between the pair. This deep liquidity encourages network effects of other protocols looking to incorporate the particular asset liquidity. It allows them to simply pair with OHM to access broader liquidity via routing instead of attempting build native liquidity.",
    },
    {
      title: "Boosted Liquidity Vaults allow you to get more rewards for the same liquidity",
      content:
        "When depositors exit their LP position, in some cases there will be more OHM in the pool than the initial deposit, which results in a net reduction of OHM in circulating supply. In other cases, the benefit of liquidity proliferation and the accompanied revenue from trading fees should offset excess OHM in circulation.",
    },
  ],
};
