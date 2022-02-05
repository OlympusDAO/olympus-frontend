import { t, Trans } from "@lingui/macro";
import { Box, Divider, Grid, Typography } from "@material-ui/core";
import { Tab, Tabs } from "@olympusdao/component-library";
import { ChangeEvent, useState } from "react";
import { useHistory } from "react-router";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useWeb3Context } from "src/hooks/web3Context";

import { StakeBalances } from "../StakeBalances";
import { StakeFiveDayYield } from "../StakeFiveDayYield";
import { StakeNextRebaseAmount } from "../StakeNextRebaseAmount";
import { StakeRebaseYield } from "../StakeRebaseYield";
import { StakeInputArea } from "./components/StakeInputArea";

export const StakeActionArea: React.FC<{ isZoomed: boolean }> = props => {
  const history = useHistory();
  const { address, networkId } = useWeb3Context();
  usePathForNetwork({ pathName: "stake", networkID: networkId, history });

  const [currentAction, setCurrentAction] = useState<"STAKE" | "UNSTAKE">("STAKE");

  if (!address)
    return (
      <div className="stake-wallet-notification">
        <div className="wallet-menu" id="wallet-menu">
          <ConnectButton />
        </div>

        <Typography variant="h6">
          <Trans>Connect your wallet to stake OHM</Trans>
        </Typography>
      </div>
    );

  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setCurrentAction(newView === 0 ? "STAKE" : "UNSTAKE");
  };

  return (
    <>
      <Box className="stake-action-area">
        <Tabs
          centered
          textColor="primary"
          onChange={changeView}
          aria-label="stake tabs"
          indicatorColor="primary"
          key={String(props.isZoomed)}
          className="stake-tab-buttons"
          value={currentAction === "STAKE" ? 0 : 1}
          //hides the tab underline sliding animation in while <Zoom> is loading
          TabIndicatorProps={!props.isZoomed ? { style: { display: "none" } } : undefined}
        >
          <Tab aria-label="stake-button" label={t({ id: "do_stake", comment: "The action of staking (verb)" })} />

          <Tab aria-label="unstake-button" label={t`Unstake`} />
        </Tabs>

        <Grid container className="stake-action-row">
          <StakeInputArea action={currentAction} />
        </Grid>
      </Box>

      <div className="stake-user-data">
        <StakeBalances />

        <Divider color="secondary" />

        <StakeNextRebaseAmount />

        <StakeRebaseYield />

        <StakeFiveDayYield />
      </div>
    </>
  );
};
