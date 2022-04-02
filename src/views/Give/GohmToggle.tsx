import { Grid, Switch } from "@material-ui/core";

type GohmToggleProps = {
  giveAssetType: string;
  changeAssetType: (checked: boolean) => void;
};

export const GohmToggle = ({ giveAssetType, changeAssetType }: GohmToggleProps) => {
  return (
    <Grid component="label" container alignItems="center" spacing={1} wrap="nowrap">
      <Grid item>sOHM</Grid>

      <Grid item>
        <Switch
          color="primary"
          className="give-sohm-gohm-checkbox"
          checked={giveAssetType === "gOHM"}
          inputProps={{ "aria-label": "stake to gohm" }}
          onChange={(_, checked) => changeAssetType(checked)}
        />
      </Grid>

      <Grid item>gOHM</Grid>
    </Grid>
  );
};
