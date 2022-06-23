import { createAsyncThunk } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { OHM_ADDRESSES, SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { IERC20, OlympusStaking__factory, OlympusStakingv2__factory, StakingHelper } from "src/typechain";

import ierc20ABI from "../abi/IERC20.json";
import StakingHelperABI from "../abi/StakingHelper.json";
import { addresses } from "../constants";
import { trackGAEvent } from "../helpers/analytics/trackGAEvent";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { IChangeApprovalWithVersionAsyncThunk, IJsonRPCError, IStakeAsyncThunk } from "./interfaces";
import { error, info } from "./MessagesSlice";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string;
}

function alreadyApprovedToken(
  token: string,
  stakeAllowance: BigNumber,
  unstakeAllowance: BigNumber,
  stakeAllowanceV2: BigNumber,
  unstakeAllowanceV2: BigNumber,
  version2: boolean,
) {
  // set defaults
  const bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;
  // determine which allowance to check
  if (token === "ohm" && version2) {
    applicableAllowance = stakeAllowanceV2;
  } else if (token === "sohm" && version2) {
    applicableAllowance = unstakeAllowanceV2;
  } else if (token === "ohm") {
    applicableAllowance = stakeAllowance;
  } else if (token === "sohm") {
    applicableAllowance = unstakeAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  "stake/changeApproval",
  async ({ token, provider, address, networkID, version2 }: IChangeApprovalWithVersionAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(
      addresses[networkID].OHM_ADDRESS as string,
      ierc20ABI.abi,
      signer,
    ) as IERC20;
    const sohmContract = new ethers.Contract(
      addresses[networkID].SOHM_ADDRESS as string,
      ierc20ABI.abi,
      signer,
    ) as IERC20;
    const ohmV2Contract = new ethers.Contract(
      OHM_ADDRESSES[networkID as keyof typeof OHM_ADDRESSES] as string,
      ierc20ABI.abi,
      signer,
    ) as IERC20;
    const sohmV2Contract = new ethers.Contract(
      SOHM_ADDRESSES[networkID as keyof typeof SOHM_ADDRESSES] as string,
      ierc20ABI.abi,
      signer,
    ) as IERC20;
    let approveTx;
    let stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    let unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    let stakeAllowanceV2 = await ohmV2Contract.allowance(
      address,
      STAKING_ADDRESSES[networkID as keyof typeof STAKING_ADDRESSES],
    );
    let unstakeAllowanceV2 = await sohmV2Contract.allowance(
      address,
      STAKING_ADDRESSES[networkID as keyof typeof STAKING_ADDRESSES],
    );
    // return early if approval has already happened
    if (alreadyApprovedToken(token, stakeAllowance, unstakeAllowance, stakeAllowanceV2, unstakeAllowanceV2, version2)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          staking: {
            ohmStakeV1: +stakeAllowance,
            ohmUnstakeV1: +unstakeAllowance,
          },
        }),
      );
    }

    try {
      if (version2) {
        if (token === "ohm") {
          approveTx = await ohmV2Contract.approve(
            STAKING_ADDRESSES[networkID as keyof typeof STAKING_ADDRESSES],
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        } else if (token === "sohm") {
          approveTx = await sohmV2Contract.approve(
            STAKING_ADDRESSES[networkID as keyof typeof STAKING_ADDRESSES],
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        }
      } else {
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
      }

      const text = "Approve " + (token === "ohm" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "ohm" ? "approve_staking" : "approve_unstaking";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

        await approveTx.wait();
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    stakeAllowanceV2 = await ohmV2Contract.allowance(
      address,
      STAKING_ADDRESSES[networkID as keyof typeof STAKING_ADDRESSES],
    );
    unstakeAllowanceV2 = await sohmV2Contract.allowance(
      address,
      STAKING_ADDRESSES[networkID as keyof typeof STAKING_ADDRESSES],
    );

    return dispatch(
      fetchAccountSuccess({
        staking: {
          ohmStakeV1: +stakeAllowance,
          ohmUnstakeV1: +unstakeAllowance,
          ohmStake: +stakeAllowanceV2,
          ohmUnstake: +unstakeAllowanceV2,
        },
      }),
    );
  },
);

export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async ({ action, value, provider, address, networkID, version2, rebase }: IStakeAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();

    const staking = OlympusStaking__factory.connect(addresses[networkID].STAKING_ADDRESS, signer);

    const stakingHelper = new ethers.Contract(
      addresses[networkID].STAKING_HELPER_ADDRESS as string,
      StakingHelperABI.abi,
      signer,
    ) as StakingHelper;

    const stakingV2 = OlympusStakingv2__factory.connect(
      STAKING_ADDRESSES[networkID as keyof typeof STAKING_ADDRESSES],
      signer,
    );

    let stakeTx;
    const uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: "",
    };
    try {
      if (version2) {
        if (action === "stake") {
          uaData.type = "stake";
          // 3rd arg is rebase
          // 4th argument is claim default to true
          stakeTx = rebase
            ? await stakingV2.stake(address, ethers.utils.parseUnits(value, "gwei"), true, true)
            : await stakingV2.stake(address, ethers.utils.parseUnits(value, "gwei"), false, true);
        } else {
          uaData.type = "unstake";
          // 3rd arg is trigger default to true for mainnet and false for rinkeby
          // 4th arg is rebasing
          stakeTx = rebase
            ? await stakingV2.unstake(address, ethers.utils.parseUnits(value, "gwei"), true, true)
            : await stakingV2.unstake(address, ethers.utils.parseUnits(value, "ether"), true, false);
        }
      } else {
        if (action === "stake") {
          uaData.type = "stake";
          stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"));
        } else {
          uaData.type = "unstake";
          stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true);
        }
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
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
        trackGAEvent({
          category: "Staking",
          action: uaData.type ?? "unknown",
          label: uaData.txHash ?? "unknown",
          value: Math.round(parseFloat(uaData.value)),
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
        });
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
