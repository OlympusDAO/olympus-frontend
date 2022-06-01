import { t } from "@lingui/macro";
import { Grid, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { Icon } from "@olympusdao/component-library";

type EducationGraphicProps = {
  quantity: string;
  asset: string;
  isQuantityExact: boolean;
  verb?: string;
  isLoading?: boolean;
};

type CompactGraphicProps = {
  title: string;
  icon: JSX.Element;
  subtext: string;
  isSubtextContentLoading?: boolean;
};

type ArrowGraphicProps = {
  fill: string;
  marginTop?: string;
};

type LargeGraphicProps = {
  title: string;
  icon: JSX.Element;
  subtitle: string;
  subtext: string;
};

// ***
// Compact components without explanatory text
function CompactGraphic({ title, icon, subtext, isSubtextContentLoading }: CompactGraphicProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" align="center" className="grey-text">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} container justifyContent="center">
        {icon}
      </Grid>
      <Grid item xs={12}>
        {isSubtextContentLoading ? (
          <Skeleton width={120} />
        ) : (
          <Typography variant="h6" className="grey-text" align="center">
            {subtext}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

export function CompactWallet({ quantity, isQuantityExact, asset, verb = "retained" }: EducationGraphicProps) {
  return (
    <CompactGraphic
      title={t`Wallet`}
      icon={<Icon name="vault-wallet" fontSize="large" />}
      subtext={`${isQuantityExact ? "" : "≈ "}${quantity} ${asset} ${verb}`}
    />
  );
}

export function CompactVault({
  quantity,
  isQuantityExact,
  asset,
  verb = "deposited",
  isLoading,
}: EducationGraphicProps) {
  return (
    <CompactGraphic
      title={t`Vault`}
      icon={<Icon name="vault-lock" fontSize="large" />}
      subtext={`${isQuantityExact ? "" : "≈ "}${quantity} ${asset} ${verb}`}
      isSubtextContentLoading={isLoading}
    />
  );
}

export function CompactYield({ quantity, isQuantityExact, asset }: EducationGraphicProps) {
  return (
    <CompactGraphic
      title={t`Recipient`}
      icon={<Icon name="vault-recipient" fontSize="large" />}
      subtext={t`Receives yield from ${isQuantityExact ? "" : "≈ "}${quantity} ${asset}`}
    />
  );
}

export function ArrowGraphic({ fill, marginTop = "25px" }: ArrowGraphicProps) {
  return (
    <Grid container style={{ marginTop: marginTop }}>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <Icon name="arrow-right" data-testid="arrow" style={{ fontSize: 70, fill: fill }} />{" "}
      </Grid>
    </Grid>
  );
}

// ***
// Larger components with explanatory text
function LargeGraphic({ title, icon, subtitle, subtext }: LargeGraphicProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} container justifyContent="center">
        {icon}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align="center" className="subtext">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" align="center">
          {subtitle}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" align="center">
          {subtext}
        </Typography>
      </Grid>
    </Grid>
  );
}

export function LargeWallet() {
  return (
    <LargeGraphic
      icon={<Icon name="vault-wallet" fontSize="large" />}
      title={t`Wallet`}
      subtitle={t`Deposit sOHM from wallet`}
      subtext={t`Olympus Give is a means of directing the yield that is accrued on your sOHM to another wallet. The first step is depositing your sOHM and specifying a recipient.`}
    />
  );
}

export function LargeVault() {
  return (
    <LargeGraphic
      icon={<Icon name="vault-lock" fontSize="large" />}
      title={t`Vault`}
      subtitle={t`Lock sOHM in vault`}
      subtext={t`Then, your deposited sOHM is kept in a vault smart contract that will send your rebases to the recipient.
      You can withdraw or edit your principal sOHM amount at any time.`}
    />
  );
}

export function LargeYield() {
  return (
    <LargeGraphic
      icon={<Icon name="vault-recipient" fontSize="large" />}
      title={t`Recipient`}
      subtitle={t`Recipient earns sOHM rebases`}
      subtext={t`The recipient you specified, or the project you selected, will then receive the rebases associated with your
      sOHM deposit until you withdraw your sOHM principal from the vault.`}
    />
  );
}
