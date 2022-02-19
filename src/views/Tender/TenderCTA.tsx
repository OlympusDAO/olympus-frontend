import "../../components/CallToAction/CallToAction.scss";

import { Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { PrimaryButton } from "@olympusdao/component-library";
import { NetworkId } from "src/constants";
import { useWeb3Context } from "src/hooks/web3Context";

import { switchNetwork } from "../../helpers/NetworkHelper";
import { CrossChainBalanceCheck } from "./queries";

const TenderCTA = () => {
  const { provider, address } = useWeb3Context();

  const balance = CrossChainBalanceCheck(address);
  return balance === true ? (
    <Box className="call-to-action ohm-card">
      <Typography style={{ fontSize: "20px", fontWeight: "600" }} variant="h5">
        <Trans>You have SPA in your wallet. Please switch to Fantom Network to accept the Tender Offer.</Trans>
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
