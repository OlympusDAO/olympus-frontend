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
import { ContactSupportOutlined } from "@material-ui/icons";
import { useAppSelector } from "src/hooks";
import { claimAllNotes, IUserNote } from "src/slices/BondSliceV2";

function ClaimBonds({ activeNotes }: { activeNotes: IUserNote[] }) {
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();

  const [numberOfBonds, setNumberOfBonds] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const onRedeemAll = () => {
    // console.log("redeeming all bonds");
    // dispatch(redeemAllBonds({ address, bonds, networkID: networkId, provider, autostake }));
    dispatch(claimAllNotes({ address, provider, networkID: networkId }));
    // console.log("redeem all complete");
  };

  useEffect(() => {
    let bondCount = Object.keys(activeNotes).length;
    setNumberOfBonds(bondCount);
  }, [activeNotes]);

  const currentBlock = useAppSelector(state => {
    return state.app.currentBlock!;
  });

  const fullyVestedBonds = activeNotes.filter(note => note.fullyMatured);
  const vestingBonds = activeNotes.filter(note => !note.fullyMatured);

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

              {isSmallScreen && activeNotes.map((bond, i) => <ClaimBondCardData key={i} userNote={bond} />)}

              <Box
                display="flex"
                justifyContent="center"
                className={`global-claim-buttons ${isSmallScreen ? "small" : ""}`}
              >
                {numberOfBonds >= 1 && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      className="transaction-button"
                      fullWidth
                      disabled={
                        isPendingTxn(pendingTransactions, "claim_all_bonds") ||
                        !activeNotes.map(note => note.fullyMatured).reduce((prev, current, idx, arr) => prev || current)
                      }
                      onClick={onRedeemAll}
                    >
                      {txnButtonTextGeneralPending(pendingTransactions, "claim_all_bonds", t`Claim all`)}
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
