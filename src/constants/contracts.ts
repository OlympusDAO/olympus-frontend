import { abi as BOND_ABI } from "src/abi/BondDepository.json";
import { abi as OLYMPUS_PRO_ABI } from "src/abi/OlympusProV2.json";
import { Contract } from "src/helpers/contracts/Contract";
import { BondDepository, OlympusProV2 } from "src/typechain";

import { BOND_DEPOSITORY_ADDRESSES, OP_BOND_DEPOSITORY_ADDRESSES } from "./addresses";

export const BOND_DEPOSITORY_CONTRACT = new Contract<BondDepository, typeof BOND_DEPOSITORY_ADDRESSES>({
  abi: BOND_ABI,
  name: "Bond Depository Contract",
  addresses: BOND_DEPOSITORY_ADDRESSES,
});

export const OP_BOND_DEPOSITORY_CONTRACT = new Contract<OlympusProV2, typeof OP_BOND_DEPOSITORY_ADDRESSES>({
  abi: OLYMPUS_PRO_ABI,
  name: "Olympus Pro Bond Depository Contract",
  addresses: OP_BOND_DEPOSITORY_ADDRESSES,
});
