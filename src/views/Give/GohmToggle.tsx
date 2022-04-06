import { Grid, Switch, Typography } from "@material-ui/core";
import { InfoTooltip } from "@olympusdao/component-library";

type GohmToggleProps = {
  giveAssetType: string;
  changeAssetType: (checked: boolean) => void;
};

export const GohmToggle = ({ giveAssetType, changeAssetType }: GohmToggleProps) => {
  return (
    <Grid component="label" container alignItems="center" spacing={1} style={{ padding: "16px" }}>
      <Grid item>
        <Switch
          color="primary"
          className="give-sohm-gohm-checkbox"
          checked={giveAssetType === "gOHM"}
          inputProps={{ "aria-label": "stake to gohm" }}
          onChange={(_, checked) => changeAssetType(checked)}
        />
      </Grid>

      <Grid item style={{ display: "flex" }}>
        <Typography variant="body1" color="textSecondary">
          gOHM deposits
        </Typography>
        <InfoTooltip message="Switching from sOHM to gOHM may incur a tax within your country." />
      </Grid>
    </Grid>
  );
};
