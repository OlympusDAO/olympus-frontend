import { Box, Button, Container, Grid, Icon, Paper, SvgIcon, Typography } from "@material-ui/core";
import { ReactComponent as sOhmTokenImg } from "../assets/tokens/token_sOHM.svg";
import { ReactComponent as yieldImg } from "../assets/icons/yield.svg";
import { ReactComponent as vaultLockImg } from "../assets/icons/vault-lock.svg";
import { ReactComponent as arrowRightImg } from "../assets/icons/arrow-right.svg";
import { shorten } from "src/helpers";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import { t, Trans } from "@lingui/macro";

const viewBox = "0 0 100 100";
// The sOHM SVG is 100x100px, whereas the others are 50x50px
const smallViewBox = "0 0 50 50";
const iconStyle = { height: "64px", width: "64px", margin: "auto" };
const smallIconStyle = { height: "32px", width: "32px", margin: "auto" };

type EducationGraphicProps = {
  quantity: string;
  verb?: string;
};

type GenericEducationGraphicProps = {
  message: string;
};

export function WalletGraphic({ quantity, verb = "retained" }: EducationGraphicProps) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" alignContent="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>Wallet</Trans>
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" alignContent="center" justifyContent="center" m={2}>
        <SvgIcon component={sOhmTokenImg} viewBox={viewBox} style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" alignContent="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>
            {quantity} sOHM {verb}
          </Trans>
        </Typography>
      </Box>
    </Box>
  );
}

export function DepositSohm({ message }: GenericEducationGraphicProps) {
  return (
    <Box className="sect" style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box
        display="flex"
        flex="1"
        alignItems="center"
        alignContent="center"
        justifyContent="center"
        m={2}
        style={{ marginBottom: "8px" }}
      >
        <SvgIcon component={sOhmTokenImg} viewBox={viewBox} style={smallIconStyle} />
      </Box>
      <Box
        display="flex"
        flex="1"
        alignItems="center"
        justifyContent="center"
        className="text"
        style={{ marginBottom: "16px", color: "#999999" }}
      >
        <Typography variant="body1" className="subtext">
          <Trans>Wallet</Trans>
        </Typography>
      </Box>
      <Box display="flex" flex="1" flexDirection="column" alignContent="left" justifyContent="center" className="text">
        <Typography variant="body1" align="left" className="cta-text" style={{ paddingBottom: "0.33rem" }}>
          <Trans>{message}</Trans>
        </Typography>
        <Typography variant="body2" align="left" className="education-message" style={{ lineHeight: "16px" }}>
          <Trans>
            Olympus Give is a means of directing the yield that is accrued on your sOHM to another wallet. The first
            step is depositing your sOHM and specifying a recipient.
          </Trans>
        </Typography>
      </Box>
    </Box>
  );
}

export function VaultGraphic({ quantity, verb = "deposited" }: EducationGraphicProps) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>Vault</Trans>
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <SvgIcon component={vaultLockImg} viewBox={smallViewBox} style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>
            {quantity} sOHM {verb}
          </Trans>
        </Typography>
      </Box>
    </Box>
  );
}

export function LockInVault({ message }: GenericEducationGraphicProps) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box
        display="flex"
        flex="1"
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        m={2}
        style={{ marginBottom: "8px" }}
      >
        <SvgIcon component={vaultLockImg} viewBox={smallViewBox} style={smallIconStyle} />
      </Box>
      <Box
        display="flex"
        flex="1"
        alignItems="center"
        justifyContent="center"
        className="text"
        style={{ marginBottom: "16px", color: "#999999" }}
      >
        <Typography variant="body1" className="subtext">
          <Trans>Vault</Trans>
        </Typography>
      </Box>
      <Box display="flex" flex="1" flexDirection="column" alignContent="left" justifyContent="center" className="text">
        <Typography variant="body1" align="left" className="cta-text" style={{ paddingBottom: "0.33rem" }}>
          <Trans>{message}</Trans>
        </Typography>
        <Typography variant="body2" align="left" className="education-message" style={{ lineHeight: "16px" }}>
          <Trans>
            Then, your deposited sOHM is kept in a vault smart contract that will send your rebases to the recipient.
            You can withdraw or edit your principal sOHM amount at any time.
          </Trans>
        </Typography>
      </Box>
    </Box>
  );
}

export function YieldGraphic({ quantity }: EducationGraphicProps) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>Recipient</Trans>
        </Typography>
      </Box>
      <Box
        className="yield-graphic"
        display="flex"
        flex="1"
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        m={2}
      >
        <SvgIcon component={yieldImg} viewBox={smallViewBox} style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>Receives yield from {quantity} sOHM</Trans>
        </Typography>
      </Box>
    </Box>
  );
}

export function RedeemGraphic({ quantity }: EducationGraphicProps) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>You</Trans>
        </Typography>
      </Box>
      <Box
        display="flex"
        flex="1"
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        m={2}
        className="yield-graphic"
      >
        <SvgIcon component={yieldImg} viewBox={smallViewBox} style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>Redeem {quantity} sOHM in yield</Trans>
        </Typography>
      </Box>
    </Box>
  );
}

export function ReceivesYield({ message }: GenericEducationGraphicProps) {
  return (
    <Box className="sect" style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box
        display="flex"
        flex="1"
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        m={2}
        style={{ marginBottom: "8px" }}
      >
        <SvgIcon component={yieldImg} viewBox={smallViewBox} style={smallIconStyle} className="receives-yield-icon" />
      </Box>
      <Box
        display="flex"
        flex="1"
        alignItems="center"
        justifyContent="center"
        className="text"
        style={{ marginBottom: "16px", color: "#999999" }}
      >
        <Typography variant="body1" className="subtext">
          <Trans>Recipient</Trans>
        </Typography>
      </Box>
      <Box display="flex" flex="1" flexDirection="column" alignContent="left" justifyContent="center" className="text">
        <Typography variant="body1" align="left" className="cta-text" style={{ paddingBottom: "0.33rem" }}>
          <Trans>{message}</Trans>
        </Typography>
        <Typography variant="body2" align="left" className="education-message" style={{ lineHeight: "16px" }}>
          <Trans>
            The recipient you specified, or the project you selected, will then receive the rebases associated with your
            sOHM deposit until you withdraw your sOHM principal from the vault.
          </Trans>
        </Typography>
      </Box>
    </Box>
  );
}

export function CurrPositionGraphic({ quantity }: EducationGraphicProps) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>Current Deposit</Trans>
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <SvgIcon component={sOhmTokenImg} viewBox={viewBox} style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>{quantity} sOHM</Trans>
        </Typography>
      </Box>
    </Box>
  );
}

export function NewPositionGraphic({ quantity }: EducationGraphicProps) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>Updated Deposit</Trans>
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <SvgIcon component={sOhmTokenImg} viewBox={viewBox} style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>{quantity} sOHM</Trans>
        </Typography>
      </Box>
    </Box>
  );
}

export function ArrowGraphic() {
  const arrowViewBox = "0 0 57 24";
  return (
    <Box className="sect" minWidth={"2%"} style={{ marginTop: "0px", marginBottom: "0px" }}>
      <Box className="arrow-graphic" display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <SvgIcon component={arrowRightImg} viewBox={arrowViewBox} style={iconStyle} />
      </Box>
    </Box>
  );
}
