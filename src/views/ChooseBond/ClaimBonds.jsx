import { useEffect, useState } from "react";
import { ClaimBondTableData, ClaimBondCardData } from "./ClaimRow";
import { txnButtonText, isPendingTxn, txnButtonTextGeneralPending } from "src/slices/PendingTxnsSlice";
import { redeemAllBonds, redeemBond } from "src/slices/BondSlice";
import { calculateUserBondDetails } from "src/slices/AccountSlice";
import CardHeader from "../../components/CardHeader/CardHeader";
import { useWeb3Context } from "src/hooks/web3Context";
import useBonds from "src/hooks/Bonds";
import {
  Button,
  Box,
  Paper,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./choosebond.scss";
import { useSelector, useDispatch } from "react-redux";

function ClaimBonds({ activeBonds }) {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const { bonds } = useBonds();

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

    await dispatch(redeemAllBonds({ address, bonds, networkID: chainID, provider, autostake }));

    console.log("redeem all complete");
  };

  useEffect(() => {
    let bondCount = Object.keys(activeBonds).length;
    setNumberOfBonds(bondCount);
  }, [activeBonds]);

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
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Bond</TableCell>
                        <TableCell align="center">Claimable</TableCell>
                        <TableCell align="center">Pending</TableCell>
                        <TableCell align="right">Fully Vested</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(activeBonds).map((bond, i) => (
                        <ClaimBondTableData key={i} userBond={bond} />
                      ))}
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
                      {txnButtonTextGeneralPending(pendingTransactions, "redeem_all_bonds", "Claim all")}
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
                        "Claim all and Stake",
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
