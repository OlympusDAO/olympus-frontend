import {
  Box,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetVotes } from "src/views/Governance/hooks/useGetVotes";
import { VoteRow } from "src/views/Governance/Proposals/VoteRow";

// Data for the tables, including a 'reason' field for each row
const tablesData = [
  {
    id: "For",
  },
  {
    id: "Against",
  },
  {
    id: "Abstain",
  },
];

const TabPanel = (props: { children: React.ReactNode; value: number; index: number }) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

export default function GovernanceTable() {
  const { id } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const { data: voteData } = useGetVotes({ proposalId: id, support: tabIndex + 1 });

  const handleTabChange = (event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  console.log(voteData, "voteData");

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        textColor="primary"
        aria-label="proposal tabs"
        indicatorColor="primary"
        value={tabIndex}
        onChange={handleTabChange}
        //hides the tab underline sliding animation in while <Zoom> is loading
        TabIndicatorProps={{ style: { display: "none" } }}
        centered
      >
        {" "}
        {tablesData.map((table, index) => (
          <Tab label={table.id} key={index} />
        ))}
      </Tabs>

      {tablesData.map((table, index) => (
        <TabPanel value={tabIndex} index={index} key={index}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{tablesData[tabIndex].id}</TableCell>
                  <TableCell align="right">Votes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {voteData?.length ? (
                  voteData.map((row, i) => (
                    <TableRow key={i}>
                      <VoteRow voter={row.voter} reason={row.reason} votes={row.votes} tx={row.transactionHash} />
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Typography>No votes yet</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      ))}
    </Box>
  );
}
