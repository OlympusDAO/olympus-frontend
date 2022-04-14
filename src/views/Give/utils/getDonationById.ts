import { t } from "@lingui/macro";
import { ethers } from "ethers";
import { abi as OlympusGiving } from "src/abi/OlympusGiving.json";
import { GIVE_ADDRESSES } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";

export interface IDonation {
  id: string;
  depositor: string;
  sohmAmount: string;
  gohmAmount: string;
}

export const getDonationById = async (
  id: string,
  networkId: NetworkId,
  provider: ethers.providers.StaticJsonRpcProvider | ethers.providers.JsonRpcProvider,
) => {
  const signer = provider.getSigner();
  const contract = await new ethers.Contract(
    GIVE_ADDRESSES[networkId as keyof typeof GIVE_ADDRESSES],
    OlympusGiving,
    signer,
  );

  const donation: IDonation = {
    id: "-1",
    depositor: "",
    sohmAmount: "0",
    gohmAmount: "0",
  };

  // If there's no contract (i.e. on a non-ETH network), throw error
  if (!contract)
    throw new Error(
      t`Give is not supported on this network. Please switch to a supported network, such as Ethereum mainnet`,
    );

  let deposit;
  try {
    deposit = await contract.depositInfo(id);

    donation.id = deposit.id.toString();
    donation.depositor = deposit.depositor;
    donation.sohmAmount = ethers.utils.formatUnits(deposit.principalAmount, 9);
    donation.gohmAmount = ethers.utils.formatEther(deposit.agnosticAmount);
  } catch (e: unknown) {
    // These will only revert if the user has not initiated any deposits yet
    console.log("You have not deposited to anyone yet.");
  }

  // Return donationInfo array as the data attribute
  return donation;
};
