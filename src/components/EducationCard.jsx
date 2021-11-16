import { Box, Button, Container, Grid, Icon, Paper, SvgIcon, Typography } from "@material-ui/core";
import { ReactComponent as sOhmTokenImg } from "../assets/tokens/token_sOHM.svg";
import { ReactComponent as yieldImg } from "../assets/icons/yield.svg";
import { ReactComponent as lockImg } from "../assets/icons/lock.svg";
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
  const lockViewBox = "0 0 16 16";
  const lockIconStyle = { height: "16px", width: "16px", marginRight: "3px" };

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
        <SvgIcon component={lockImg} viewBox={lockViewBox} style={lockIconStyle} />
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          {quantity} sOHM deposited
        </Typography>
      </Box>
    </Box>
  );
}

export function TheyReceiveGraphic({ quantity }) {
  const yieldViewBox = "0 0 20 33";
  const yieldIconStyle = { height: "64px", width: "64px", color: "#708B96" };

  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          Recipient
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" alignContent="center" m={2}>
        <SvgIcon component={yieldImg} viewBox={yieldViewBox} style={yieldIconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          Receives yield from {quantity} sOHM
        </Typography>
      </Box>
    </Box>
  );
}

export function CurrPositionGraphic({ quantity }) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          Current Position
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <SvgIcon component={sOhmTokenImg} viewBox={viewBox} style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          {quantity} sOHM
        </Typography>
      </Box>
    </Box>
  );
}

export function NewPositionGraphic({ quantity }) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          New Position
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <SvgIcon component={sOhmTokenImg} viewBox={viewBox} style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" color="#999999" align="center" className="cta-text">
          {quantity} sOHM
        </Typography>
      </Box>
    </Box>
  );
}
