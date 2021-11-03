import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusGiving } from "../abi/OlympusGiving.json";
import { clearPendingTxn, fetchPendingTxns, getGivingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances, getDonationBalances } from "./AccountSlice";
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
  "give/changeApproval",
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
        addresses[networkID].GIVING_ADDRESS,
        ethers.utils.parseUnits("1000000000", "gwei").toString(),
      );
      const text = "Approve giving";
      const pendingTxnType = "approve_giving";
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

    const giveAllowance = await sohmContract.allowance(address, addresses[networkID].GIVING_ADDRESS);
    return dispatch(
      fetchAccountSuccess({
        giving: {
          sohmGive: +giveAllowance,
        },
      }),
    );
  },
);

export const changeGive = createAsyncThunk(
  "give/changeGive",
  async ({ action, value, recipient, provider, address, networkID }: IActionValueRecipientAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const giving = new ethers.Contract(addresses[networkID].GIVING_ADDRESS as string, OlympusGiving, signer);
    let giveTx;

    let uaData: IUAData = {
      address: address,
      value: value,
      recipient: recipient,
      approved: true,
      txHash: null,
      type: null,
    };

    try {
      if (action === "give") {
        uaData.type = "give";
        giveTx = await giving.deposit(ethers.utils.parseUnits(value, "gwei"), recipient);
      } else if (action === "editGive") {
        uaData.type = "editGive";
        if (parseFloat(value) > 0) {
          giveTx = await giving.deposit(ethers.utils.parseUnits(value, "gwei"), recipient);
        } else if (parseFloat(value) < 0) {
          let reductionAmount = (-1 * parseFloat(value)).toString();
          giveTx = await giving.withdraw(ethers.utils.parseUnits(reductionAmount, "gwei"), recipient);
        }
      } else if (action === "endGive") {
        uaData.type = "endGive";
        giveTx = await giving.withdraw(ethers.utils.parseUnits(value, "gwei"), recipient);
      }
      const pendingTxnType = action === "give" ? "giving" : "editGive" ? "editingGive" : "endingGive";
      uaData.txHash = giveTx.hash;
      dispatch(fetchPendingTxns({ txnHash: giveTx.hash, text: getGivingTypeText(action), type: pendingTxnType }));
      await giveTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to give more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (giveTx) {
        segmentUA(uaData);

        dispatch(clearPendingTxn(giveTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
    dispatch(getDonationBalances({ address, networkID, provider }));
  },
);
