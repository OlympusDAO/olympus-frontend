import { t } from "@lingui/macro";
import { Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Icon } from "@olympusdao/component-library";

type EducationGraphicProps = {
  quantity: string;
  verb?: string;
  isLoading?: boolean;
};

type CompactGraphicProps = {
  title: string;
  icon: JSX.Element;
  subtext: string;
  isSubtextContentLoading?: boolean;
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
        <Typography variant="h6" align="center">
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
          <Typography variant="h6" align="center">
            {subtext}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

export function CompactWallet({ quantity, verb = "retained" }: EducationGraphicProps) {
  return (
    <CompactGraphic
      title={t`Wallet`}
      icon={<Icon name="vault-wallet" fontSize="large" />}
      subtext={`${parseFloat(quantity).toFixed(2)} sOHM ${verb}`}
    />
  );
}

export function CompactVault({ quantity, verb = "deposited", isLoading }: EducationGraphicProps) {
  return (
    <CompactGraphic
      title={t`Vault`}
      icon={<Icon name="vault-lock" fontSize="large" />}
      subtext={`${parseFloat(quantity).toFixed(2)} sOHM ${verb}`}
      isSubtextContentLoading={isLoading}
    />
  );
}

export function CompactYield({ quantity }: EducationGraphicProps) {
  return (
    <CompactGraphic
      title={t`Recipient`}
      icon={<Icon name="vault-recipient" fontSize="large" />}
      subtext={`${t`Receives yield from`} ${parseFloat(quantity).toFixed(2)} sOHM`}
    />
  );
}

export function ArrowGraphic() {
  // We hard-code 25px so that the arrows are vertically center-aligned with other graphics
  return (
    <Grid container style={{ marginTop: "25px" }}>
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <Icon name="arrow-right" style={{ fontSize: 70, fill: "#999999" }} opacity={0.6} />{" "}
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
