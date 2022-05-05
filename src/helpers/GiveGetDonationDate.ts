import { BigNumber, ethers } from "ethers";
import { GIVE_ADDRESSES } from "src/constants/addresses";

import { IBaseAddressRecipientAsyncThunk } from "../slices/interfaces";

/**
 * Gets the date of the first time a user donated to a specific recipient
 * @param address Current user's address
 * @param recipient The donation target of the current user
 * @param networkID ID number of the network the user is currently connected to
 * @param provider Network provider object
 * @returns String representation of the date as Month Abbreviation DD, YYYY
 *          i.e. Feb 13, 2022
 */
export const GetFirstDonationDate = async ({
  address,
  recipient,
  networkID,
  provider,
}: IBaseAddressRecipientAsyncThunk) => {
  if (!GIVE_ADDRESSES[networkID as keyof typeof GIVE_ADDRESSES]) {
    console.log("No giving contract on chain ID " + networkID);
    return "";
  }

  // Addresses in EVM events are zero padded out to 32 characters and are lower case
  // This matches our inputs with the data we expect to receive from Ethereum
  const zeroPadAddress = ethers.utils.hexZeroPad(address.toLowerCase(), 32);
  const zeroPadRecipientAddress = ethers.utils.hexZeroPad(recipient.toLowerCase(), 32);

  // Creates an event filter to look at all events from the first block ever to the current block
  // and identify events that match the Deposited hash with our user and recipient
  const filter = {
    address: GIVE_ADDRESSES[networkID as keyof typeof GIVE_ADDRESSES],
    fromBlock: 1,
    toBlock: "latest",
    topics: [ethers.utils.id("Deposited(address,address,uint256)"), zeroPadAddress, zeroPadRecipientAddress], // hash identifying Deposited event
  };

  // using the filter, get all events
  const events = await provider.getLogs(filter);

  // Check that there are any events
  if (events.length === 0) {
    return "";
  }

  let firstDonation = events[0];

  for (let i = 0; i < events.length; i++) {
    // Selects the first event that does not have a deposit of 0. This is the first
    // donation that is still currently active
    if (BigNumber.from(events[i].data).gt("0")) firstDonation = events[i];
  }

  // Convert the block number of the event to a Unix timestamp
  const timestamp = (await provider.getBlock(firstDonation.blockNumber)).timestamp;

  // Converts Unix timestamp into a Datetime and then into a readable string
  const date = new Date(timestamp * 1000);

  const dateString = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return dateString;
};
