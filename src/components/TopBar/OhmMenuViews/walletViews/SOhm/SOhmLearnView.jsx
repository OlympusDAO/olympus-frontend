import { SvgIcon, Button, Typography, Box, Drawer } from "@material-ui/core";
import { useState } from "react";

function SOhmLHIW() {
  const toggleDrawer = data => () => {
    setAnchor(data);
  };

  const [anchor, setAnchor] = useState(false);

  return (
    <Box className="ohm-pairs" style={{ width: "100%" }}>
      <Button onClick={toggleDrawer("sOHMtx")} variant="contained" style={{ width: "100%" }} color="secondary">
        <Typography align="left"> Transaction History</Typography>
      </Button>
      <Button onClick={toggleDrawer("sOHMZaps")} variant="contained" style={{ width: "100%" }} color="secondary">
        <Typography align="left"> Learn how it works</Typography>
      </Button>
      <Button onClick={toggleDrawer("sOHMZaps")} variant="contained" style={{ width: "100%" }} color="secondary">
        <Typography align="left"> test</Typography>
      </Button>
      <Drawer style={{ width: "40%" }} anchor={"right"} open={anchor === "sOHMZaps"} onClose={toggleDrawer("OG")}>
        sOHM Zap Stuff
      </Drawer>
      <Drawer style={{ width: "40%" }} anchor={"right"} open={anchor === "sOHMtx"} onClose={toggleDrawer("OG")}>
        test
      </Drawer>
    </Box>
  );
}

export default SOhmLHIW;
