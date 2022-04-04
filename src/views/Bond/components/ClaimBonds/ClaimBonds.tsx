import { Trans } from "@lingui/macro";
import {
  Box,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Paper, PrimaryButton, TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { useState } from "react";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

import { BondDuration } from "../BondDuration";
import { BondNote, useBondNotes } from "./hooks/useBondNotes";

export const ClaimBonds = () => {
  const [isPayoutGohm, setIsPayoutGohm] = useState(false);

  const isSmallScreen = false;

  const notes = useBondNotes().data;

  if (!notes || notes.length < 1) return null;

  const totalClaimableBalance = notes.reduce((res, note) => note.payout.add(res), new DecimalBigNumber("0", 0));

  return (
    <Paper headerText="Your Bonds">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" align="center" color="textSecondary">
          Payout Options
        </Typography>

        <Tabs
          centered
          textColor="primary"
          indicatorColor="primary"
          value={isPayoutGohm ? 1 : 0}
          aria-label="Payout token tabs"
          onChange={(_, view) => setIsPayoutGohm(view === 1)}
        >
          <Tab aria-label="payout-sohm-button" label="sOHM" style={{ fontSize: "1rem" }} />
          <Tab aria-label="payout-sohm-button" label="gOHM" style={{ fontSize: "1rem" }} />
        </Tabs>
      </Box>

      <Box display="flex" justifyContent="center">
        <Box display="flex" flexDirection="column" alignItems="center" mt="24px" width="50%">
          <Typography variant="h5" align="center" color="textSecondary" style={{ fontSize: "1.2rem" }}>
            Claimable Balance
          </Typography>

          <Typography variant="h4" align="center" style={{ marginBottom: "10px" }}>
            {`${totalClaimableBalance.toFormattedString(4)} gOHM`}
          </Typography>

          <PrimaryButton className="" fullWidth>
            Claim All
          </PrimaryButton>
        </Box>
      </Box>

      <Box mt="48px">
        {isSmallScreen ? (
          <ClaimBondsDataCard />
        ) : (
          <TableContainer>
            <Table aria-label="Available bonds" style={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "230px", padding: "8px 0" }}>
                    <Trans>Token</Trans>
                  </TableCell>
                  <TableCell style={{ padding: "8px 0" }}>
                    <Trans>Duration</Trans>
                  </TableCell>
                  <TableCell style={{ padding: "8px 0" }}>
                    <Trans>Remaining</Trans>
                  </TableCell>
                  <TableCell style={{ padding: "8px 0" }}>
                    <Trans>Payout</Trans>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notes.map(note => (
                  <BondRow key={note.id} note={note} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Paper>
  );
};

const BondRow: React.VFC<{ note: BondNote }> = ({ note }) => (
  <TableRow>
    <TableCell style={{ padding: "8px 0" }}>
      {note ? (
        <Box display="flex" alignItems="center">
          <TokenStack tokens={note.bond.quoteToken.icons} />

          <Box display="flex" flexDirection="column" ml="16px">
            <Typography>{note.bond.quoteToken.name}</Typography>
          </Box>
        </Box>
      ) : (
        <Skeleton width={120} />
      )}
    </TableCell>

    <TableCell style={{ padding: "8px 0" }}>
      <BondDuration duration={note?.bond.duration} />
    </TableCell>

    <TableCell style={{ padding: "8px 0" }}>
      {Date.now() > note.matured ? "Fully Vested" : <BondDuration duration={(note?.matured || 0) - Date.now()} />}
    </TableCell>

    <TableCell style={{ padding: "8px 0" }}>
      {note ? `${note?.payout.toFormattedString(4)} gOHM` : <Skeleton width={60} />}
    </TableCell>

    <TableCell style={{ padding: "8px 0" }}>
      <TertiaryButton fullWidth>Claim</TertiaryButton>
    </TableCell>
  </TableRow>
);

const ClaimBondsDataCard: React.VFC = () => {
  return (
    <>
      {/* 
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
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls={`${title}-content`} id={`${title}-header`}>
            <Typography>V1 Bonds</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ClaimBondsSubComponent activeBonds={v1AccountBonds} />
          </AccordionDetails>
        </Accordion>
      )} */}
    </>
  );
};
