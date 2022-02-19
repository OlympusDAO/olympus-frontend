import { Tab, Tabs } from "@olympusdao/component-library";

import { Mode } from "../../../fuse-sdk/helpers/fetchMaxAmount";

export const TabBar = ({ mode, setMode }: { mode: Mode; setMode: (mode: Mode) => any }) => {
  const isSupplySide = mode < 2;

  return (
    <Tabs
      centered
      textColor="primary"
      indicatorColor="primary"
      aria-label="borrow tabs"
      // @ts-ignore
      onChange={(e, index) => setMode(isSupplySide ? index : index + 2)}
      value={mode % 2}
      variant="fullWidth"
    >
      <Tab label={isSupplySide ? "Supply" : "Borrow"} />
      <Tab label={isSupplySide ? "Withdraw" : "Repay"} />
    </Tabs>
  );
};
