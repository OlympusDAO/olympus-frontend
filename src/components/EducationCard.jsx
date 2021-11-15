import { Box, Button, Container, Grid, Icon, Paper, SvgIcon, Typography } from "@material-ui/core";
import { ReactComponent as sOhmTokenImg } from "../assets/tokens/token_sOHM.svg";
import { shorten } from "src/helpers";

const viewBox = "0 0 100 100";
const iconStyle = { height: "64px", width: "64px", margin: "auto" };

export function YouRetainGraphic({ quantity }) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" alignContent="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          Wallet
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" alignContent="center" justifyContent="center" m={2}>
        <SvgIcon component={sOhmTokenImg} viewBox={viewBox} style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" alignContent="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          {quantity} sOHM retained
        </Typography>
      </Box>
    </Box>
  );
}

export function LockedInVaultGraphic({ quantity }) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" algin="center" className="cta-text">
          Vault
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <SvgIcon component={sOhmTokenImg} viewBox={viewBox} style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          {quantity} sOHM deposited
        </Typography>
      </Box>
    </Box>
  );
}

export function TheyReceiveGraphic({ quantity }) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          Recipient
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <SvgIcon component={sOhmTokenImg} viewBox={viewBox} style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          Receives yield from {quantity} sOHM
        </Typography>
      </Box>
    </Box>
  );
}
