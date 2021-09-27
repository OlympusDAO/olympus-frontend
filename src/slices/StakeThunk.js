import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusStaking } from "../abi/OlympusStakingv2.json";
import { abi as StakingHelper } from "../abi/StakingHelper.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error } from "../slices/MessagesSlice";

export const changeApproval = createAsyncThunk(
  "stake/changeApproval",
  async ({ token, provider, address, networkID }, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
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
      const text = "Approve " + (token === "ohm" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "ohm" ? "approve_staking" : "approve_unstaking";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

      await approveTx.wait();
    } catch (e) {
      dispatch(error(e.message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    const stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    const unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    return dispatch(
      fetchAccountSuccess({
        staking: {
          ohmStake: +stakeAllowance,
          ohmUnstake: +unstakeAllowance,
        },
      }),
    );
  },
);

export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async ({ action, value, provider, address, networkID }, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const staking = await new ethers.Contract(addresses[networkID].STAKING_ADDRESS, OlympusStaking, signer);
    const stakingHelper = await new ethers.Contract(addresses[networkID].STAKING_HELPER_ADDRESS, StakingHelper, signer);

    let stakeTx;

    try {
      if (action === "stake") {
        stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"));
      } else {
        stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true);
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e) {
      if (e.code === -32603 && e.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(e.message));
      }
      return;
    } finally {
      if (stakeTx) {
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    return dispatch(getBalances({ address, networkID, provider }));
  },
);
