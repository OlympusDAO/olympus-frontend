import { useEffect, useState } from "react";
import { trim } from "../../helpers";
import { Box, Paper, Typography, Slide } from "@material-ui/core";
import BondHeader from "../Bond/BondHeader";
import ZapBondPurchase from "./ZapBondPurchase";
import "./zap.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import ZapBondSubHeader from "./ZapBondSubHeader";

function ZapBond({ bond }) {
  const { provider, address, chainID } = useWeb3Context();

  const [slippage, setSlippage] = useState(0.5);
  const [recipientAddress, setRecipientAddress] = useState(address);

  const onRecipientAddressChange = e => {
    return setRecipientAddress(e.target.value);
  };

  const onSlippageChange = e => {
    return setSlippage(e.target.value);
  };

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [provider, address]);

  const backButton = (
    <Box flexDirection="row" display="flex" alignItems="center">
      <KeyboardArrowLeft />
      <Typography>Back</Typography>
    </Box>
  );

  return (
    <div id="zap-view">
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Paper className="ohm-card">
          <BondHeader
            bond={bond}
            slippage={slippage}
            recipientAddress={recipientAddress}
            onSlippageChange={onSlippageChange}
            onRecipientAddressChange={onRecipientAddressChange}
            returnPath="zap/bond"
            alternateBackButton={backButton}
          />
          <ZapBondSubHeader bond={bond} />
          <ZapBondPurchase bond={bond} slippage={slippage} recipientAddress={recipientAddress} />
        </Paper>
      </Slide>
    </div>
  );
}

export function DisplayBondPrice({ bond }) {
  const { chainID } = useWeb3Context();
  return (
    <>
      {!bond.isAvailable[chainID] ? (
        <>--</>
      ) : (
        `${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        }).format(bond.bondPrice)}`
      )}
    </>
  );
}

export function DisplayBondDiscount({ bond }) {
  const { chainID } = useWeb3Context();
  return <>{!bond.isAvailable[chainID] ? <>--</> : `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`}</>;
}

export default ZapBond;
