import { createAsyncThunk } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { addresses } from "src/constants";
import { IERC20, IERC20__factory } from "src/typechain";
import {
  IActionValueAsyncThunk,
  IBaseAddressAsyncThunk,
  IChangeApprovalWithDisplayNameAsyncThunk,
  IJsonRPCError,
  IValueAsyncThunk,
} from "./interfaces";
import { fetchAccountSuccess, getBalances, getMigrationAllowances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { OlympusTokenMigrator__factory } from "src/typechain";
import { GOHM__factory } from "src/typechain/factories/GOHM__factory";
import { NetworkID } from "src/lib/Bond";

enum TokenType {
  UNSTAKED,
  STAKED,
  WRAPPED,
}

const chooseContract = (token: string, networkID: NetworkID, signer: ethers.providers.JsonRpcSigner): IERC20 => {
  let address: string;
  if (token === "ohm") {
    address = addresses[networkID].OHM_ADDRESS;
  } else if (token === "sohm") {
    address = addresses[networkID].SOHM_ADDRESS;
  } else if (token === "wsohm") {
    address = addresses[networkID].WSOHM_ADDRESS;
  } else if (token === "gohm") {
    address = addresses[networkID].GOHM_ADDRESS;
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
    { token, provider, address, networkID, displayName }: IChangeApprovalWithDisplayNameAsyncThunk,
    { dispatch },
  ) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const tokenContract = chooseContract(token, networkID, signer);

    let migrateAllowance = BigNumber.from("0");
    let currentBalance = BigNumber.from("0");

    migrateAllowance = await tokenContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
    currentBalance = await tokenContract.balanceOf(address);

    // return early if approval has already happened
    if (migrateAllowance.gt(currentBalance)) {
      dispatch(info("Approval completed."));
      dispatch(getMigrationAllowances({ address, provider, networkID }));
    }

    let approveTx: ethers.ContractTransaction | undefined;
    try {
      approveTx = await tokenContract.approve(
        addresses[networkID].MIGRATOR_ADDRESS,
        ethers.utils.parseUnits("1000000000", "gwei").toString(),
      );

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
        dispatch(getMigrationAllowances({ address, provider, networkID }));
      }
    }

    // go get fresh allowances
  },
);

interface IMigrationWithType extends IActionValueAsyncThunk {
  type: TokenType;
}

export const bridgeBack = createAsyncThunk(
  "migrate/bridgeBack",
  async ({ provider, address, networkID, value }: IValueAsyncThunk, { dispatch }) => {
    const signer = provider.getSigner();
    const migrator = OlympusTokenMigrator__factory.connect(addresses[networkID].MIGRATOR_ADDRESS, signer);
    // console.log(provider);

    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    let unMigrateTx: ethers.ContractTransaction | undefined;

    try {
      unMigrateTx = await migrator.bridgeBack(ethers.utils.parseUnits(value, "ether"), TokenType.STAKED);
      const text = `Bridge Back gOHM`;
      const pendingTxnType = `unmigrate_gohm`;

      dispatch(fetchPendingTxns({ txnHash: unMigrateTx.hash, text, type: pendingTxnType }));
      await unMigrateTx.wait();
      dispatch(info("Successfully unwrapped gOHM!"));
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
    } finally {
      if (unMigrateTx) {
        dispatch(clearPendingTxn(unMigrateTx.hash));
        dispatch(getBalances({ address, provider, networkID }));
      }
    }
    // go get fresh balances
    // dispatch(fetchAccountSuccess({ isMigrationComplete: true }));
  },
);

export const migrateWithType = createAsyncThunk(
  "migrate/migrateWithType",
  async ({ provider, address, networkID, type, value, action }: IMigrationWithType, { dispatch }) => {
    const signer = provider.getSigner();
    const migrator = OlympusTokenMigrator__factory.connect(addresses[networkID].MIGRATOR_ADDRESS, signer);
    // console.log(provider);
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    let migrateTx: ethers.ContractTransaction | undefined;
    try {
      migrateTx = await migrator.migrate(ethers.utils.parseUnits(value, "gwei"), TokenType.STAKED, TokenType.WRAPPED);
      const text = `Migrate ${TokenType[type]} Tokens`;
      const pendingTxnType = `migrate_${type}`;

      dispatch(fetchPendingTxns({ txnHash: migrateTx.hash, text, type: pendingTxnType }));
      await migrateTx.wait();
      dispatch(info(action));
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
    } finally {
      if (migrateTx) {
        dispatch(clearPendingTxn(migrateTx.hash));
      }
    }
    // go get fresh balances
    dispatch(getBalances({ address, provider, networkID }));
    // dispatch(fetchAccountSuccess({ isMigrationComplete: true }));
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
