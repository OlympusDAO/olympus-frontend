/* eslint-disable no-alert */
import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as StakingHelper } from "../abi/StakingHelper.json";

export const ACTIONS = { STAKE: "STAKE", UNSTAKE: "UNSTAKE" };
export const TYPES = { OLD: "OLD_SOHM", NEW: "NEW_OHM" };

export const fetchMigrateSuccess = payload => ({
  type: Actions.FETCH_MIGRATE_SUCCESS,
  payload,
});

async function calculateAPY(sohmContract, stakingReward) {
  const circSupply = await sohmContract.circulatingSupply();

  const stakingRebase = stakingReward / circSupply;
  const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3);

  return stakingAPY;
}

// This method doens't work :(
export const fetchMigrationData = (provider, networkID) => async dispatch => {
  const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS, OlympusStakingv2, provider);
  const oldStakingContract = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS, OlympusStaking, provider);

  const sohmMainContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOHMv2, provider);
  const sohmOldContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, sOHM, provider);

  // Calculating stakingAPY
  const epoch = await stakingContract.epoch();
  const newStakingReward = epoch.distribute;

  const oldStakingReward = oldStakingContract.ohmToDistributeNextEpoch();
  const newStakingAPY = calculateAPY(sohmMainContract, newStakingReward);
  const oldStakingAPY = calculateAPY(sohmOldContract, oldStakingReward);

  const dispatchData = fetchMigrateSuccess({
    migrate: {
      legacyAPY: oldStakingAPY,
      newAPY: newStakingAPY,
    },
  });

  return dispatch(dispatchData);
};

export const getApproval =
  ({ type, provider, address, networkID }) =>
  async dispatch => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = await new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, signer);
    const oldSohmContract = await new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, ierc20Abi, signer);

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

      await approveTx.wait();
    } catch (error) {
      alert(error.message);
      return;
    }

    const stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    const unstakeAllowance = await oldSohmContract.allowance(address, addresses[networkID].OLD_STAKING_ADDRESS);

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
  ({ action, value, provider, address, networkID }) =>
  async dispatch => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const oldStaking = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS, OlympusStaking, signer);
    const staking = new ethers.Contract(addresses[networkID].STAKING_HELPER_ADDRESS, StakingHelper, signer);

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

    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(address);
    const oldSohmContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, ierc20Abi, provider);
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
