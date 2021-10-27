import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusStreaming } from "../abi/OlympusStreaming.json";
import { clearPendingTxn, fetchPendingTxns, getStreamingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error } from "../slices/MessagesSlice";
import { IActionValueRecipientAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";

interface IUAData {
  address: string;
  value: string;
  recipient: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

// This is approving the recipient to spend, not the contract
export const changeApproval = createAsyncThunk(
  "stream/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet"));
      return;
    }

    const signer = provider.getSigner();
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20Abi, signer);
    let approveTx;
    try {
      approveTx = await sohmContract.approve(
        addresses[networkID].STREAMING_ADDRESS,
        ethers.utils.parseUnits("1000000000", "gwei").toString(),
      );
      const text = "Approve streaming";
      const pendingTxnType = "approve_streaming";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
      await approveTx.wait();
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    const streamAllowance = await sohmContract.allowance(address, addresses[networkID].STREAMING_ADDRESS);
    return dispatch(
      fetchAccountSuccess({
        streaming: {
          sohmStream: +streamAllowance,
        },
      }),
    );
  },
);

export const changeStream = createAsyncThunk(
  "stream/changeStream",
  async ({ action, value, recipient, provider, address, networkID }: IActionValueRecipientAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const streaming = new ethers.Contract(addresses[networkID].STREAMING_ADDRESS as string, OlympusStreaming, signer);
    let streamTx;

    let uaData: IUAData = {
      address: address,
      value: value,
      recipient: recipient,
      approved: true,
      txHash: null,
      type: null,
    };

    try {
      if (action === "stream") {
        uaData.type = "stream";
        streamTx = await streaming.deposit(ethers.utils.parseUnits(value, "gwei"), recipient);
      } else {
        uaData.type = "endStream";
        streamTx = await streaming.withdraw(ethers.utils.parseUnits(value, "gwei"), recipient);
      }
      const pendingTxnType = action === "stream" ? "streaming" : "endingStream";
      uaData.txHash = streamTx.hash;
      dispatch(fetchPendingTxns({ txnHash: streamTx.hash, text: getStreamingTypeText(action), type: pendingTxnType }));
      await streamTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error(
            "You may be trying to stream more than your balance! Error code: 32603. Message: ds-math-sub-underflow",
          ),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (streamTx) {
        segmentUA(uaData);

        dispatch(clearPendingTxn(streamTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
