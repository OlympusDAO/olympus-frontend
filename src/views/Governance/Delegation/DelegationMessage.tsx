import { Link } from "@mui/material";
import { InfoNotification } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { Link as RouterLink } from "react-router-dom";
import { useGovernanceDelegationCheck } from "src/views/Governance/hooks/useGovernanceDelegationCheck";

export const DelegationMessage = () => {
  const {
    gOHMDelegationAddress,
    coolerV1DelegationAddress,
    coolerV2DelegationAddress,
    gohmBalance,
    gohmCoolerV1Balance,
    gohmCoolerV2Balance,
  } = useGovernanceDelegationCheck();

  const undelegatedV1Cooler =
    !coolerV1DelegationAddress && gohmCoolerV1Balance && gohmCoolerV1Balance.value.gt(BigNumber.from("1000000000000"));
  const undelegatedV2Cooler =
    !coolerV2DelegationAddress && gohmCoolerV2Balance && gohmCoolerV2Balance.value.gt(BigNumber.from("1000000000000"));
  const undelegatedGohm =
    !gOHMDelegationAddress && gohmBalance && gohmBalance.value.gt(BigNumber.from("1000000000000"));

  if (undelegatedV1Cooler || undelegatedV2Cooler || undelegatedGohm) {
    return (
      <InfoNotification>
        To participate on on-chain governance you must delegate your gOHM{" "}
        <Link component={RouterLink} to="/governance/delegate">
          Learn More
        </Link>
      </InfoNotification>
    );
  }
};
