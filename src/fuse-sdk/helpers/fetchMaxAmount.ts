import Big from "big.js";

import { fetchTokenBalance } from "../hooks/useTokenBalance";
import Fuse from "../index";
import { USDPricedFuseAsset } from "./fetchFusePoolData";

export enum Mode {
  SUPPLY,
  WITHDRAW,
  BORROW,
  REPAY,
}

export async function fetchMaxAmount(mode: Mode, fuse: Fuse, address: string, asset: USDPricedFuseAsset) {
  if (mode === Mode.SUPPLY) {
    const balance = await fetchTokenBalance(asset.underlyingToken, fuse.provider, address);

    return balance;
  }

  if (mode === Mode.REPAY) {
    const balance = await fetchTokenBalance(asset.underlyingToken, fuse.provider, address);
    const debt = Big(asset.borrowBalance);

    if (balance.gt(debt)) {
      return debt;
    } else {
      return balance;
    }
  }

  if (mode === Mode.BORROW) {
    const maxBorrow = await fuse.contracts.FusePoolLensSecondary.callStatic.getMaxBorrow(address, asset.cToken);

    return Big(maxBorrow).times(0.75);
  }

  if (mode === Mode.WITHDRAW) {
    const maxRedeem = await fuse.contracts.FusePoolLensSecondary.callStatic.getMaxRedeem(address, asset.cToken);

    return Big(maxRedeem);
  }
}
