import { Button, CircularProgress } from "@material-ui/core";
import { useState } from "react";

import { USDPricedFuseAsset } from "../../../fuse-sdk/helpers/fetchFusePoolData";
import { fetchMaxAmount, Mode } from "../../../fuse-sdk/helpers/fetchMaxAmount";
import { useRari } from "../../../fuse-sdk/helpers/RariContext";

export const TokenNameAndMaxButton = ({
  updateAmount,
  asset,
  mode,
}: {
  asset: USDPricedFuseAsset;
  mode: Mode;
  updateAmount: (newAmount: string) => any;
}) => {
  const { fuse, address } = useRari();

  const [isMaxLoading, setIsMaxLoading] = useState(false);

  const setToMax = async () => {
    setIsMaxLoading(true);

    try {
      const maxBN = await fetchMaxAmount(mode, fuse, address, asset);

      if (!maxBN || maxBN.lte(0)) {
        updateAmount("");
      } else {
        const str = maxBN.div(10 ** asset.underlyingDecimals).toString();

        updateAmount(str);
      }

      setIsMaxLoading(false);
    } catch (e) {
      console.log(e);
      // TODO toast
      // handleGenericError(e, toast);
    }
  };

  return isMaxLoading ? <CircularProgress size={20} /> : <Button onClick={setToMax}>{"MAX"}</Button>;
};
