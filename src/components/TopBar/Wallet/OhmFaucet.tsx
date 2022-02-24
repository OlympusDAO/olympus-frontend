import { t } from "@lingui/macro";
import { Box, useTheme } from "@material-ui/core";
import { SecondaryButton } from "@olympusdao/component-library";
import { useDispatch, useSelector } from "react-redux";
import { FAUCET_PENDING_TYPE, getOhm, hasOhmFaucet } from "src/helpers/OhmFaucet";
import { useWeb3Context } from "src/hooks";
import { State } from "src/slices/interfaces";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

export const OhmFaucetButton = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { address, provider, networkId } = useWeb3Context();

  const pendingTransactions = useSelector((state: State) => {
    return state.pendingTransactions;
  });

  const runOhmFaucet = async () => {
    dispatch(getOhm({ address, provider, networkID: networkId }));
  };

  if (!hasOhmFaucet(networkId)) return <></>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }} style={{ gap: theme.spacing(1.5) }}>
      <SecondaryButton
        onClick={() => runOhmFaucet()}
        disabled={isPendingTxn(pendingTransactions, FAUCET_PENDING_TYPE)}
        id="ohm-faucet"
      >
        {txnButtonText(pendingTransactions, FAUCET_PENDING_TYPE, t`OHM Faucet`)}
      </SecondaryButton>
    </Box>
  );
};
