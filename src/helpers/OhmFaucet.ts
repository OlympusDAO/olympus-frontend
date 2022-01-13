import { addresses, NetworkId } from "src/constants";
import { IBaseAddressAsyncThunk } from "src/slices/interfaces";
import { error, info } from "../slices/MessagesSlice";
import { OhmFaucet__factory } from "src/typechain";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getOhm = createAsyncThunk(
  "ohmFaucet",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet in order to use the OHM faucet!"));
      return;
    }

    // If not on a testnet, abort
    if (networkID !== NetworkId.Localhost) {
      dispatch(error("Cannot use the OHM faucet on this network."));
      return;
    }

    // If the faucet contract doesn't exist, abort
    if (!addresses[networkID].OHM_FAUCET || !addresses[networkID].OHM_FAUCET.trim().length) {
      dispatch(error("OHM_FAUCET contract is not defined for chain ID " + networkID + ". Aborting."));
      return;
    }

    const signer = provider.getSigner();
    const faucetContract = OhmFaucet__factory.connect(addresses[networkID].OHM_FAUCET, signer);

    await faucetContract.dispense();
    dispatch(info("OHM deposited into your wallet!"));

    return;
  },
);
