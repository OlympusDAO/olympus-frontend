import { Box, Tab, Tabs } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export const GovernanceNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const value = currentPath.includes("/governance/delegate") ? 1 : 0;

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      navigate("/governance");
    } else {
      navigate("/governance/delegate");
    }
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
      <Tabs value={value} onChange={handleChange} TabIndicatorProps={{ style: { display: "none" } }}>
        <Tab label="Proposals" />
        <Tab label="Delegation" />
      </Tabs>
    </Box>
  );
};
