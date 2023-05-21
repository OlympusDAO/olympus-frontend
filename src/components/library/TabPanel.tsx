import Box from "@mui/material/Box";
import React, { ReactElement } from "react";

interface Props {
  value: number;
  index: number;
  children: ReactElement | JSX.Element;
}

const TabPanel: React.FC<Props> = ({ value, index, children, ...props }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...props}
    style={{ overflow: "hidden" }}
  >
    {value === index && <Box p={2}>{children}</Box>}
  </div>
);

export default TabPanel;
