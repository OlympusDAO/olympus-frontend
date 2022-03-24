import { t } from "@lingui/macro";
import { BigNumber, ethers } from "ethers";
import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { GIVE_ADDRESSES } from "src/constants/addresses";
import { GetDonationDate } from "src/helpers/GetDonationDate";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";
import { IUserDonationInfo } from "src/views/Give/Interfaces";

import { useWeb3Context } from ".";
import { useDynamicGiveContract } from "./useContract";
import { useTestableNetworks } from "./useTestableNetworks";

interface IDonorAddresses {
  [key: string]: boolean;
}

interface IUserRecipientInfo {
  totalDebt: string;
  carry: string;
  agnosticDebt: string;
  indexAtLastChange: string;
}

export const donationInfoQueryKey = (address: string, networkId: NetworkId) =>
  ["useDonationInfo", address, networkId].filter(nonNullable);
export const useDonationInfo = () => {
  const { address, provider, networkId } = useWeb3Context();
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);
  const networks = useTestableNetworks();

  const query = useQuery<IUserDonationInfo[] | null, Error>(
    donationInfoQueryKey(address, networkId),
    async () => {
      queryAssertion([address, networkId], donationInfoQueryKey(address, networkId));

      const donationInfo: IUserDonationInfo[] = [];

      if (!contract) return donationInfo;

      const allDeposits: [string[], BigNumber[]] = await contract.getAllDeposits(address);
      for (let i = 0; i < allDeposits[0].length; i++) {
        if (allDeposits[1][i].eq(0)) continue;

        const firstDonationDatePromise = GetDonationDate({
          address: address,
          recipient: allDeposits[0][i],
          networkID: networks.MAINNET,
          provider,
        });
        const yieldSentPromise = contract.donatedTo(address, allDeposits[0][i]);

        const [firstDonationDate, yieldSent]: [string, BigNumber] = await Promise.all([
          firstDonationDatePromise,
          yieldSentPromise,
        ]);

        const formattedYieldSent = ethers.utils.formatUnits(yieldSent, "gwei");

        donationInfo.push({
          date: firstDonationDate,
          deposit: ethers.utils.formatUnits(allDeposits[1][i], "gwei"),
          recipient: allDeposits[0][i],
          yieldDonated: formattedYieldSent,
        });
      }

      return donationInfo;
    },
    { enabled: !!address },
  );

  return query as typeof query;
};

export const redeemableBalanceQueryKey = (address: string, networkId: NetworkId) =>
  ["useRedeemableBalance", address, networkId].filter(nonNullable);
export const useRedeemableBalance = (address: string) => {
  const { networkId } = useWeb3Context();
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);
  const networks = useTestableNetworks();

  const query = useQuery<string, Error>(
    redeemableBalanceQueryKey(address, networkId),
    async () => {
      queryAssertion([address, networkId], redeemableBalanceQueryKey(address, networkId));

      if (!contract) throw new Error(t`Please switch to the Ethereum network`);

      const redeemableBalance = await contract.redeemableBalance(address);
      return ethers.utils.formatUnits(redeemableBalance, "gwei");
    },
    { enabled: !!address },
  );

  return query as typeof query;
};

export const recipientInfoQueryKey = (address: string, networkId: NetworkId) =>
  ["useRecipientInfo", address, networkId].filter(nonNullable);
export const useRecipientInfo = (address: string) => {
  const { networkId } = useWeb3Context();
  const contract = useDynamicGiveContract(GIVE_ADDRESSES, true);
  const networks = useTestableNetworks();

  const query = useQuery<IUserRecipientInfo, Error>(
    recipientInfoQueryKey(address, networkId),
    async () => {
      queryAssertion([address, networkId], recipientInfoQueryKey(address, networkId));

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

      return recipientInfo;
    },
    { enabled: !!address },
  );

  return query as typeof query;
};

export const totalDonatedQueryKey = (address: string, networkId: NetworkId) =>
  ["useTotalDonated", address, networkId].filter(nonNullable);
export const useTotalDonated = (address: string) => {
  const { provider, networkId } = useWeb3Context();

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
    totalDonatedQueryKey(address, networkId),
    async () => {
      queryAssertion([address, networkId], totalDonatedQueryKey(address, networkId));

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

  return query as typeof query;
};

export const donorNumbersQueryKey = (address: string, networkId: NetworkId) =>
  ["useDonorNumbers", address, networkId].filter(nonNullable);
export const useDonorNumbers = (address: string) => {
  const { provider, networkId } = useWeb3Context();

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
    donorNumbersQueryKey(address, networkId),
    async () => {
      queryAssertion([address, networkId], donorNumbersQueryKey(address, networkId));

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

  return query as typeof query;
};
