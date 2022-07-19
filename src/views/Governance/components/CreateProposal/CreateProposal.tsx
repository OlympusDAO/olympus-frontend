import "./CreateProposal.scss";

import { ChevronLeft } from "@mui/icons-material";
import { Grid, Link, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { Paper, TextButton } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";

export const CreateProposal = () => {
  return (
    <div className="create-proposal-form">
      <Paper>
        <Grid container direction="column" spacing={2}>
          <Grid className="back-button" item>
            <Link to="/governancetest" component={RouterLink}>
              <ChevronLeft viewBox="6 6 12 12" style={{ width: "12px", height: "12px" }} />
              <TextButton>Back</TextButton>
            </Link>
          </Grid>
          <Grid className="create-proposal-section" container direction="column" xs={12}>
            <Grid item>
              <Typography variant="body2">Title</Typography>
            </Grid>
            <Grid item>
              <OutlinedInput className="create-proposal-input" />
            </Grid>
          </Grid>
          <Grid className="create-proposal-section" container direction="column">
            <Grid container direction="row">
              <Grid item>
                <Typography variant="body2">Description</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">0/14,400</Typography>
              </Grid>
            </Grid>
            <Grid item>
              <OutlinedInput className="create-proposal-input" />
            </Grid>
          </Grid>
          <Grid className="create-proposal-section" container direction="column">
            <Grid item>
              <Typography variant="body2">Discussion</Typography>
            </Grid>
            <Grid item>
              <OutlinedInput
                className="create-proposal-input"
                placeholder="e.g. https://forum.olympusday.finance/..."
              />
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid className="create-proposal-section" container direction="column" xs={6}>
              <Grid item>
                <Typography variant="body2">Action</Typography>
              </Grid>
              <Grid item>
                <Select className="create-proposal-section" defaultValue="installModule" fullWidth>
                  <MenuItem value="installModule">Install Module</MenuItem>
                  <MenuItem value="upgradeModule">Upgrade Module</MenuItem>
                  <MenuItem value="approvePolicy">Approve Policy</MenuItem>
                  <MenuItem value="terminatePolicy">Terminate Policy</MenuItem>
                  <MenuItem value="changeExecutor">Change Executor</MenuItem>
                </Select>
              </Grid>
            </Grid>
            <Grid className="create-proposal-section" container direction="column" xs={6}>
              <Grid item>
                <Typography variant="body2">Target</Typography>
              </Grid>
              <Grid item>
                <OutlinedInput className="create-proposal-input" placeholder="Contract address" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
