import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusGiving } from "../abi/OlympusGiving.json";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances, getRedemptionBalances, getMockRedemptionBalances } from "./AccountSlice";
import { error } from "../slices/MessagesSlice";
import { IBaseAddressAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { t } from "@lingui/macro";

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
      dispatch(error(t`Please conenect your wallet!`));
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
        dispatch(error(t`You have no yield that can be redeemed.`));
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

export const redeemMockBalance = createAsyncThunk(
  "redeem/redeemMockBalance",
  async ({ provider, address, networkID }: IBaseAddressAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error(t`Please connect your wallet!`));
      return;
    }

    if (!addresses[networkID] || !addresses[networkID].MOCK_GIVING_ADDRESS) {
      dispatch(error(t`Please switch to testnet!`));
      return;
    }

    const signer = provider.getSigner();
    const giving = new ethers.Contract(addresses[networkID].MOCK_GIVING_ADDRESS as string, OlympusGiving, signer);
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
        dispatch(error(t`You have no yield that can be redeemed.`));
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
    dispatch(getMockRedemptionBalances({ address, networkID, provider }));
  },
);
