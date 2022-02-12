import { useQuery } from "react-query";

import { createComptroller } from "../helpers/createComptroller";
import { useRari } from "../helpers/RariContext";

export const useExtraPoolInfo = (comptrollerAddress: string) => {
  const { fuse, address } = useRari();

  const { data } = useQuery(comptrollerAddress + " extraPoolInfo", async () => {
    const comptroller = createComptroller(comptrollerAddress, fuse);

    const [
      { 0: admin, 1: upgradeable },
      oracle,
      closeFactor,
      liquidationIncentive,
      enforceWhitelist,
      whitelist,
      pendingAdmin,
    ] = await Promise.all([
      fuse.contracts.FusePoolLensSecondary.getPoolOwnership(comptrollerAddress),

      fuse.getPriceOracle(await comptroller.oracle()),

      comptroller.closeFactorMantissa(),

      comptroller.liquidationIncentiveMantissa(),

      (() => {
        return comptroller
          .enforceWhitelist()
          .then((x: boolean) => x)
          .catch((_: any) => false);
      })(),

      (() => {
        return comptroller
          .getWhitelist()
          .then((x: string[]) => x)
          .catch((_: any) => []);
      })(),

      comptroller.pendingAdmin(),
    ]);

    return {
      admin,
      upgradeable,
      enforceWhitelist,
      whitelist: whitelist as string[],
      isPowerfulAdmin: admin.toLowerCase() === address.toLowerCase() && upgradeable,
      oracle,
      closeFactor,
      liquidationIncentive,
      pendingAdmin,
    };
  });

  return data;
};
