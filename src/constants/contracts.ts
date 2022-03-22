import { abi as BOND_ABI } from "src/abi/BondDepository.json";
import { abi as OLYMPUS_PRO_ABI } from "src/abi/OlympusProV2.json";
import { Contract } from "src/helpers/contracts/Contract";
import { NetworkId } from "src/networkDetails";
import { BondDepository, OlympusProV2 } from "src/typechain";

export const BOND_DEPOSITORY_CONTRACT = new Contract<BondDepository>({
  abi: BOND_ABI,
  name: "Bond Depository Contract",
  addresses: {
    [NetworkId.TESTNET_RINKEBY]: "0x9810C5c97C57Ef3F23d9ee06813eF7FD51E13042",
    [NetworkId.MAINNET]: "0x9025046c6fb25Fb39e720d97a8FD881ED69a1Ef6",
  },
});

export const OP_BOND_DEPOSITORY_CONTRACT = new Contract<OlympusProV2>({
  abi: OLYMPUS_PRO_ABI,
  name: "Olympus Pro Bond Depository Contract",
  addresses: {
    [NetworkId.TESTNET_RINKEBY]: "0x060cb087a9730E13aa191f31A6d86bFF8DfcdCC0",
    [NetworkId.MAINNET]: "0x22AE99D07584A2AE1af748De573c83f1B9Cdb4c0",
  },
});
