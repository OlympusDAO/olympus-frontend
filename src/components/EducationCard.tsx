import { t, Trans } from "@lingui/macro";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Icon, Token } from "@olympusdao/component-library";

const iconStyle = { height: "64px", width: "64px", margin: "auto" };
const smallIconStyle = { height: "32px", width: "32px", margin: "auto" };

type EducationGraphicProps = {
  quantity: string;
  verb?: string;
  isLoading?: boolean;
  small?: boolean;
};

type GenericEducationGraphicProps = {
  message: string;
};

export function WalletGraphic({ quantity, verb = "retained" }: EducationGraphicProps) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" alignContent="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>Wallet</Trans>
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" alignContent="center" justifyContent="center" m={2}>
        <Token name="sOHM" style={{ fontSize: 64 }} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" alignContent="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="message-text">
          {parseFloat(quantity).toFixed(2)} sOHM {verb}
        </Typography>
      </Box>
    </Box>
  );
}

export function DepositSohm({ message }: GenericEducationGraphicProps) {
  return (
    <Box display="flex" flexDirection="column" className="sect" style={{ marginBottom: "16px" }}>
      <Box className="graphic">
        <Box
          display="flex"
          flex="1"
          alignItems="center"
          alignContent="center"
          justifyContent="center"
          m={2}
          style={{ marginBottom: "8px" }}
        >
          <Token name="sOHM" />
        </Box>
        <Box
          display="flex"
          flex="1"
          alignItems="center"
          justifyContent="center"
          style={{ marginBottom: "16px", color: "#999999" }}
        >
          <Typography variant="body1" className="subtext">
            <Trans>Wallet</Trans>
          </Typography>
        </Box>
      </Box>
      <Box display="flex" flex="1" flexDirection="column" alignContent="left" justifyContent="center" className="text">
        <Typography variant="body1" align="center" className="cta-text" style={{ paddingBottom: "0.33rem" }}>
          {message}
        </Typography>
        <Typography variant="body2" align="center" className="education-message" style={{ lineHeight: "16px" }}>
          <Trans>
            Olympus Give is a means of directing the yield that is accrued on your sOHM to another wallet. The first
            step is depositing your sOHM and specifying a recipient.
          </Trans>
        </Typography>
      </Box>
    </Box>
  );
}

export function VaultGraphic({ quantity, verb = "deposited", isLoading, small = true }: EducationGraphicProps) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>Vault</Trans>
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <Icon name="vault-lock" htmlColor="#fff" style={small ? smallIconStyle : iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="message-text">
          {isLoading ? <Skeleton width={120} /> : `${parseFloat(quantity).toFixed(2)} sOHM ${verb}`}
        </Typography>
      </Box>
    </Box>
  );
}

export function LockInVault({ message }: GenericEducationGraphicProps) {
  return (
    <Box className="sect" display="flex" flexDirection="column" minWidth={"33%"} style={{ marginBottom: "16px" }}>
      <Box>
        <Box
          display="flex"
          flex="1"
          alignItems="center"
          justifyContent="center"
          alignContent="center"
          m={2}
          style={{ marginBottom: "8px" }}
        >
          <Icon name="vault-lock" htmlColor="#fff" fontSize="large" />
        </Box>
        <Box
          display="flex"
          flex="1"
          alignItems="center"
          justifyContent="center"
          style={{ marginBottom: "16px", color: "#999999" }}
        >
          <Typography variant="body1" className="subtext">
            <Trans>Vault</Trans>
          </Typography>
        </Box>
      </Box>
      <Box display="flex" flex="1" flexDirection="column" alignContent="left" justifyContent="center" className="text">
        <Typography variant="body1" align="center" className="cta-text" style={{ paddingBottom: "0.33rem" }}>
          {message}
        </Typography>
        <Typography variant="body2" align="center" className="education-message" style={{ lineHeight: "16px" }}>
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
    <Box className="sect" minWidth={"33%"} style={{ marginBottom: "16px" }}>
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
        <Icon name="yield" style={iconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="message-text">
          {`${t`Receives yield from`} ${parseFloat(quantity).toFixed(2)} sOHM`}
        </Typography>
      </Box>
    </Box>
  );
}

// TODO this is currently unused. Remove?
export function RedeemGraphic({ quantity, isLoading }: EducationGraphicProps) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginBottom: "16px" }}>
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
        <Icon name="yield" style={smallIconStyle} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          {isLoading ? <Skeleton width={120} /> : `${t`Redeem`} ${parseFloat(quantity).toFixed(2)} ${`sOHM in yield`}`}
        </Typography>
      </Box>
    </Box>
  );
}

export function ReceivesYield({ message }: GenericEducationGraphicProps) {
  return (
    <Box className="sect" display="flex" flexDirection="column" style={{ marginBottom: "16px" }}>
      <Box>
        <Box
          display="flex"
          flex="1"
          alignItems="center"
          justifyContent="center"
          alignContent="center"
          m={2}
          style={{ marginBottom: "8px" }}
        >
          <Icon name="yield" style={smallIconStyle} className="receives-yield-icon" />
        </Box>
        <Box
          display="flex"
          flex="1"
          alignItems="center"
          justifyContent="center"
          style={{ marginBottom: "16px", color: "#999999" }}
        >
          <Typography variant="body1" className="subtext">
            <Trans>Recipient</Trans>
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        flex="1"
        flexDirection="column"
        alignContent="center"
        justifyContent="center"
        className="text"
      >
        <Typography variant="body1" align="center" className="cta-text" style={{ paddingBottom: "0.33rem" }}>
          {message}
        </Typography>
        <Typography variant="body2" align="center" className="education-message" style={{ lineHeight: "16px" }}>
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
    <Box className="sect" minWidth={"33%"} style={{ marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>Current Deposit</Trans>
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <Token name="sOHM" style={{ fontSize: 64 }} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          {parseFloat(quantity).toFixed(2)} sOHM
        </Typography>
      </Box>
    </Box>
  );
}

export function NewPositionGraphic({ quantity }: EducationGraphicProps) {
  return (
    <Box className="sect" minWidth={"33%"} style={{ marginBottom: "16px" }}>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          <Trans>Updated Deposit</Trans>
        </Typography>
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" m={2}>
        <Token name="sOHM" style={{ fontSize: 64 }} />
      </Box>
      <Box display="flex" flex="1" alignItems="center" justifyContent="center" className="text">
        <Typography variant="h6" align="center" className="cta-text">
          {parseFloat(quantity).toFixed(2)} sOHM
        </Typography>
      </Box>
    </Box>
  );
}

export function ArrowGraphic() {
  return (
    <Box className="sect" minWidth={"2%"} style={{ marginTop: "0px", marginBottom: "0px" }}>
      <Box
        className="arrow-graphic"
        display="flex"
        flex="1"
        alignItems="center"
        justifyContent="center"
        m={2}
        style={{ marginTop: "0px", marginBottom: "0px", height: "20px" }}
      >
        <Icon name="arrow-right" style={{ fontSize: 70 }} opacity={0.6} />
      </Box>
    </Box>
  );
}
