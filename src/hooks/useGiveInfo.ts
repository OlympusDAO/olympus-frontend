/*
import { useQueries, useQuery, UseQueryResult } from "react-query";
import { NetworkId } from "src/constants";
import {
  AddressMap,
  GIVE_ADDRESSES,
} from "src/constants/addresses";
import { BigNumber } from "ethers";
import { isTestnet } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";

import { useWeb3Context } from ".";
import { useDynamicGiveContract } from "./useContract";
import { useTestableNetworks } from "./useTestableNetworks";
import { useTestMode } from "./useTestMode";
import { IUserDonationInfo } from "src/views/Give/Interfaces";
import { t } from "@lingui/macro";
import { GetDonationDate } from "src/helpers/GetDonationDate";

export const donationInfoQueryKey = (address: string) => ["useDonationInfo", address].filter(nonNullable);
export useDonationInfo = () => {
  const isTestMode = useTestMode();
  const { address } = useWeb3Context();
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);
  const networks = useTestableNetworks();

  const query = useQuery<IUserDonationInfo[] | null, Error>(
    donationInfoQueryKey(address),
    async () => {
      queryAssertion(address, donationInfoQueryKey(address));

      const donationInfo: IUserDonationInfo[] = [];

      if (!contract) return donationInfo;

      const allDeposits: [string[], BigNumber[]] = await contract.getAllDeposits(address);
      for (let i = 0; i < allDeposits[0].length; i++) {
        if (allDeposits[1][i].eq(0)) continue;

        const firstDonationDatePromise = GetDonationDate({
          address: address,
          recipient: allDeposits[0][i],
          networkID: networks.MAINNET,
          provider
        })
      }
    }
  )
}
*/
export {};
