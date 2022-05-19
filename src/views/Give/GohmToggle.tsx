import { Grid, Switch, Typography } from "@mui/material";
import { InfoTooltip } from "@olympusdao/component-library";
import { ChangeAssetType } from "src/slices/interfaces";

type GohmToggleProps = {
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
};

export const GohmToggle = ({ giveAssetType, changeAssetType }: GohmToggleProps) => {
  return (
    <Grid component="label" container alignItems="center" spacing={1} style={{ marginBottom: "20px" }}>
      <Grid item>
        <Switch
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
        <InfoTooltip message="Select which token you would like to donate." />
      </Grid>
    </Grid>
  );
};
