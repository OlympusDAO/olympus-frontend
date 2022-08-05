import "./ProposalPage.scss";

import { t } from "@lingui/macro";
import { Box, Grid, Link, Typography, useTheme } from "@mui/material";
import {
  Chip,
  Icon,
  OHMChipProps,
  Paper,
  PrimaryButton,
  SecondaryButton,
  Tab,
  TabPanel,
  Tabs,
} from "@olympusdao/component-library";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { shorten } from "src/helpers";
import { prettifySeconds } from "src/helpers/timeUtil";
import { useProposal } from "src/hooks/useProposal";
import { IAnyProposal, PStatus } from "src/hooks/useProposals";

import { NULL_PROPOSAL } from "../../constants";
import { toCapitalCase } from "../../helpers";
import { BackButton } from "../BackButton";
import { PollDetailsTab } from "./components/PollDetailsTab";
import { VotesTab } from "./components/VotesTab";

export const ProposalPage = () => {
  const theme = useTheme();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const { passedId } = useParams();
  const proposalId = useMemo(() => {
    if (!passedId) return -1;
    return parseInt(passedId);
  }, [passedId]);

  const _useProposal = useProposal(proposalId);
  const proposal: IAnyProposal = useMemo(() => {
    if (_useProposal.isLoading || !_useProposal.data) return NULL_PROPOSAL;
    return _useProposal.data;
  }, [_useProposal]);

  const dateFormat = new Intl.DateTimeFormat([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZoneName: "short",
    hour: "numeric",
    minute: "numeric",
  });
  const formattedPublishedDate = dateFormat.format(proposal.submissionTimestamp);

  const mapStatus = (status: PStatus) => {
    switch (status) {
      case "active":
        return "success" as OHMChipProps["template"];
      case "endorsement":
        return "purple" as OHMChipProps["template"];
      case "discussion":
        return "userFeedback" as OHMChipProps["template"];
      case "closed":
        return "gray" as OHMChipProps["template"];
      case "draft":
        return "darkGray" as OHMChipProps["template"];
    }
  };

  const proposalHeader = () => {
    return (
      <Grid container direction="column" pt="9px" mb="9px">
        <Grid item>
          <Typography lineHeight="18px" variant="body2" color={theme.colors.gray[90]}>
            Posted on <span style={{ color: theme.colors.gray[40] }}>{formattedPublishedDate}</span> by:{" "}
            <span style={{ color: theme.colors.gray[40] }}>{shorten(proposal.proposer)}</span>
          </Typography>
        </Grid>
        <Grid item>
          <Typography fontSize="24px" lineHeight="32px" fontWeight={700}>
            {proposal.proposalName}
          </Typography>
        </Grid>
        <Box display="flex" flexDirection="row" mt="4px">
          <Chip label={toCapitalCase(proposal.state)} template={mapStatus(proposal.state)} strong />
          <Box pl="9px" display="flex" alignItems="center">
            {proposal.timeRemaining && (
              <>
                <Icon name="timeLeft" style={{ fontSize: "10px", fill: theme.colors.gray[90] }} />
                <Typography ml="9px" variant="body2" color={theme.colors.gray[90]} lineHeight="18px">
                  {`Ends in ${prettifySeconds(proposal.timeRemaining / 1000)}`}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Grid>
    );
  };

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Paper>
        <Box>
          <BackButton />
          <Grid container mb="10px">
            <Grid item sm={6}>
              {proposalHeader()}
            </Grid>
            <Grid display="flex" item sm={6} justifyContent="flex-end">
              <Link to="/governancetest/create-proposal" component={RouterLink}>
                <SecondaryButton>Create new proposal</SecondaryButton>
              </Link>
              <PrimaryButton>Delegate Vote</PrimaryButton>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center">
            <Tabs
              centered
              value={selectedIndex}
              TabIndicatorProps={{ style: { display: "none" } }}
              onChange={(_, view: number) => setSelectedIndex(view)}
            >
              <Tab label={t`Poll Detail`}></Tab>
              <Tab label={t`Votes`}></Tab>
            </Tabs>
          </Box>
          <Grid className="proposal-tabs" container direction="column" alignItems="flex-start">
            <TabPanel value={selectedIndex} index={0}>
              <PollDetailsTab proposal={proposal} />
            </TabPanel>
            <TabPanel value={selectedIndex} index={1}>
              <VotesTab proposal={proposal} />
            </TabPanel>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};
