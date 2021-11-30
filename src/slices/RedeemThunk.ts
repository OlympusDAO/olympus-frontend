import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusGiving } from "../abi/OlympusGiving.json";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances, getRedemptionBalances } from "./AccountSlice";
import { error } from "../slices/MessagesSlice";
import { IBaseAddressAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const redeemBalance = createAsyncThunk(
  "redeem/redeemBalance",
  async ({ provider, address, networkID }: IBaseAddressAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please conenect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const giving = new ethers.Contract(addresses[networkID].GIVING_ADDRESS as string, OlympusGiving, signer);
    const redeemableBalance = await giving.redeemableBalance(address);
    let redeemTx;

    let uaData: IUAData = {
      address: address,
      value: redeemableBalance,
      approved: true,
      txHash: null,
      type: null,
    };

    try {
      uaData.type = "redeem";
      redeemTx = await giving.redeem();
      const pendingTxnType = "redeeming";
      uaData.txHash = redeemTx.hash;
      dispatch(fetchPendingTxns({ txnHash: redeemTx.hash, text: "Redeeming sOHM", type: pendingTxnType }));
      await redeemTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.message.indexOf("No redeemable balance") >= 0) {
        dispatch(error("You have no redeemable balance"));
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (redeemTx) {
        segmentUA(uaData);

        dispatch(clearPendingTxn(redeemTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
    dispatch(getRedemptionBalances({ address, networkID, provider }));
  },
);
