import { Contract, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as StakingHelper } from "../abi/StakingHelper.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess } from "./AccountSlice";
import { error } from "../slices/MessagesSlice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { IJsonRPCError } from "./interfaces";

export const ACTIONS = { STAKE: "STAKE", UNSTAKE: "UNSTAKE" };
export const TYPES = { OLD: "OLD_SOHM", NEW: "NEW_OHM" };

interface ICalculateAPY {
  sohmContract: Contract;
  stakingReward: number;
}

export const calculateAPY = createAsyncThunk(
  "migrate/calculateAPY",
  async ({ sohmContract, stakingReward }: ICalculateAPY) => {
    const circSupply = await sohmContract.circulatingSupply();

    const stakingRebase = stakingReward / circSupply;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3);

    return stakingAPY;
  },
);

interface IGetApproval {
  type: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: number;
}

export const getApproval = createAsyncThunk(
  "migrate/getApproval",
  async ({ type, provider, address, networkID }: IGetApproval, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, signer);
    const oldSohmContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS as string, ierc20Abi, signer);

    let approveTx;
    try {
      if (type === TYPES.OLD) {
        approveTx = await oldSohmContract.approve(
          addresses[networkID].OLD_STAKING_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (type === TYPES.NEW) {
        approveTx = await ohmContract.approve(
          addresses[networkID].STAKING_HELPER_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }
      const text = "Approve " + (type === TYPES.OLD ? "Unstaking" : "Staking");
      const pendingTxnType = type === TYPES.OLD ? "approve_migrate_unstaking" : "approve_migrate_staking";

      fetchPendingTxns({
        txnHash: approveTx.hash,
        text,
        type: pendingTxnType,
      }),
        await approveTx.wait();
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        clearPendingTxn(approveTx.hash);
      }
    }

    const stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    const unstakeAllowance = await oldSohmContract.allowance(address, addresses[networkID].OLD_STAKING_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        migrate: {
          stakeAllowance,
          unstakeAllowance,
        },
      }),
    );
  },
);

interface IChangeState {
  action: string;
  value: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: number;
}

export const changeStake = createAsyncThunk(
  "migrate/changeStake",
  async ({ action, value, provider, address, networkID }: IChangeState, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const oldStaking = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS as string, OlympusStaking, signer);
    const staking = new ethers.Contract(addresses[networkID].STAKING_HELPER_ADDRESS as string, StakingHelper, signer);

    let stakeTx;

    try {
      if (action === ACTIONS.STAKE) {
        stakeTx = await staking.stake(ethers.utils.parseUnits(value, "gwei"));
      } else if (action === ACTIONS.UNSTAKE) {
        stakeTx = await oldStaking.unstakeOHM(ethers.utils.parseUnits(value, "gwei"));
      }
      const pendingTxnType = action === ACTIONS.STAKE ? "migrate_staking" : "migrate_unstaking";
      fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType });
      await stakeTx.wait();
    } catch (e: unknown) {
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (stakeTx) {
        clearPendingTxn(stakeTx.hash);
      }
    }

    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider);
    const sohmBalance = await sohmContract.balanceOf(address);
    const oldSohmContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS as string, sOHM, provider);
    const oldsohmBalance = await oldSohmContract.balanceOf(address);

    return {
      balances: {
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        oldsohm: ethers.utils.formatUnits(oldsohmBalance, "gwei"),
      },
    };
  },
);
