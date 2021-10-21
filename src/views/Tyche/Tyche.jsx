import { useCallback, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@material-ui/core";
import "./tyche.scss";

function Tyche() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div id="yield-directing-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Stream</Typography>
              </div>
            </Grid>
          </Grid>
          <div className="yield-directing-area">
            <Box className="yield-action-area">
              <Typography variant="h6">Tyche component goes here</Typography>
            </Box>
          </div>
        </Paper>
      </Zoom>
    </div>
  );
}

export default Tyche;
