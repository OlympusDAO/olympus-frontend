import { Box, Button, Container, Grid, Icon, Paper, SvgIcon, Typography } from "@material-ui/core";
import { ReactComponent as sOhmTokenImg } from "../assets/tokens/token_sOHM.svg";

export function YouRetainGraphic({ quantity }) {
  let viewBox = "0 0 128 128";
  let style = { height: "64px", width: "64px" };

  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          You Retain
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <SvgIcon component={sOhmTokenImg} viewBox={viewBox} style={style} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          {quantity} sOHM
        </Typography>
      </Box>
    </Box>
  );
}

export function LockedInVault({ quantity }) {}

export function TheyReceive({ recipient }) {}
