import { Box, Link } from "@mui/material";
import { Icon } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { DelegationManagement } from "src/views/Lending/CoolerV2/components/DelegationManagement";
import { PositionOverview } from "src/views/Lending/CoolerV2/components/PositionOverview";

export const CoolerV2 = () => {
  return (
    <div id="coolerv2-view">
      <PageTitle
        name="Cooler V2"
        subtitle={
          <Box display="flex" flexDirection="row" alignItems="center" gap="4px">
            Borrow against your gOHM collateral with flexible delegation.{" "}
            <Link
              component={RouterLink}
              to="https://docs.olympusdao.finance/main/overview/cooler-loans"
              target="_blank"
              rel="noopener noreferrer"
              alignItems="center"
              display="flex"
              gap="4px"
            >
              Learn More <Icon name="arrow-up" sx={{ fontSize: "14px" }} />
            </Link>
          </Box>
        }
      />
      <Box width="97%" maxWidth="974px" display="flex" flexDirection="column" gap={2}>
        <PositionOverview />
        <DelegationManagement />
      </Box>
    </div>
  );
};

export default CoolerV2;
