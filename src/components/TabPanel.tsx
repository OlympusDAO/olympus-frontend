import Box from "@material-ui/core/Box";
import React from "react";

interface ITabPanelProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly index: number;
  readonly value: number;
}

const TabPanel: React.FC<ITabPanelProps> = (props: ITabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};
export default TabPanel;
