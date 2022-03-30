import { useQuery } from "react-query";
import { BOND_DEPOSITORY_CONTRACT, OP_BOND_DEPOSITORY_CONTRACT } from "src/constants/contracts";
import { OHM_TOKEN } from "src/constants/tokens";
import { Bond } from "src/helpers/bonds/Bond";
import { getTokenByAddress } from "src/helpers/contracts/getTokenByAddress";
import { assert } from "src/helpers/types/assert";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";

export const activeBondsQueryKey = (networkId: NetworkId, isInverseBond: boolean) =>
  ["useActiveBonds", networkId, isInverseBond].filter(nonNullable);

export const useActiveBonds = ({ isInverseBond = false }: { isInverseBond?: boolean } = {}) => {
  const networks = useTestableNetworks();

  return useQuery(activeBondsQueryKey(networks.MAINNET, isInverseBond), async () => {
    const contract = isInverseBond ? OP_BOND_DEPOSITORY_CONTRACT : BOND_DEPOSITORY_CONTRACT;
    const depository = contract.getEthersContract(networks.MAINNET);

    const marketIds = await depository.liveMarkets().then(ids => ids.map(id => id.toString()));
    const marketInfos = await Promise.all(marketIds.map(id => depository.markets(id)));

    return marketIds.map((id, index) => {
      const address = marketInfos[index].quoteToken;
      const quoteToken = getTokenByAddress(address);

      assert(quoteToken, `Unknown token address: ${address}`);

      return new Bond({ id, quoteToken, baseToken: OHM_TOKEN });
    });
  });
};
