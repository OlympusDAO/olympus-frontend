import { t } from "@lingui/macro";
// import { IUserDonationInfo } from "src/views/Give/Interfaces";
// import { t } from "@lingui/macro";
// import { GetDonationDate } from "src/helpers/GetDonationDate";
import { BigNumber, ethers } from "ethers";
import { useQuery } from "react-query";
import { GIVE_ADDRESSES } from "src/constants/addresses";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
// import { BigNumber } from "ethers";
// import { isTestnet } from "src/helpers";
// import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
// import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";

import { useWeb3Context } from ".";
// import { useWeb3Context } from ".";
import { useDynamicGiveContract } from "./useContract";
import { useTestableNetworks } from "./useTestableNetworks";
import { useTestMode } from "./useTestMode";

interface IDonorAddresses {
  [key: string]: boolean;
}

interface IUserRecipientInfo {
  totalDebt: string;
  carry: string;
  agnosticDebt: string;
  indexAtLastChange: string;
}

/*
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

export const recipientInfoQueryKey = (address: string) => ["useRecipientInfo", address].filter(nonNullable);
export const useRecipientInfo = (address: string) => {
  const isTestMode = useTestMode();
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);
  const networks = useTestableNetworks();

  const query = useQuery<IUserRecipientInfo, Error>(
    recipientInfoQueryKey(address),
    async () => {
      queryAssertion(address, recipientInfoQueryKey(address));

      if (!contract) throw new Error(t`Please switch to the Ethereum network`);

      const recipientInfo: IUserRecipientInfo = {
        totalDebt: "",
        carry: "",
        agnosticDebt: "",
        indexAtLastChange: "",
      };

      const recipientInfoData = await contract.recipientInfo(address);
      recipientInfo.totalDebt = ethers.utils.formatUnits(recipientInfoData.totalDebt, "gwei");
      recipientInfo.carry = ethers.utils.formatUnits(recipientInfoData.carry, "gwei");
      recipientInfo.agnosticDebt = ethers.utils.formatUnits(recipientInfoData.agnosticDebt, "gwei");
      recipientInfo.indexAtLastChange = ethers.utils.formatUnits(recipientInfoData.indexAtLastChange, "gwei");

      console.log(recipientInfoData);

      return recipientInfo;
    },
    { enabled: !!address },
  );

  return { 0: query } as Record<0, typeof query>;
};

export const totalDonatedQueryKey = (address: string) => ["useTotalDonated", address].filter(nonNullable);
export const useTotalDonated = (address: string) => {
  const { provider } = useWeb3Context();

  const zeroPadAddress = ethers.utils.hexZeroPad(address === "" ? ethers.utils.hexlify(0) : address, 32);
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);
  const networks = useTestableNetworks();

  const filter = {
    address: contract?.address,
    fromBlock: 1,
    toBlock: "latest",
    topics: [ethers.utils.id("Redeemed(address,uint256)"), zeroPadAddress],
  };

  const query = useQuery<string, Error>(
    totalDonatedQueryKey(address),
    async () => {
      queryAssertion(address, totalDonatedQueryKey(address));

      if (!contract) throw new Error(t`Please switch to the Ethereum network`);

      let totalRedeemed = BigNumber.from("0");

      const events = await provider.getLogs(filter);

      for (let i = 0; i < events.length; i++) {
        totalRedeemed = totalRedeemed.add(events[i].data);
      }

      const redeemableBalance = await contract.redeemableBalance(address);

      const totalDonated = totalRedeemed.add(redeemableBalance);

      return ethers.utils.formatUnits(totalDonated, "gwei");
    },
    { enabled: !!address },
  );

  return { [networks.MAINNET]: query } as Record<typeof networks.MAINNET, typeof query>;
};

export const donorNumbersQueryKey = (address: string) => ["useDonorNumbers", address].filter(nonNullable);
export const useDonorNumbers = (address: string) => {
  const { provider } = useWeb3Context();

  const isTestMode = useTestMode();
  const zeroPadAddress = ethers.utils.hexZeroPad(address === "" ? ethers.utils.hexlify(0) : address, 32);
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);
  const networks = useTestableNetworks();

  const filter = {
    address: contract?.address,
    fromBlock: 1,
    toBlock: "latest",
    topics: [ethers.utils.id("Deposited(address,address,uint256)"), null, zeroPadAddress],
  };

  const query = useQuery<number, Error>(
    donorNumbersQueryKey(address),
    async () => {
      queryAssertion(address, donorNumbersQueryKey(address));

      if (!contract) throw new Error(t`Please switch to the Ethereum network`);

      const donorAddresses: IDonorAddresses = {};
      const donationsToAddress: ethers.providers.Log[] = [];

      const events = await provider.getLogs(filter);

      for (let i = 0; i < events.length; i++) {
        const event = events[i];

        if (event.topics[2] === zeroPadAddress.toLowerCase()) {
          const donorActiveDonations: [string[], BigNumber[]] = await contract.getAllDeposits(
            ethers.utils.hexDataSlice(event.topics[1], 12),
          );

          for (let j = 0; j < donorActiveDonations[0].length; j++) {
            if (
              donorActiveDonations[0][j].toLowerCase() === address.toLowerCase() &&
              donorActiveDonations[1][j] > BigNumber.from("0") &&
              !donorAddresses[event.topics[1]]
            ) {
              donationsToAddress.push(event);
              donorAddresses[event.topics[1]] = true;
            }
          }
        }
      }

      return donationsToAddress.length;
    },
    { enabled: !!address },
  );

  return { [networks.MAINNET]: query } as Record<typeof networks.MAINNET, typeof query>;
};
