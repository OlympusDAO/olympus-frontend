import { ethers } from "ethers";
import { addresses, Actions } from "../../constants";
import { abi as ierc20Abi } from "../../abi/IERC20.json";
import { abi as OlympusStaking } from "../../abi/OlympusStakingv2.json";
import { abi as StakingHelper } from "../../abi/StakingHelper.json";
import { setAll } from "../../helpers";


import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
};

export const changeApproval = createAsyncThunk(
  "stake/changeApproval",
  async ({ token, provider, address, networkID }) => {
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
          addresses[networkID].STAKING_HELPER_ADDRESS,
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

    const stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    const unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    return {
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
      },
    };
  },
);

export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async ({ action, value, provider, address, networkID }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(addresses[networkID].STAKING_ADDRESS, OlympusStaking, signer);
    const stakingHelper = await new ethers.Contract(addresses[networkID].STAKING_HELPER_ADDRESS, StakingHelper, signer);

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

    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(address);

    return {
      ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
      sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
    };
  },
);

const stakeSlice = createSlice({
  name: "stake",
  initialState,
  reducers: {
    fetchStakeSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(changeApproval.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(changeApproval.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = "idle";
      })
      .addCase(changeStake.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(changeStake.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = "idle";
      });
  },
});

export default stakeSlice.reducer;

export const { fetchStakeSuccess } = stakeSlice.actions;

const baseInfo = state => state.stake;

export const getAppState = createSelector(baseInfo, stake => stake);
