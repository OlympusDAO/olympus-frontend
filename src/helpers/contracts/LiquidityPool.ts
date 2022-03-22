import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { AddressMap } from "src/constants/addresses";
import { PairContract } from "src/typechain";

import { Contract, ContractConfig } from "./Contract";

export type LiquidityPoolConfig<TAddressMap extends AddressMap = AddressMap> = Omit<ContractConfig<TAddressMap>, "abi">;

export class LiquidityPool<TAddressMap extends AddressMap = AddressMap> extends Contract<PairContract, TAddressMap> {
  constructor(config: LiquidityPoolConfig<TAddressMap>) {
    super({
      name: config.name,
      abi: PAIR_CONTRACT_ABI,
      addresses: config.addresses,
    });
  }
}
