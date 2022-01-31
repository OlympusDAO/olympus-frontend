import "./ChooseBond.scss";

import { t } from "@lingui/macro";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Table,
  TableBody,
  TableContainer,
  Typography,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ExpandMore } from "@material-ui/icons";
import { Paper, Tab, Tabs } from "@olympusdao/component-library";
import { isEmpty } from "lodash";
import title from "material-ui/svg-icons/editor/title";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { trim } from "src/helpers";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { claimAllNotes, IUserNote } from "src/slices/BondSliceV2";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import { ClaimBondsSubComponent } from "../ChooseBond/ClaimBonds";
import AccordionSection from "./AccordionSection";

function ClaimBonds({ activeNotes }: { activeNotes: IUserNote[] }) {
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();

  const currentIndex = useAppSelector(state => {
    return state.app.currentIndex ?? "1";
  });
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const fullyVestedBonds = activeNotes.filter(note => note.fullyMatured);
  const vestingBonds = activeNotes.filter(note => !note.fullyMatured);

  const v1AccountBonds: IUserBondDetails[] = useAppSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const [view, setView] = useState(0);

  const changeView: any = (_event: ChangeEvent<any>, newView: number) => {
    setView(newView);
  };

  const total = fullyVestedBonds.reduce((a, b) => {
    return a + b.payout;
  }, 0);

  const totalClaimable = view === 1 ? total : total * +currentIndex;

  const onRedeemAll = () => {
    dispatch(claimAllNotes({ address, provider, networkID: networkId, gOHM: view === 1 }));
  };

  return (
    <>
      <Zoom in={true}>
        <Paper headerText="Your Bonds">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            className={`global-claim-buttons ${isSmallScreen ? "" : ""}`}
          >
            <Typography variant="h4" align="center" className="payout-options-header">
              Payout Options{" "}
            </Typography>
            <Tabs
              centered
              value={view}
              textColor="primary"
              indicatorColor="primary"
              onChange={changeView}
              aria-label="payout token tabs"
              className="payout-token-tabs"
            >
              <Tab aria-label="payout-sohm-button" label="sOHM" className="payout-token-tab" />
              <Tab aria-label="payout-sohm-button" label="gOHM" className="payout-token-tab" />
            </Tabs>
          </Box>

          <Box>
            {!isSmallScreen && (
              <TableContainer>
                <Table aria-label="Claimable bonds">
                  <TableBody>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      className={`global-claim-buttons ${isSmallScreen ? "small" : ""}`}
                    >
                      <Typography variant="h5" align="center" className="claimable-balance">
                        Claimable Balance
                      </Typography>
                      <Typography variant="h4" align="center" style={{ marginBottom: "10px" }}>
                        {view === 0 ? `${trim(totalClaimable, 4)} sOHM` : `${trim(totalClaimable, 4)} gOHM`}
                      </Typography>

                      <Button
                        variant="contained"
                        color="primary"
                        className="transaction-button"
                        fullWidth
                        disabled={
                          isPendingTxn(pendingTransactions, "redeem_all_notes") ||
                          !activeNotes.map(note => note.fullyMatured).reduce((prev, current) => prev || current, false)
                        }
                        onClick={onRedeemAll}
                      >
                        {txnButtonText(pendingTransactions, "redeem_all_notes", t`Claim all`)}
                      </Button>
                    </Box>
                    {!isEmpty(fullyVestedBonds) && (
                      <AccordionSection
                        bonds={fullyVestedBonds}
                        title="Fully Vested Bonds"
                        gOHM={view === 1}
                        vested={true}
                        isSmallScreen={isSmallScreen}
                      />
                    )}
                    {!isEmpty(vestingBonds) && (
                      <AccordionSection
                        bonds={vestingBonds}
                        title="Vesting Bonds"
                        gOHM={view === 1}
                        vested={false}
                        isSmallScreen={isSmallScreen}
                      />
                    )}
                    {!isEmpty(v1AccountBonds) && (
                      <Accordion defaultExpanded classes={{ root: "accordion-root" }}>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          aria-controls={`${title}-content`}
                          id={`${title}-header`}
                        >
                          <Typography>V1 Bonds</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <ClaimBondsSubComponent activeBonds={v1AccountBonds} />
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {isSmallScreen && (
              <>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  className={`global-claim-buttons ${isSmallScreen ? "small" : ""}`}
                >
                  <Typography variant="h5" align="center" className="claimable-balance">
                    Claimable Balance
                  </Typography>
                  <Typography variant="h4" align="center" style={{ marginBottom: "10px" }}>
                    {view === 0 ? `${trim(totalClaimable, 4)} sOHM` : `${trim(totalClaimable, 4)} gOHM`}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    className="transaction-button"
                    fullWidth
                    disabled={
                      isPendingTxn(pendingTransactions, "redeem_all_notes") ||
                      !activeNotes.map(note => note.fullyMatured).reduce((prev, current) => prev || current, false)
                    }
                    onClick={onRedeemAll}
                  >
                    {txnButtonText(pendingTransactions, "redeem_all_notes", t`Claim all`)}
                  </Button>
                </Box>
                {!isEmpty(fullyVestedBonds) && (
                  <AccordionSection
                    bonds={fullyVestedBonds}
                    title="Fully Vested Bonds"
                    gOHM={view === 1}
                    vested={true}
                    isSmallScreen={isSmallScreen}
                  />
                )}
                {!isEmpty(vestingBonds) && (
                  <AccordionSection
                    bonds={vestingBonds}
                    title="Vesting Bonds"
                    gOHM={view === 1}
                    vested={false}
                    isSmallScreen={isSmallScreen}
                  />
                )}
                {v1AccountBonds.length > 0 && (
                  <Accordion defaultExpanded classes={{ root: "accordion-root" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls={`${title}-content`}
                      id={`${title}-header`}
                    >
                      <Typography>V1 Bonds</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ClaimBondsSubComponent activeBonds={v1AccountBonds} />
                    </AccordionDetails>
                  </Accordion>
                )}
              </>
            )}
          </Box>
        </Paper>
      </Zoom>
    </>
  );
}

export default ClaimBonds;
