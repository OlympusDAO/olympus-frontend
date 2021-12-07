import { ethers } from "ethers";
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
