import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusStaking } from "../abi/OlympusStakingv2.json";
import { abi as StakingHelper } from "../abi/StakingHelper.json";
import { Dispatch } from "redux";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { IERC20, IStakingHelper, OlympusStaking as OlympusStakingType } from "../typechain";

interface IStakeDetails {
  readonly ohm?: string;
  readonly sohm?: string;
  readonly staking?: { ohmStake: number; ohmUnstake: number };
}

interface IChangeApproval {
  readonly token: string;
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

export const fetchStakeSuccess = (payload: IStakeDetails) => ({
  type: Actions.FETCH_STAKE_SUCCESS,
  payload,
});

export const changeApproval =
  ({ token, provider, address, networkID }: IChangeApproval) =>
  async (dispatch: Dispatch) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, signer) as IERC20;
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20Abi, signer) as IERC20;

    let approveTx: ethers.ContractTransaction | null;
    try {
      if (token === "ohm") {
        approveTx = await ohmContract.approve(
          addresses[networkID].STAKING_HELPER_ADDRESS as string,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else {
        // token === "sohm"
        approveTx = await sohmContract.approve(
          addresses[networkID].STAKING_ADDRESS as string,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }

      await approveTx.wait();
    } catch (error) {
      alert(error.message);
      return;
    }

    const stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS as string);
    const unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS as string);
    return dispatch(
      fetchStakeSuccess({
        staking: {
          ohmStake: +stakeAllowance,
          ohmUnstake: +unstakeAllowance,
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
    // TS-REFACTOR: types arg accepted mismatch
    const staking = new ethers.Contract(addresses[networkID].STAKING_ADDRESS as string, OlympusStaking, signer);
    const stakingHelper = new ethers.Contract(
      addresses[networkID].STAKING_HELPER_ADDRESS as string,
      StakingHelper,
      signer,
    );

    let stakeTx;

    try {
      if (action === "stake") {
        stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"));
        await stakeTx.wait();
      } else {
        stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true);
        await stakeTx.wait();
      }
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else {
        alert(error.message);
      }
      return;
    }

    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(
      addresses[networkID].SOHM_ADDRESS as string,
      ierc20Abi,
      provider,
    ) as IERC20;
    const sohmBalance = await sohmContract.balanceOf(address);

    return dispatch(
      fetchStakeSuccess({
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
      }),
    );
  };
