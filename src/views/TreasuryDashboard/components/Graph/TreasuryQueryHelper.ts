import { TokenSupply } from "src/generated/graphql";
import {
  getGOhmSyntheticSupply,
  getOhmFloatingSupply,
} from "src/views/TreasuryDashboard/components/Graph/TokenSupplyQueryHelper";

export const getLiquidBackingPerOhmFloating = (liquidBacking: number, tokenSupplies: TokenSupply[]) =>
  liquidBacking / getOhmFloatingSupply(tokenSupplies);

export const getLiquidBackingPerGOhmSynthetic = (
  liquidBacking: number,
  currentIndex: number,
  tokenSupplies: TokenSupply[],
) => liquidBacking / getGOhmSyntheticSupply(currentIndex, getOhmFloatingSupply(tokenSupplies));
