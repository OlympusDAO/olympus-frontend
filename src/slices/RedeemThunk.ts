import { t } from "@lingui/macro";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";

import { abi as OlympusGiving } from "../abi/OlympusGiving.json";
import { addresses } from "../constants";
import { trackGAEvent } from "../helpers/analytics";
import { getGiveProjectName } from "../helpers/GiveProjectNameHelper";
import { getBalances, getMockRedemptionBalances, getRedemptionBalances } from "./AccountSlice";
import { IJsonRPCError, IRedeemAsyncThunk } from "./interfaces";
import { error } from "./MessagesSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string;
}

const trackGiveEvent = (uaData: IUAData, eventAction?: string) => {
  trackGAEvent({
    category: "Olympus Give",
    action: eventAction ? eventAction : uaData.type ? uaData.type : "unknown",
    label: getGiveProjectName(uaData.address) ?? "unknown",
    value: Math.round(parseFloat(uaData.value)),
    metric1: parseFloat(uaData.value),
    dimension1: uaData.txHash ?? "unknown",
    dimension2: uaData.address,
  });
};

// Redeems a user's redeemable balance from the Give contract
export const redeemBalance = createAsyncThunk(
  "redeem/redeemBalance",
  async ({ provider, address, networkID }: IRedeemAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error(t`Please connect your wallet!`));
      return;
    }

    const signer = provider.getSigner();
    const giving = new ethers.Contract(addresses[networkID].GIVING_ADDRESS as string, OlympusGiving, signer);
    const redeemableBalance = await giving.redeemableBalance(address);
    let redeemTx;

    const uaData: IUAData = {
      address: address,
      value: redeemableBalance,
      approved: true,
      txHash: null,
      type: "redeem",
    };

    // Before we submit the transaction, record the event.
    // This lets us track if the user rejects/ignores the confirmation dialog.
    trackGiveEvent(uaData, uaData.type + "-before");

    try {
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
        trackGiveEvent(uaData);

        dispatch(clearPendingTxn(redeemTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
    dispatch(getRedemptionBalances({ address, networkID, provider }));
  },
);

// Redeem a user's redeemable balance from the MockGive contract on Rinkeby
export const redeemMockBalance = createAsyncThunk(
  "redeem/redeemMockBalance",
  async ({ provider, address, networkID }: IRedeemAsyncThunk, { dispatch }) => {
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

    const uaData: IUAData = {
      address: address,
      value: redeemableBalance,
      approved: true,
      txHash: null,
      type: "redeem",
    };

    // Before we submit the transaction, record the event.
    // This lets us track if the user rejects/ignores the confirmation dialog.
    trackGiveEvent(uaData, uaData.type + "-before");

    try {
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
        trackGiveEvent(uaData);

        dispatch(clearPendingTxn(redeemTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
    dispatch(getMockRedemptionBalances({ address, networkID, provider }));
  },
);
