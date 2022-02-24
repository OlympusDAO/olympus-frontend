import { createAsyncThunk } from "@reduxjs/toolkit";
import { OHM_FAUCET } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";
import { IBaseAddressAsyncThunk, IJsonRPCError } from "src/slices/interfaces";
import { clearPendingTxn, fetchPendingTxns } from "src/slices/PendingTxnsSlice";
import { OhmFaucet__factory } from "src/typechain";

import { error, info } from "../slices/MessagesSlice";

export const FAUCET_PENDING_TEXT = "Pending";
export const FAUCET_PENDING_TYPE = "faucet_dispense";

export const hasOhmFaucet = (networkId: NetworkId): boolean => {
  const contractAddress = OHM_FAUCET[networkId as keyof typeof OHM_FAUCET];

  if (!contractAddress || !contractAddress.trim().length) return false;

  return true;
};

// TODO replace with dispatch
export const getOhm = createAsyncThunk(
  "ohmFaucet",
  async ({ address, provider, networkID }: IBaseAddressAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet in order to use the OHM faucet!"));
      return;
    }

    // If the faucet contract doesn't exist, abort
    if (!hasOhmFaucet(networkID)) {
      dispatch(error("OHM_FAUCET contract is not defined for chain ID " + networkID + ". Aborting."));
      return;
    }

    const contractAddress = OHM_FAUCET[networkID as keyof typeof OHM_FAUCET];
    const signer = provider.getSigner();
    const faucetContract = OhmFaucet__factory.connect(contractAddress, signer);

    let dispenseTx;
    try {
      dispenseTx = await faucetContract.dispense();

      // Record that we have a pending transaction, so the interface can reflect it
      dispatch(fetchPendingTxns({ txnHash: dispenseTx.hash, text: FAUCET_PENDING_TEXT, type: FAUCET_PENDING_TYPE }));
      await dispenseTx.wait();
      dispatch(info("OHM deposited into your wallet!"));
    } catch (e: unknown) {
      const rpcError = e as IJsonRPCError;
      dispatch(error(rpcError.message));
    } finally {
      // Clears the "pending" state
      if (dispenseTx) dispatch(clearPendingTxn(dispenseTx.hash));
    }
  },
);
