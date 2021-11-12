import { FormControlLabel, Button, Typography, Box, Drawer, Paper, Switch, Slide } from "@material-ui/core";
import { useState } from "react";

function SOhmTx() {
  const toggleDrawer = data => () => {
    setAnchor(data);
  };

  const onChange = data => () => {
    setAnchor(data);
  };
  const [anchor, setAnchor] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Paper>
      <Box className="ohm-pairs" style={{ width: "100%" }}>
        <Button
          onClick={() => {
            setIsChecked("All");
          }}
          variant="contained"
          style={{ width: "100%" }}
          color="secondary"
        >
          <Typography align="left"> All</Typography>
        </Button>
        <Button
          onClick={() => {
            setIsChecked("Earning");
          }}
          variant="contained"
          style={{ width: "100%" }}
          color="secondary"
        >
          <Typography align="left"> Earning</Typography>
        </Button>
        <Button
          onClick={() => {
            setIsChecked("Staking");
          }}
          variant="contained"
          style={{ width: "100%" }}
          color="secondary"
        >
          <Typography align="left"> Staking</Typography>
        </Button>
        <Button
          onClick={() => {
            setIsChecked("Bonding");
          }}
          variant="contained"
          style={{ width: "100%" }}
          color="secondary"
        >
          <Typography align="left"> Bonding</Typography>
        </Button>
        <Button onClick={toggleDrawer("sOHMZaps")} variant="contained" style={{ width: "100%" }} color="secondary">
          <Typography align="left"> Borrowing</Typography>
        </Button>
        <Button onClick={toggleDrawer("sOHMZaps")} variant="contained" style={{ width: "100%" }} color="secondary">
          <Typography align="left"> Zap</Typography>
        </Button>
      </Box>{" "}
      {isChecked === "All" ? (
        <Slide in={isChecked === "All"} direction="left">
          <Paper elevation={5} style={{ margin: 5 }}>
            <svg style={{ width: 100, height: 100 }}>
              <polygon
                points="0,80 45,00, 80,70"
                style={{
                  fill: "orange",
                  stroke: "dimgrey",
                  strokeWidth: 1,
                }}
              />
            </svg>
          </Paper>
        </Slide>
      ) : null}
      {isChecked === "Staking" ? (
        <Slide in={isChecked === "Staking"} direction="left">
          <Paper elevation={5} style={{ margin: 5 }}>
            <svg style={{ width: 100, height: 100 }}>
              <polygon
                points="0,80 45,00, 80,70"
                style={{
                  fill: "orange",
                  stroke: "dimgrey",
                  strokeWidth: 1,
                }}
              />
            </svg>
          </Paper>
        </Slide>
      ) : null}
      {isChecked === "Earning" ? (
        <Slide in={isChecked === "Earning"} direction="left">
          <Paper elevation={5} style={{ margin: 5 }}>
            <svg style={{ width: 100, height: 100 }}>
              <polygon
                points="0,80 45,00, 80,70"
                style={{
                  fill: "orange",
                  stroke: "dimgrey",
                  strokeWidth: 1,
                }}
              />
            </svg>
          </Paper>
        </Slide>
      ) : null}
      {isChecked === "Bonding" ? (
        <Slide in={isChecked === "Bonding"} direction="left">
          <Paper elevation={5} style={{ margin: 5 }}>
            <svg style={{ width: 100, height: 100 }}>
              <polygon
                points="0,80 45,00, 80,70"
                style={{
                  fill: "orange",
                  stroke: "dimgrey",
                  strokeWidth: 1,
                }}
              />
            </svg>
          </Paper>
        </Slide>
      ) : null}
    </Paper>
  );
}

export default SOhmTx;
