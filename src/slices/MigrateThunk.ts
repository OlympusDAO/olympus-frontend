import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as StakingHelper } from "../abi/StakingHelper.json";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { IERC20, SOlympus } from "../typechain";
import { toNum } from "src/helpers";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess } from "./AccountSlice";
import store from "src/store";

interface IGetApproval {
  readonly type: string;
  readonly provider: StaticJsonRpcProvider | undefined;
  readonly address: string;
  readonly networkID: number;
}

interface IChangeStake {
  readonly action: string;
  readonly value: string;
  readonly provider: StaticJsonRpcProvider | undefined;
  readonly address: string;
  readonly networkID: number;
}

interface IMigrateDetails {
  readonly migrate?: { stakeAllowance: number; unstakeAllowance: number };
  readonly balances?: { ohm: string; sohm: string; oldsohm: string };
}

export const ACTIONS = { STAKE: "STAKE", UNSTAKE: "UNSTAKE" };
export const TYPES = { OLD: "OLD_SOHM", NEW: "NEW_OHM" };

// TS-REFACTOR-TODO: unused function
export const calculateAPY = createAsyncThunk(
  "migrate/calculateAPY",
  async ({ sohmContract, stakingReward }: { sohmContract: SOlympus; stakingReward: number }) => {
    const circSupply = toNum(await sohmContract.circulatingSupply());

    const stakingRebase = stakingReward / circSupply;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3);

    return stakingAPY;
  },
);

export const getApproval = createAsyncThunk(
  "migrate/getApproval",
  async ({ type, provider, address, networkID }: IGetApproval, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, signer) as IERC20;
    const oldSohmContract = new ethers.Contract(
      addresses[networkID].OLD_SOHM_ADDRESS as string,
      ierc20Abi,
      signer,
    ) as IERC20;

    let approveTx;
    try {
      if (type === TYPES.OLD) {
        approveTx = await oldSohmContract.approve(
          addresses[networkID].OLD_STAKING_ADDRESS as string,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else {
        // type === TYPES.NEW
        approveTx = await ohmContract.approve(
          addresses[networkID].STAKING_HELPER_ADDRESS as string,
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
    } catch (error) {
      alert(error.message);
      return;
    } finally {
      if (approveTx) {
        clearPendingTxn(approveTx.hash);
      }
    }

    const unstakeAllowance = await oldSohmContract.allowance(
      address,
      addresses[networkID].OLD_STAKING_ADDRESS as string,
    );
    const state = store.getState();
    return dispatch(
      fetchAccountSuccess({
        balances: state.account.data ? state.account.data.balances : {},
        migrate: {
          unstakeAllowance,
        },
        staking: state.account.data ? state.account.data.staking : { ohmStake: 0, ohmUnstake: 0 },
      }),
    );
  },
);

export const changeStake = createAsyncThunk(
  "migrate/changeStake",
  async ({ action, value, provider, address, networkID }: IChangeStake) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const oldStaking = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS as string, OlympusStaking, signer); // TS-REFACTOR-NOTE: no unstakeOHM function from types
    const staking = new ethers.Contract(addresses[networkID].STAKING_HELPER_ADDRESS as string, StakingHelper, signer); // TS-REFACTOR-NOTE: staking contract expects 3 args

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
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
        return;
      }
      alert(error.message);
      return;
    } finally {
      if (stakeTx) {
        clearPendingTxn(stakeTx.hash);
      }
    }

    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider) as SOlympus;
    const sohmBalance = await sohmContract.balanceOf(address);
    const oldSohmContract = new ethers.Contract(
      addresses[networkID].OLD_SOHM_ADDRESS as string,
      sOHM,
      provider,
    ) as SOlympus;
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
