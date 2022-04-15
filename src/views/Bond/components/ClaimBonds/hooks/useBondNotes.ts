import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { BOND_DEPOSITORY_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { getQueryData } from "src/helpers/react-query/getQueryData";
import { useWeb3Context } from "src/hooks";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { Bond, bondQueryKey, fetchBond } from "src/views/Bond/hooks/useBond";

export interface BondNote {
  /**
   * Note index
   */
  id: string;
  /**
   * Bond for this market
   */
  bond: Bond;
  /**
   * Date the bond was created at
   */
  created: number;
  /**
   * Date the bond will fully mature
   */
  matured: number;
  /**
   * Payout denominated in gOHM
   */
  payout: DecimalBigNumber;
}

export const bondNotesQueryKey = (networkId: NetworkId, address: string) => ["useBondNotes", networkId, address];

export const useBondNotes = () => {
  const { address } = useWeb3Context();
  const networks = useTestableNetworks();
  const args = [networks.MAINNET, address] as const;
  return useQuery(bondNotesQueryKey(...args), () => fetchBondNotes(...args), { enabled: !!address });
};

export const fetchBondNotes = async (networkId: NetworkId.MAINNET | NetworkId.TESTNET_RINKEBY, address: string) => {
  const contract = BOND_DEPOSITORY_CONTRACT.getEthersContract(networkId);

  const ids = await contract.indexesFor(address).then(ids => ids.map(id => id.toString()));

  const promises = await Promise.allSettled(
    ids.map(async id => {
      const note = await contract.notes(address, id);

      const bondMarketId = note.marketID.toString();
      const args = { id: bondMarketId, networkId, isInverseBond: false };
      const bond = await getQueryData(bondQueryKey(args), () => fetchBond(args));

      return {
        id,
        bond,
        created: note.created * 1000, // Converts date to milliseconds
        matured: note.matured * 1000,
        payout: new DecimalBigNumber(note.payout, 18), // Always denominated in gOHM,
      };
    }),
  );

  return promises
    .filter(({ status }) => status === "fulfilled")
    .map(promise => (promise as PromiseFulfilledResult<BondNote>).value);
};
