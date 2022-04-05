import { createAsyncThunk } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { addresses, NetworkId } from "src/constants";
import { GOHM_ADDRESSES, MIGRATOR_ADDRESSES } from "src/constants/addresses";
import { IERC20, IERC20__factory } from "src/typechain";
import { OlympusTokenMigrator__factory } from "src/typechain";

import { error, info } from "../slices/MessagesSlice";
import { fetchAccountSuccess, getBalances, getMigrationAllowances } from "./AccountSlice";
import {
  IChangeApprovalWithDisplayNameAsyncThunk,
  IJsonRPCError,
  IMigrateAsyncThunk,
  IMigrateSingleAsyncThunk,
  IValueAsyncThunk,
} from "./interfaces";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";

export enum TokenType {
  UNSTAKED,
  STAKED,
  WRAPPED,
}

const chooseContract = (token: string, networkID: NetworkId, signer: ethers.providers.JsonRpcSigner): IERC20 => {
  let address: string;
  if (token === "ohm") {
    address = addresses[networkID].OHM_ADDRESS;
  } else if (token === "sohm") {
    address = addresses[networkID].SOHM_ADDRESS;
  } else if (token === "wsohm") {
    address = addresses[networkID].WSOHM_ADDRESS;
  } else if (token === "gohm") {
    address = GOHM_ADDRESSES[networkID as keyof typeof GOHM_ADDRESSES];
  } else {
    const message = `Invalid token type: ${token}`;
    console.error(message);
    throw Error(message);
  }
  return IERC20__factory.connect(address, signer);
};

export const changeMigrationApproval = createAsyncThunk(
  "migrate/changeApproval",
  async (
    { token, provider, address, networkID, displayName, insertName }: IChangeApprovalWithDisplayNameAsyncThunk,
    { dispatch },
  ) => {
    // NOTE (Appleseed): what is `insertName`??? it looks like it's always true???
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const signer = provider.getSigner();
    const tokenContract = chooseContract(token, networkID, signer);

    let migrateAllowance = BigNumber.from("0");
    let currentBalance = BigNumber.from("0");
    migrateAllowance = await tokenContract.allowance(
      address,
      MIGRATOR_ADDRESSES[networkID as keyof typeof MIGRATOR_ADDRESSES],
    );
    currentBalance = await tokenContract.balanceOf(address);

    // return early if approval has already happened
    if (migrateAllowance.gt(currentBalance)) {
      dispatch(info("Approval completed."));
      dispatch(getMigrationAllowances({ address, provider, networkID }));
      return;
    }
    let approveTx: ethers.ContractTransaction | undefined;
    try {
      approveTx = await tokenContract.approve(
        MIGRATOR_ADDRESSES[networkID as keyof typeof MIGRATOR_ADDRESSES],
        ethers.utils.parseUnits("1000000000", token === "wsohm" || token === "gohm" ? "ether" : "gwei").toString(),
      );

      const text = `Approve ${displayName} Migration`;
      const pendingTxnType = insertName ? `approve_migration_${token}` : "approve_migration";

      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
      await approveTx.wait();
      dispatch(info(`${displayName} Approval complete`));
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      dispatch(getMigrationAllowances({ address, provider, networkID }));
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
  },
);

export const bridgeBack = createAsyncThunk(
  "migrate/bridgeBack",
  async ({ provider, address, networkID, value }: IValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const migrator = OlympusTokenMigrator__factory.connect(
      MIGRATOR_ADDRESSES[networkID as keyof typeof MIGRATOR_ADDRESSES],
      signer,
    );

    let unMigrateTx: ethers.ContractTransaction | undefined;

    try {
      unMigrateTx = await migrator.bridgeBack(ethers.utils.parseUnits(value, "ether"), TokenType.STAKED);
      const text = `Bridge Back gOHM`;
      const pendingTxnType = `migrate`;

      if (unMigrateTx) {
        dispatch(fetchPendingTxns({ txnHash: unMigrateTx.hash, text, type: pendingTxnType }));
        await unMigrateTx.wait();
        dispatch(info("Successfully unwrapped gOHM!"));
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
    } finally {
      dispatch(getBalances({ address, provider, networkID }));
      if (unMigrateTx) {
        dispatch(clearPendingTxn(unMigrateTx.hash));
      }
    }
    // go get fresh balances
    // dispatch(fetchAccountSuccess({ isMigrationComplete: true }));
  },
);

export const migrateSingle = createAsyncThunk(
  "migrate/migrateSingle",
  async ({ provider, address, networkID, type, amount, gOHM }: IMigrateSingleAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const migrator = OlympusTokenMigrator__factory.connect(
      MIGRATOR_ADDRESSES[networkID as keyof typeof MIGRATOR_ADDRESSES],
      signer,
    );

    let migrateTx: ethers.ContractTransaction | undefined;
    try {
      migrateTx = await migrator.migrate(
        ethers.utils.parseUnits(amount, type === TokenType.WRAPPED ? "ether" : "gwei"),
        type,
        gOHM ? TokenType.WRAPPED : TokenType.STAKED,
      );
      const text = `Migrate ${type} Tokens`;
      const pendingTxnType = `migrate_${type}_tokens`;

      if (migrateTx) {
        dispatch(fetchPendingTxns({ txnHash: migrateTx.hash, text, type: pendingTxnType }));
        await migrateTx.wait();
        dispatch(info(`Successfully migrated ${TokenType[type]}`));
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
    } finally {
      dispatch(getBalances({ address, provider, networkID }));
      if (migrateTx) {
        dispatch(clearPendingTxn(migrateTx.hash));
      }
    }
  },
);

export const migrateAll = createAsyncThunk(
  "migrate/migrateAll",
  async ({ provider, address, networkID, gOHM }: IMigrateAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const migrator = OlympusTokenMigrator__factory.connect(
      MIGRATOR_ADDRESSES[networkID as keyof typeof MIGRATOR_ADDRESSES],
      signer,
    );

    let migrateAllTx: ethers.ContractTransaction | undefined;

    try {
      migrateAllTx = await migrator.migrateAll(gOHM ? TokenType.WRAPPED : TokenType.STAKED);
      const text = `Migrate All Tokens`;
      const pendingTxnType = `migrate_all`;

      if (migrateAllTx) {
        dispatch(fetchPendingTxns({ txnHash: migrateAllTx.hash, text, type: pendingTxnType }));
        await migrateAllTx.wait();
        dispatch(info("All assets have been successfully migrated!"));
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      throw e;
    } finally {
      dispatch(getBalances({ address, provider, networkID }));
      dispatch(fetchAccountSuccess({ isMigrationComplete: true }));
      if (migrateAllTx) {
        dispatch(clearPendingTxn(migrateAllTx.hash));
      }
    }
  },
);
