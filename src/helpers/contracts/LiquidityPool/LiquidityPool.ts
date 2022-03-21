import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { AddressMap } from "src/constants/addresses";
import { Contract, ContractConfig } from "src/helpers/contracts/Contract/Contract";
import { PairContract } from "src/typechain";

export type LiquidityPoolConfig<TAddressMap extends AddressMap = AddressMap> = Omit<ContractConfig<TAddressMap>, "abi">;

export class LiquidityPool<TAddressMap extends AddressMap = AddressMap> extends Contract<PairContract, TAddressMap> {
  constructor(config: LiquidityPoolConfig<TAddressMap>) {
    super({ abi: PAIR_CONTRACT_ABI, ...config });
  }
}
