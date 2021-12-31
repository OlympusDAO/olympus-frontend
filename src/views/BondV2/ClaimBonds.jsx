import { useEffect, useState } from "react";
import { t, Trans } from "@lingui/macro";
import { ClaimBondTableData, ClaimBondCardData } from "./ClaimRow";
import { isPendingTxn, txnButtonTextGeneralPending } from "src/slices/PendingTxnsSlice";
import { redeemAllBonds } from "src/slices/BondSlice";
import CardHeader from "../../components/CardHeader/CardHeader";
import AccordionSection from "./AccordionSection";
import { useWeb3Context } from "src/hooks/web3Context";
import useBonds from "src/hooks/Bonds";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./choosebond.scss";
import { useDispatch, useSelector } from "react-redux";

function ClaimBonds({ activeBonds }) {
  const dispatch = useDispatch();
  const { provider, address } = useWeb3Context();
  const networkId = useSelector(state => state.network.networkId);
  const { bonds } = useBonds(networkId);

  const [numberOfBonds, setNumberOfBonds] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const pendingClaim = () => {
    if (
      isPendingTxn(pendingTransactions, "redeem_all_bonds") ||
      isPendingTxn(pendingTransactions, "redeem_all_bonds_autostake")
    ) {
      return true;
    }

    return false;
  };

  const onRedeemAll = async ({ autostake }) => {
    console.log("redeeming all bonds");

    await dispatch(redeemAllBonds({ address, bonds, networkID: networkId, provider, autostake }));

    console.log("redeem all complete");
  };

  useEffect(() => {
    let bondCount = Object.keys(activeBonds).length;
    setNumberOfBonds(bondCount);
  }, [activeBonds]);

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const fullyVestedBonds = activeBonds.filter(bond => bond.bondMaturationBlock <= currentBlock);
  const vestingBonds = activeBonds.filter(bond => bond.bondMaturationBlock > currentBlock);
  return (
    <>
      {numberOfBonds > 0 && (
        <Zoom in={true}>
          <Paper className="ohm-card claim-bonds-card">
            <CardHeader title="Your Bonds (1,1)" />
            <Box>
              {!isSmallScreen && (
                <TableContainer>
                  <Table aria-label="Claimable bonds">
                    <TableBody>
                      {fullyVestedBonds.length > 0 && (
                        <AccordionSection bonds={fullyVestedBonds} title="Fully Vested Bonds" />
                      )}
                      {vestingBonds.length > 0 && <AccordionSection bonds={vestingBonds} title="Vesting Bonds" />}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {isSmallScreen &&
                Object.entries(activeBonds).map((bond, i) => <ClaimBondCardData key={i} userBond={bond} />)}

              <Box
                display="flex"
                justifyContent="center"
                className={`global-claim-buttons ${isSmallScreen ? "small" : ""}`}
              >
                {numberOfBonds > 1 && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      className="transaction-button"
                      fullWidth
                      disabled={pendingClaim()}
                      onClick={() => {
                        onRedeemAll({ autostake: false });
                      }}
                    >
                      {txnButtonTextGeneralPending(pendingTransactions, "redeem_all_bonds", t`Claim all`)}
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      id="claim-all-and-stake-btn"
                      className="transaction-button"
                      fullWidth
                      disabled={pendingClaim()}
                      onClick={() => {
                        onRedeemAll({ autostake: true });
                      }}
                    >
                      {txnButtonTextGeneralPending(
                        pendingTransactions,
                        "redeem_all_bonds_autostake",
                        t`Claim all and Stake`,
                      )}
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Paper>
        </Zoom>
      )}
    </>
  );
}

export default ClaimBonds;
