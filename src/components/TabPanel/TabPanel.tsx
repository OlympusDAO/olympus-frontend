import Box from "@material-ui/core/Box";

type TabPanelProps = {
  value: number;
  index: number;
};

const TabPanel: React.FC<TabPanelProps> = ({ value, index, children, ...props }) => (
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
