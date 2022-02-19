import { ethers } from "ethers";

import { addresses } from "../constants";
import { IBaseAddressRecipientAsyncThunk } from "../slices/interfaces";

export const GetDonationDate = async ({ address, recipient, networkID, provider }: IBaseAddressRecipientAsyncThunk) => {
  // Addresses in EVM events are zero padded out to 32 characters and are lower case
  // This matches our inputs with the data we expect to receive from Ethereum
  const zeroPadAddress = ethers.utils.hexZeroPad(address.toLowerCase(), 32);
  const zeroPadRecipientAddress = ethers.utils.hexZeroPad(recipient.toLowerCase(), 32);

  // Creates an event filter to look at all events from the first block ever to the current block
  // and identify events that match the Deposited hash with our user and recipient
  const filter = {
    address: addresses[networkID].GIVING_ADDRESS,
    fromBlock: 1,
    toBlock: "latest",
    topics: [ethers.utils.id("Deposited(address,address,uint256)"), zeroPadAddress, zeroPadRecipientAddress], // hash identifying Deposited event
  };

  // using the filter, get all events
  const events = await provider.getLogs(filter);

  // Check that there are any events
  if (events.length > 0) {
    const firstDonation = events[0];

    // Convert the block number of the event to a Unix timestamp
    const timestamp = (await provider.getBlock(firstDonation.blockNumber)).timestamp;

    // Converts Unix timestamp into a Datetime and then into a readable string
    const date = new Date(timestamp * 1000);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    const dateString = month + " " + day + ", " + year;

    return dateString;
  }

  return "";
};
