import { Tab, Tabs } from "@material-ui/core";

import { Mode } from "../../../fuse-sdk/helpers/fetchMaxAmount";

export const TabBar = ({ mode, setMode }: { mode: Mode; setMode: (mode: Mode) => any }) => {
  const isSupplySide = mode < 2;

  return (
    <Tabs
      centered
      textColor="primary"
      indicatorColor="primary"
      aria-label="borrow tabs"
      onChange={(e, index: number) => setMode(isSupplySide ? index : index + 2)}
      value={mode % 2}
      variant="fullWidth"
    >
      <Tab label={isSupplySide ? "Supply" : "Borrow"} />
      <Tab label={isSupplySide ? "Withdraw" : "Repay"} />
    </Tabs>
  );
};
