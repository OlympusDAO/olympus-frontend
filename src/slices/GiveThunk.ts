import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusGiving } from "../abi/OlympusGiving.json";
import { abi as MockSohm } from "../abi/MockSohm.json";
import { clearPendingTxn, fetchPendingTxns, getGivingTypeText, isPendingTxn, IPendingTxn } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances, getDonationBalances } from "./AccountSlice";
import { error } from "../slices/MessagesSlice";
import {
  IActionValueRecipientAsyncThunk,
  IChangeApprovalAsyncThunk,
  IJsonRPCError,
  IBaseAddressAsyncThunk,
} from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { t } from "@lingui/macro";

interface IUAData {
  address: string;
  value: string;
  recipient: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const PENDING_TXN_GIVE = "giving";
export const PENDING_TXN_EDIT_GIVE = "editingGive";
export const PENDING_TXN_WITHDRAW = "endingGive";
export const PENDING_TXN_GIVE_APPROVAL = "approve_giving";

export const ACTION_GIVE = "give";
export const ACTION_GIVE_EDIT = "editGive";
export const ACTION_GIVE_WITHDRAW = "endGive";

export const hasPendingGiveTxn = (pendingTransactions: IPendingTxn[]): boolean => {
  return (
    isPendingTxn(pendingTransactions, PENDING_TXN_GIVE) ||
    isPendingTxn(pendingTransactions, PENDING_TXN_EDIT_GIVE) ||
    isPendingTxn(pendingTransactions, PENDING_TXN_WITHDRAW)
  );
};

// This is approving the recipient to spend, not the contract
export const changeApproval = createAsyncThunk(
  "give/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error(t`Please connect your wallet`));
      return;
    }

    const signer = provider.getSigner();
    let sohmContract;
    if (networkID === 1) {
      sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20Abi, signer);
    } else if (networkID === 4) {
      sohmContract = new ethers.Contract(addresses[networkID].MOCK_SOHM as string, MockSohm, signer);
    }
    let approveTx;
    try {
      approveTx = await sohmContract?.approve(
        addresses[networkID].GIVING_ADDRESS,
        ethers.utils.parseUnits("1000000000", "gwei").toString(),
      );
      const text = "Approve giving";
      const pendingTxnType = PENDING_TXN_GIVE_APPROVAL;
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

    let giveAllowance;
    if (networkID === 1) {
      giveAllowance = await sohmContract?.allowance(address, addresses[networkID].GIVING_ADDRESS);
    } else if (networkID === 4) {
      giveAllowance = await sohmContract?._allowedValue(address, addresses[networkID].GIVING_ADDRESS);
    }

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
      dispatch(error(t`Please connect your wallet!`));
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
      let pendingTxnType = "";
      if (action === ACTION_GIVE) {
        uaData.type = ACTION_GIVE;
        pendingTxnType = PENDING_TXN_GIVE;
        giveTx = await giving.deposit(ethers.utils.parseUnits(value, "gwei"), recipient);
      } else if (action === ACTION_GIVE_EDIT) {
        uaData.type = ACTION_GIVE_EDIT;
        pendingTxnType = PENDING_TXN_EDIT_GIVE;
        if (parseFloat(value) > 0) {
          giveTx = await giving.deposit(ethers.utils.parseUnits(value, "gwei"), recipient);
        } else if (parseFloat(value) < 0) {
          let reductionAmount = (-1 * parseFloat(value)).toString();
          giveTx = await giving.withdraw(ethers.utils.parseUnits(reductionAmount, "gwei"), recipient);
        }
      } else if (action === ACTION_GIVE_WITHDRAW) {
        uaData.type = ACTION_GIVE_WITHDRAW;
        pendingTxnType = PENDING_TXN_WITHDRAW;
        giveTx = await giving.withdraw(ethers.utils.parseUnits(value, "gwei"), recipient);
      }
      uaData.txHash = giveTx.hash;
      dispatch(fetchPendingTxns({ txnHash: giveTx.hash, text: getGivingTypeText(action), type: pendingTxnType }));
      await giveTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error(t`You may be trying to give more than your balance! Error code: 32603. Message: ds-math-sub-underflow`),
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

/*
  Put in place for anyone testing Give on testnet to easily get our mockSohm tokens
  through a button in the ohmmenu component. Does not appear on mainnet.
*/
export const getTestTokens = createAsyncThunk(
  "give/getTokens",
  async ({ provider, address, networkID }: IBaseAddressAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error(t`Please connect your wallet!`));
      return;
    }

    const signer = provider.getSigner();
    const mockSohmContract = new ethers.Contract(addresses[networkID].MOCK_SOHM as string, MockSohm, signer);
    let pendingTxnType = "drip";
    let getTx;
    try {
      getTx = await mockSohmContract.drip();
      dispatch(fetchPendingTxns({ txnHash: getTx.hash, text: "Drip", type: pendingTxnType }));
      await getTx.wait();
    } catch (e: unknown) {
      const rpcError = e as IJsonRPCError;
      dispatch(error(rpcError.message));
      return;
    } finally {
      if (getTx) {
        dispatch(clearPendingTxn(getTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
