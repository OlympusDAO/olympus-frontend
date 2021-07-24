/* eslint-disable no-alert */
import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as StakingHelper } from "../abi/StakingHelper.json";
import { Dispatch } from "redux";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { IERC20, IStakingHelper, SOlympus } from "../typechain";

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

export const ACTIONS = { STAKE: "STAKE", UNSTAKE: "UNSTAKE" };
export const TYPES = { OLD: "OLD_SOHM", NEW: "NEW_OHM" };

interface IMigrateDetails {
  readonly migrate?: { stakeAllowance: number; unstakeAllowance: number };
  readonly balances?: { ohm: string; sohm: string; oldsohm: string };
}

export const fetchMigrateSuccess = (payload: IMigrateDetails) => ({
  type: Actions.FETCH_MIGRATE_SUCCESS,
  payload,
});

async function calculateAPY(sohmContract: SOlympus, stakingReward: number) {
  const circSupply = (await sohmContract.circulatingSupply()) as unknown as number;

  const stakingRebase = stakingReward / circSupply;
  const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3);

  return stakingAPY;
}

export const getApproval =
  ({ type, provider, address, networkID }: IGetApproval) =>
  async (dispatch: Dispatch) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    // TS-REFACTOR-TODO: await not necessary
    const ohmContract = (await new ethers.Contract(
      addresses[networkID].OHM_ADDRESS as string,
      ierc20Abi,
      signer,
    )) as IERC20;
    const oldSohmContract = (await new ethers.Contract(
      addresses[networkID].OLD_SOHM_ADDRESS as string,
      ierc20Abi,
      signer,
    )) as IERC20;

    let approveTx: ethers.ContractTransaction | null;
    try {
      if (type === TYPES.OLD) {
        approveTx = await oldSohmContract.approve(
          addresses[networkID].OLD_STAKING_ADDRESS as string,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (type === TYPES.NEW) {
        approveTx = await ohmContract.approve(
          addresses[networkID].STAKING_HELPER_ADDRESS as string,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }

      await approveTx!.wait(); // TS-REFACTOR-TODO: can possibly be null
    } catch (error) {
      alert(error.message);
      return;
    }

    const stakeAllowance = (await ohmContract.allowance(
      address,
      addresses[networkID].STAKING_HELPER_ADDRESS as string,
    )) as unknown as number;
    const unstakeAllowance = (await oldSohmContract.allowance(
      address,
      addresses[networkID].OLD_STAKING_ADDRESS as string,
    )) as unknown as number;

    return dispatch(
      fetchMigrateSuccess({
        migrate: {
          stakeAllowance,
          unstakeAllowance,
        },
      }),
    );
  };

export const changeStake =
  ({ action, value, provider, address, networkID }: IChangeStake) =>
  async (dispatch: Dispatch) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const oldStaking = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS as string, OlympusStaking, signer); // TS-REFACTOR-TODO: no unstakeOHM function from types
    const staking = new ethers.Contract(addresses[networkID].STAKING_HELPER_ADDRESS as string, StakingHelper, signer); // TS-REFACTOR-TODO: staking contract expects 3 args

    let stakeTx;

    try {
      if (action === ACTIONS.STAKE) {
        stakeTx = await staking.stake(ethers.utils.parseUnits(value, "gwei"));
        await stakeTx.wait();
      } else if (action === ACTIONS.UNSTAKE) {
        stakeTx = await oldStaking.unstakeOHM(ethers.utils.parseUnits(value, "gwei"));
        await stakeTx.wait();
      }
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
        return;
      }
      alert(error.message);
      return;
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

    return dispatch(
      fetchMigrateSuccess({
        balances: {
          ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
          sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
          oldsohm: ethers.utils.formatUnits(oldsohmBalance, "gwei"),
        },
      }),
    );
  };
