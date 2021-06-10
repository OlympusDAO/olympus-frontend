import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OHMPreSale } from "../abi/OHMPreSale.json";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as MigrateToOHM } from "../abi/MigrateToOHM.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as LPStaking } from "../abi/LPStaking.json";
import { abi as DistributorContract } from "../abi/DistributorContract.json";
import { abi as BondContract } from "../abi/BondContract.json";
import { abi as DaiBondContract } from "../abi/DaiBondContract.json";

export const fetchStakeSuccess = payload => ({
  type: Actions.FETCH_STAKE_SUCCESS,
  payload,
});

export const changeApproval =
  ({ token, provider, address, networkID }) =>
  async dispatch => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = await new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, signer);
    const sohmContract = await new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, signer);

    let approveTx;
    try {
      if (token === "ohm") {
        approveTx = await ohmContract.approve(
          addresses[networkID].STAKING_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (token === "sohm") {
        approveTx = await sohmContract.approve(
          addresses[networkID].STAKING_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }

      await approveTx.wait();
    } catch (error) {
      alert(error.message);
      return;
    }

    const stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    const unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    return dispatch(
      fetchStakeSuccess({
        staking: {
          ohmStake: stakeAllowance,
          ohmUnstake: unstakeAllowance,
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
    const staking = await new ethers.Contract(addresses[networkID].STAKING_ADDRESS, OlympusStaking, signer);

    let stakeTx;

    try {
      if (action === "stake") {
        stakeTx = await staking.stakeOHM(ethers.utils.parseUnits(value, "gwei"));
        await stakeTx.wait();
      } else {
        stakeTx = await staking.unstakeOHM(ethers.utils.parseUnits(value, "gwei"));
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

    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(address);

    return dispatch(
      fetchStakeSuccess({
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
      }),
    );
  };
