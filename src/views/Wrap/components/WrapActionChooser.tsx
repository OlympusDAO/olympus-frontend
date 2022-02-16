import { t } from "@lingui/macro";
import { FormControl, MenuItem, Select, Typography } from "@material-ui/core";

export type WrapAction = "wrap" | "unwrap";

const WrapActionChooser: React.FC<{ action: WrapAction; setAction: (action: WrapAction) => void }> = ({
  action,
  setAction,
}) => {
  const changeAction = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
    setAction(event.target.value as WrapAction);
  };
  const currentAction = () => {
    if (action === "wrap") return t`Wrap from`;
    if (action === "unwrap") return t`Unwrap from`;
  };

  return (
    <>
      <Typography>
        <span className="asset-select-label" style={{ whiteSpace: "nowrap" }}>
          {currentAction()}
        </span>
      </Typography>
      <FormControl
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "0 10px",
          height: "33px",
          minWidth: "69px",
        }}
      >
        <Select id="asset-select" value={action} label="Asset" onChange={changeAction} disableUnderline>
          <MenuItem value={"wrap"}>sOHM</MenuItem>
          <MenuItem value={"unwrap"}>gOHM</MenuItem>
        </Select>
      </FormControl>

      <Typography>
        <span className="asset-select-label"> to </span>
      </Typography>
      <FormControl
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "0 10px",
          height: "33px",
          minWidth: "69px",
        }}
      >
        <Select id="asset-select" value={action} label="Asset" onChange={changeAction} disableUnderline>
          <MenuItem value={"wrap"}>gOHM</MenuItem>
          <MenuItem value={"unwrap"}>sOHM</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default WrapActionChooser;
