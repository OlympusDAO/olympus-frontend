import { Tab as MuiTab, TabProps } from "@mui/material";
import React from "react";

const a11yProps = (index: number) => ({
  id: `simple-tab-${index}`,
  "aria-controls": `simple-tabpanel-${index}`,
});

const Tab: React.FC<TabProps> = ({ value, label, ...props }) => (
  <MuiTab value={value} label={label} {...a11yProps(value)} {...props} />
);

export default Tab;
