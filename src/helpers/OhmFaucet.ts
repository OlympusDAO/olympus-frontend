import { addresses, NetworkId } from "src/constants";
import { IBaseAddressAsyncThunk, IJsonRPCError } from "src/slices/interfaces";
import { error, info } from "../slices/MessagesSlice";
import { OhmFaucet__factory } from "src/typechain";
import { useDispatch } from "react-redux";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearPendingTxn, fetchPendingTxns } from "src/slices/PendingTxnsSlice";

export const FAUCET_PENDING_TEXT = "Pending";
export const FAUCET_PENDING_TYPE = "faucet_dispense";

// TODO replace with dispatch
export const getOhm = createAsyncThunk(
  "ohmFaucet",
  async ({ address, provider, networkID }: IBaseAddressAsyncThunk, { dispatch }) => {
    if (!provider) {
      console.error("Please connect your wallet in order to use the OHM faucet!");
      return;
    }

    // If not on a testnet, abort
    if (networkID !== NetworkId.Localhost) {
      console.error("Cannot use the OHM faucet on this network.");
      return;
    }

    // If the faucet contract doesn't exist, abort
    if (!addresses[networkID].OHM_FAUCET || !addresses[networkID].OHM_FAUCET.trim().length) {
      console.error("OHM_FAUCET contract is not defined for chain ID " + networkID + ". Aborting.");
      return;
    }

    const signer = provider.getSigner();
    const faucetContract = OhmFaucet__factory.connect(addresses[networkID].OHM_FAUCET, signer);

    let dispenseTx;
    try {
      dispenseTx = await faucetContract.dispense();

      // Record that we have a pending transaction, so the interface can reflect it
      dispatch(fetchPendingTxns({ txnHash: dispenseTx.hash, text: FAUCET_PENDING_TEXT, type: FAUCET_PENDING_TYPE }));
      await dispenseTx.wait();
      console.info("OHM deposited into your wallet!");
    } catch (e: unknown) {
      const rpcError = e as IJsonRPCError;
      dispatch(error(rpcError.message));
    } finally {
      // Clears the "pending" state
      if (dispenseTx) dispatch(clearPendingTxn(dispenseTx.hash));
    }
  },
);
