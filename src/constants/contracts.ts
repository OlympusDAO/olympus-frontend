import { Contract } from "src/helpers/contracts/Contract";
import { BondDepository__factory, OlympusProV2__factory } from "src/typechain";

import { BOND_DEPOSITORY_ADDRESSES, OP_BOND_DEPOSITORY_ADDRESSES } from "./addresses";

export const BOND_DEPOSITORY_CONTRACT = new Contract({
  factory: BondDepository__factory,
  name: "Bond Depository Contract",
  addresses: BOND_DEPOSITORY_ADDRESSES,
});

export const OP_BOND_DEPOSITORY_CONTRACT = new Contract({
  factory: OlympusProV2__factory,
  name: "Olympus Pro Bond Depository Contract",
  addresses: OP_BOND_DEPOSITORY_ADDRESSES,
});
