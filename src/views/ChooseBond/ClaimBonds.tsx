import "./choosebond.scss";

import { Trans } from "@lingui/macro";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "src/hooks";
import useBonds from "src/hooks/Bonds";
import { useWeb3Context } from "src/hooks/web3Context";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { isPendingTxn } from "src/slices/PendingTxnsSlice";

import CardHeader from "../../components/CardHeader/CardHeader";
import { ClaimBondCardData, ClaimBondTableData } from "./ClaimRow";

function ClaimBonds({ activeBonds }: { activeBonds: IUserBondDetails[] }) {
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();
  const { bonds } = useBonds(networkId);

  const [numberOfBonds, setNumberOfBonds] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const pendingTransactions = useAppSelector(state => {
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

  useEffect(() => {
    const bondCount = Object.keys(activeBonds).length;
    setNumberOfBonds(bondCount);
  }, [activeBonds]);

  return (
    <>
      {numberOfBonds > 0 && (
        <Zoom in={true}>
          <Paper className="ohm-card claim-bonds-card">
            <CardHeader title="Your Bonds (1,1)" />
            <ClaimBondsSubComponent activeBonds={activeBonds} />
          </Paper>
        </Zoom>
      )}
    </>
  );
}

export default ClaimBonds;

export function ClaimBondsSubComponent({ activeBonds }: { activeBonds: IUserBondDetails[] }) {
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();
  const { bonds } = useBonds(networkId);

  const [numberOfBonds, setNumberOfBonds] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const pendingTransactions = useAppSelector(state => {
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

  useEffect(() => {
    const bondCount = activeBonds.length;
    setNumberOfBonds(bondCount);
  }, [activeBonds]);

  return (
    <Box style={{ width: "100%" }}>
      {!isSmallScreen && (
        <TableContainer>
          <Table aria-label="Claimable bonds">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Trans>Bond</Trans>
                </TableCell>
                <TableCell align="center">
                  <Trans>Claimable</Trans>
                </TableCell>
                <TableCell align="center">
                  <Trans>Pending</Trans>
                </TableCell>
                <TableCell align="right">
                  <Trans>Fully Vested</Trans>
                </TableCell>
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

      {isSmallScreen && Object.entries(activeBonds).map((bond, i) => <ClaimBondCardData key={i} userBond={bond} />)}
    </Box>
  );
}
