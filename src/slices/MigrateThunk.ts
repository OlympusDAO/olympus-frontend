import { createAsyncThunk } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { addresses } from "src/constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { IERC20 } from "src/typechain";
import { IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { fetchAccountSuccess, getMigrationAllowances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";

export const changeMigrationApproval = createAsyncThunk(
  "migrate/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20ABI, signer) as IERC20;
    const sOhmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20ABI, signer) as IERC20;
    const wsOhmContract = new ethers.Contract(
      addresses[networkID].WSOHM_ADDRESS as string,
      ierc20ABI,
      signer,
    ) as IERC20;

    let migrateAllowance = BigNumber.from("0");
    const bigZero = BigNumber.from("0");

    if (token === "ohm") {
      migrateAllowance = await ohmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
    } else if (token === "sohm") {
      migrateAllowance = await sOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
    } else if (token === "wsohm") {
      migrateAllowance = await wsOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
    }

    // return early if approval has already happened
    if (migrateAllowance.gt(bigZero)) {
      dispatch(info("Approval completed."));
      dispatch(getMigrationAllowances({ address, provider, networkID }));
    }

    let approveTx;
    try {
      if (token === "ohm") {
        // won't run if stakeAllowance > 0
        approveTx = await ohmContract.approve(
          addresses[networkID].MIGRATOR_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (token === "sohm") {
        approveTx = await sOhmContract.approve(
          addresses[networkID].MIGRATOR_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (token === "wsohm") {
        approveTx = await wsOhmContract.approve(
          addresses[networkID].MIGRATOR_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }

      const text = `Approve ${token} Migration`;
      const pendingTxnType = `approve_${token}_migration`;
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    dispatch(getMigrationAllowances({ address, provider, networkID }));
  },
);
