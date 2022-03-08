import { Trans } from "@lingui/macro";
import { Divider, Typography } from "@material-ui/core";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { useWeb3Context } from "src/hooks/web3Context";

import { StakeBalances } from "./components/StakeBalances";
import { StakeFiveDayYield } from "./components/StakeFiveDayYield";
import { StakeInputArea } from "./components/StakeInputArea/StakeInputArea";
import { StakeNextRebaseAmount } from "./components/StakeNextRebaseAmount";
import { StakeRebaseYield } from "./components/StakeRebaseYield";

export const StakeActionArea: React.FC<{ isZoomed: boolean }> = props => {
  const { address } = useWeb3Context();

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

  return (
    <>
      <StakeInputArea isZoomed={props.isZoomed} />

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
