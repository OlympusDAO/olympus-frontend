import { useEffect } from "react";
import { ClaimBondTableData, ClaimBondCardData } from "./ClaimRow";
import { txnButtonTextGeneralPending } from "src/slices/PendingTxnsSlice";
import { redeemBond } from "src/slices/BondSlice";
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

function ClaimBonds({ bonds: activeBonds }) {
  const { bonds } = useBonds();
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const { provider, address, chainID } = useWeb3Context();

  const onRedeem = async ({ autostake }) => {
    Object.keys(activeBonds).forEach(async bond => {
      const currentBond = bonds.find(bnd => bnd.name === bond);
      console.log(currentBond);
      dispatch(redeemBond({ address, bond: currentBond, networkID: chainID, provider, autostake }));
    });
  };

  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  if (activeBonds.length < 1) return;

  return (
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
                    <TableCell align="left">Claimable</TableCell>
                    <TableCell align="left">Pending</TableCell>
                    <TableCell align="center">Fully Vested</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(activeBonds).map(bond => (
                    <ClaimBondTableData key={bond.bond} userBond={bond} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {isSmallScreen && activeBonds.map(bond => <ClaimBondCardData key={bond.bond} userBond={bond} />)}

          <Box
            display="flex"
            justifyContent="center"
            className={`global-claim-buttons ${isSmallScreen ? "small" : ""}`}
          >
            {activeBonds.length > 1 && (
              <Button variant="contained" color="primary" className="transaction-button" fullWidth>
                Claim all
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              id="claim-all-and-stake-btn"
              className="transaction-button"
              fullWidth
              // disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bond + "_autostake")}
              onClick={() => {
                onRedeem({ autostake: true });
              }}
            >
              {txnButtonTextGeneralPending(
                pendingTransactions,
                "redeem_bond_" + "dai" + "_autostake",
                "Claim all and Stake",
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Zoom>
  );
}

export default ClaimBonds;
