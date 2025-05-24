import { Link } from "@mui/material";
import { InfoNotification } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { Link as RouterLink } from "react-router-dom";
import { useGovernanceDelegationCheck } from "src/views/Governance/hooks/useGovernanceDelegationCheck";

export const DelegationMessage = () => {
  const {
    gOHMDelegationAddress,
    coolerV1ClearingHouseDelegationAddress,
    coolerV2ClearingHouseDelegationAddress,
    coolerV3ClearingHouseDelegationAddress,
    hasCoolerV2Delegations,
    gohmBalance,
    gohmCoolerV1ClearingHouseBalance,
    gohmCoolerV2ClearingHouseBalance,
    gohmCoolerV3ClearingHouseBalance,
    gohmCoolerV2Balance,
  } = useGovernanceDelegationCheck();

  const undelegatedV1ClearingHouseCooler =
    !coolerV1ClearingHouseDelegationAddress &&
    gohmCoolerV1ClearingHouseBalance &&
    gohmCoolerV1ClearingHouseBalance.value.gt(BigNumber.from("1000000000000"));

  const undelegatedV2ClearingHouseCooler =
    !coolerV2ClearingHouseDelegationAddress &&
    gohmCoolerV2ClearingHouseBalance &&
    gohmCoolerV2ClearingHouseBalance.value.gt(BigNumber.from("1000000000000"));

  const undelegatedV3ClearingHouseCooler =
    !coolerV3ClearingHouseDelegationAddress &&
    gohmCoolerV3ClearingHouseBalance &&
    gohmCoolerV3ClearingHouseBalance.value.gt(BigNumber.from("1000000000000"));

  const undelegatedCoolerV2 =
    !hasCoolerV2Delegations &&
    gohmCoolerV2Balance &&
    BigNumber.from(gohmCoolerV2Balance).gt(BigNumber.from("1000000000000"));

  const undelegatedGohm =
    !gOHMDelegationAddress && gohmBalance && gohmBalance.value.gt(BigNumber.from("1000000000000"));

  if (
    undelegatedV1ClearingHouseCooler ||
    undelegatedV2ClearingHouseCooler ||
    undelegatedV3ClearingHouseCooler ||
    undelegatedCoolerV2 ||
    undelegatedGohm
  ) {
    return (
      <InfoNotification>
        To participate in on-chain governance you must delegate your gOHM{" "}
        <Link component={RouterLink} to="/governance/delegate">
          Learn More
        </Link>
      </InfoNotification>
    );
  }

  return null;
};
