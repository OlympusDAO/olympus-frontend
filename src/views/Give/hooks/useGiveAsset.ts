import { useState } from "react";
import { ChangeAssetType } from "src/slices/interfaces";

export const useGiveAsset = () => {
  const [giveAsset, setGiveAsset] = useState<"sOHM" | "gOHM">("sOHM");

  const changeGiveAsset: ChangeAssetType = (checked: boolean) => {
    setGiveAsset(checked ? "gOHM" : "sOHM");
  };

  return {
    giveAsset,
    changeGiveAsset,
  };
};
