import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as OlympusGiving } from "../abi/OlympusGiving.json";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBaseAddressRecipientAsyncThunk } from "../slices/interfaces";

export const GetDonationDate = async ({ address, recipient, networkID, provider }: IBaseAddressRecipientAsyncThunk) => {
  const zeroPadAddress = ethers.utils.hexZeroPad(address.toLowerCase(), 32);
  const zeroPadRecipientAddress = ethers.utils.hexZeroPad(recipient.toLowerCase(), 32);

  const filter = {
    address: addresses[networkID].GIVING_ADDRESS,
    fromBlock: 1,
    toBlock: "latest",
    topics: [ethers.utils.id("Deposited(address,address,uint256)"), zeroPadAddress, zeroPadRecipientAddress], // hash identifying Deposited event
  };

  // using the filter, get all events
  const events = await provider.getLogs(filter);

  if (events.length > 0) {
    const firstDonation = events[0];
    const timestamp = (await provider.getBlock(firstDonation.blockNumber)).timestamp;
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
