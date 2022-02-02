import "../../components/CallToAction/CallToAction.scss";

import { Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { PrimaryButton } from "@olympusdao/component-library";
import { useEffect, useState } from "react";
import { NetworkId } from "src/constants";
import { useWeb3Context } from "src/hooks/web3Context";
import { balancesOf } from "src/lib/fetchBalances";

import { switchNetwork } from "../../helpers/NetworkHelper";

const TenderCTA = (props: { walletAddress: string }) => {
  const { provider } = useWeb3Context();
  const [hasBalance, setHasBalance] = useState(false);

  //Check Balance Stub.

  //Only make a new balance request check when the walletAddress changes instead of every rerender.
  useEffect(() => {
    balancesOf(props.walletAddress, NetworkId.FANTOM).then(res => {
      const chicken = res.find(address => address.contractAddress === process.env.REACT_APP_TENDER_BALANCE_ADDRESS);
      if (chicken && parseInt(chicken.balance) > 0) {
        setHasBalance(true);
      }
    });
  }, [props.walletAddress]);
  return hasBalance ? (
    <Box className="call-to-action ohm-card">
      <Typography style={{ fontSize: "20px", fontWeight: "600" }} variant="h5">
        <Trans>You have Chicken in your wallet. Please switch to Fantom Network to accept the Tender Offer.</Trans>
      </Typography>
      <div className="actionable">
        <PrimaryButton
          className="migrate-button"
          onClick={() => switchNetwork({ provider, networkId: NetworkId.FANTOM })}
        >
          Switch Network
        </PrimaryButton>
      </div>
    </Box>
  ) : (
    <></>
  );
};
export default TenderCTA;
