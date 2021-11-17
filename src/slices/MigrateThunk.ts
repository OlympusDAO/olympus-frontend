import { createAsyncThunk } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { addresses } from "src/constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { IERC20, IERC20__factory } from "src/typechain";
import {
  IBaseAddressAsyncThunk,
  IChangeApprovalAsyncThunk,
  IChangeApprovalWithDisplayNameAsyncThunk,
  IJsonRPCError,
} from "./interfaces";
import { fetchAccountSuccess, getMigrationAllowances, loadAccountDetails } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { OlympusTokenMigrator__factory } from "src/typechain";

enum TokenType {
  UNSTAKED,
  STAKED,
  WRAPPED,
}

export const changeMigrationApproval = createAsyncThunk(
  "migrate/changeApproval",
  async (
    { token, provider, address, networkID, displayName }: IChangeApprovalWithDisplayNameAsyncThunk,
    { dispatch },
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = IERC20__factory.connect(addresses[networkID].OHM_ADDRESS, signer);
    const sOhmContract = IERC20__factory.connect(addresses[networkID].SOHM_ADDRESS, signer);
    const wsOhmContract = IERC20__factory.connect(addresses[networkID].WSOHM_ADDRESS, signer);

    let migrateAllowance = BigNumber.from("0");
    let currentBalance = BigNumber.from("0");

    if (token === "ohm") {
      migrateAllowance = await ohmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      currentBalance = await ohmContract.balanceOf(address);
    } else if (token === "sohm") {
      migrateAllowance = await sOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      currentBalance = await sOhmContract.balanceOf(address);
    } else if (token === "wsohm") {
      migrateAllowance = await wsOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      currentBalance = await wsOhmContract.balanceOf(address);
    }

    // return early if approval has already happened
    if (migrateAllowance.gt(currentBalance)) {
      dispatch(info("Approval completed."));
      dispatch(getMigrationAllowances({ address, provider, networkID }));
    }

    let approveTx: ethers.ContractTransaction | undefined;
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
      } else {
        console.error(`Invalid token: ${token}`);
        return;
      }

      const text = `Approve ${token} Migration`;
      const pendingTxnType = `approve_migration`;

      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
      await approveTx.wait();
      dispatch(info(`${displayName} Approval complete`));
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

export const migrateAll = createAsyncThunk(
  "migrate/migrateAll",
  async ({ provider, address, networkID }: IBaseAddressAsyncThunk, { dispatch }) => {
    const signer = provider.getSigner();
    const migrator = OlympusTokenMigrator__factory.connect(addresses[networkID].MIGRATOR_ADDRESS, signer);
    // console.log(provider);

    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    let migrateAllTx: ethers.ContractTransaction | undefined;

    try {
      migrateAllTx = await migrator.migrateAll(TokenType.WRAPPED);
      const text = `Migrate All Tokens`;
      const pendingTxnType = `migrate_all`;

      dispatch(fetchPendingTxns({ txnHash: migrateAllTx.hash, text, type: pendingTxnType }));
      await migrateAllTx.wait();
      dispatch(info("All assets have been successfully migrated!"));
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
    } finally {
      if (migrateAllTx) {
        dispatch(clearPendingTxn(migrateAllTx.hash));
      }
    }
    // go get fresh balances
    // dispatch(loadAccountDetails({ address, provider, networkID }));
    dispatch(fetchAccountSuccess({ isMigrationComplete: true }));
  },
);
