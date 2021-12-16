import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as OlympusGiving } from "../abi/OlympusGiving.json";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "../slices/interfaces";

interface IUserRecipientInfo {
  totalDebt: string;
  carry: string;
  agnosticAmount: string;
  indexAtLastChange: string;
}

interface IDonorAddresses {
  [key: string]: boolean;
}

export const getRedemptionBalancesAsync = async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
  const givingContract = new ethers.Contract(addresses[networkID].GIVING_ADDRESS as string, OlympusGiving, provider);
  const redeemableBalance = await givingContract.redeemableBalance(address);

  let recipientInfo: IUserRecipientInfo = {
    totalDebt: "",
    carry: "",
    agnosticAmount: "",
    indexAtLastChange: "",
  };
  try {
    let recipientInfoData = await givingContract.recipientInfo(address);
    recipientInfo.totalDebt = ethers.utils.formatUnits(recipientInfoData.totalDebt.toNumber(), "gwei");
    recipientInfo.carry = ethers.utils.formatUnits(recipientInfoData.carry.toNumber(), "gwei");
    recipientInfo.agnosticAmount = ethers.utils.formatUnits(recipientInfoData.agnosticAmount.toNumber(), "gwei");
    recipientInfo.indexAtLastChange = ethers.utils.formatUnits(recipientInfoData.indexAtLastChange.toNumber(), "gwei");
  } catch (e: unknown) {}

  return {
    redeeming: {
      sohmRedeemable: ethers.utils.formatUnits(redeemableBalance, "gwei"),
      recipientInfo: recipientInfo,
    },
  };
};

export const getDonorNumbers = async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
  const zeroPadAddress = ethers.utils.hexZeroPad(address, 32);

  const givingContract = new ethers.Contract(addresses[networkID].GIVING_ADDRESS as string, OlympusGiving, provider);

  // creates a filter looking at all Deposited events on the YieldDirector contract
  const filter = {
    address: addresses[networkID].GIVING_ADDRESS,
    fromBlock: 1,
    toBlock: "latest",
    topics: [ethers.utils.id("Deposited(address,address,uint256)"), null, zeroPadAddress], // hash identifying Deposited event
  };

  // using the filter, get all events
  const events = await provider.getLogs(filter);

  let donorAddresses: IDonorAddresses = {};
  let donationsToAddress = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (event.topics[2] === zeroPadAddress.toLowerCase()) {
      const donorActiveDonations: [string[], BigNumber[]] = await givingContract.getAllDeposits(
        ethers.utils.hexStripZeros(event.topics[1]),
      );
      // make sure the deposit was an active donation and has not been withdrawn
      for (let j = 0; j < donorActiveDonations[0].length; j++) {
        if (
          donorActiveDonations[0][j] == address &&
          donorActiveDonations[1][j] > BigNumber.from(0) &&
          !donorAddresses[event.topics[1]]
        ) {
          donationsToAddress.push(event);
          // keep track of active donors so multiple deposits are not counted as multiple donors
          donorAddresses[event.topics[1]] = true;
        }
      }
    }
  }

  return donationsToAddress;
};
