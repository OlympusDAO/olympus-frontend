import { t } from "@lingui/macro";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import ReactGA from "react-ga";
import { IERC20, OlympusStaking__factory, OlympusStakingv2__factory, StakingHelper } from "src/typechain";

import { abi as ierc20ABI } from "../abi/IERC20.json";
import { abi as StakingHelperABI } from "../abi/StakingHelper.json";
import { addresses } from "../constants";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { error, info } from "../slices/MessagesSlice";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { IChangeApprovalWithVersionAsyncThunk, IJsonRPCError, IStakeAsyncThunk } from "./interfaces";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const TOKEN_OHM = "ohm";
export const TOKEN_SOHM = "sohm";
export const TOKEN_GOHM = "gohm";

// TODO it would be cleaner to have these as an enum, but will require changes to the interfaces
export const PENDING_TXN_STAKING_APPROVE = "approve_staking";
export const PENDING_TXN_STAKING = "staking";
export const PENDING_TXN_UNSTAKING_APPROVE = "approve_unstaking";
export const PENDING_TXN_UNSTAKING = "unstaking";
export const ACTION_UNSTAKE = "unstake";
export const ACTION_STAKE = "stake";

const SUPPORTED_TOKENS = [TOKEN_OHM, TOKEN_SOHM];
const SUPPORTED_ACTIONS = [ACTION_STAKE, ACTION_UNSTAKE];

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
  if (token === TOKEN_OHM && version2) {
    applicableAllowance = stakeAllowanceV2;
  } else if (token === TOKEN_SOHM && version2) {
    applicableAllowance = unstakeAllowanceV2;
  } else if (token === TOKEN_OHM) {
    applicableAllowance = stakeAllowance;
  } else if (token === TOKEN_SOHM) {
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
      dispatch(error(t`Please connect your wallet!`));
      return;
    }

    if (!SUPPORTED_TOKENS.includes(token)) {
      dispatch(
        error(t`The supplied token ${token} is not one of the supported tokens: ${JSON.stringify(SUPPORTED_TOKENS)}`),
      );
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20ABI, signer) as IERC20;
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20ABI, signer) as IERC20;
    const ohmV2Contract = new ethers.Contract(addresses[networkID].OHM_V2 as string, ierc20ABI, signer) as IERC20;
    const sohmV2Contract = new ethers.Contract(addresses[networkID].SOHM_V2 as string, ierc20ABI, signer) as IERC20;
    let approveTx;
    let stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    let unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    let stakeAllowanceV2 = await ohmV2Contract.allowance(address, addresses[networkID].STAKING_V2);
    let unstakeAllowanceV2 = await sohmV2Contract.allowance(address, addresses[networkID].STAKING_V2);
    // return early if approval has already happened
    if (alreadyApprovedToken(token, stakeAllowance, unstakeAllowance, stakeAllowanceV2, unstakeAllowanceV2, version2)) {
      dispatch(info(t`Approval completed`));
      return dispatch(
        fetchAccountSuccess({
          staking: {
            ohmStakeV1: +stakeAllowance,
            ohmUnstakeV1: +unstakeAllowance,
            ohmStake: +stakeAllowanceV2,
            ohmUnstake: +unstakeAllowanceV2,
            loading: false,
          },
        }),
      );
    }

    try {
      if (version2) {
        if (token === TOKEN_OHM) {
          approveTx = await ohmV2Contract.approve(
            addresses[networkID].STAKING_V2,
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        } else if (token === TOKEN_SOHM) {
          approveTx = await sohmV2Contract.approve(
            addresses[networkID].STAKING_V2,
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        }
      } else {
        if (token === TOKEN_OHM) {
          approveTx = await ohmContract.approve(
            addresses[networkID].STAKING_ADDRESS,
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        } else if (token === TOKEN_SOHM) {
          approveTx = await sohmContract.approve(
            addresses[networkID].STAKING_ADDRESS,
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        }
      }

      const text = token === TOKEN_OHM ? t`Approve Staking` : t`Approve Unstaking`;
      const pendingTxnType = token === TOKEN_OHM ? PENDING_TXN_STAKING_APPROVE : PENDING_TXN_UNSTAKING_APPROVE;
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
    stakeAllowanceV2 = await ohmV2Contract.allowance(address, addresses[networkID].STAKING_V2);
    unstakeAllowanceV2 = await sohmV2Contract.allowance(address, addresses[networkID].STAKING_V2);

    return dispatch(
      fetchAccountSuccess({
        staking: {
          ohmStakeV1: +stakeAllowance,
          ohmUnstakeV1: +unstakeAllowance,
          ohmStake: +stakeAllowanceV2,
          ohmUnstake: +unstakeAllowanceV2,
          loading: false,
        },
      }),
    );
  },
);

export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async ({ action, value, provider, address, networkID, version2, rebase }: IStakeAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error(t`Please connect your wallet!`));
      return;
    }

    if (!SUPPORTED_ACTIONS.includes(action)) {
      dispatch(
        error(
          t`The supplied action ${action} is not one of the supported actions: ${JSON.stringify(SUPPORTED_ACTIONS)}`,
        ),
      );
      return;
    }

    const signer = provider.getSigner();

    const staking = OlympusStaking__factory.connect(addresses[networkID].STAKING_ADDRESS, signer);

    const stakingHelper = new ethers.Contract(
      addresses[networkID].STAKING_HELPER_ADDRESS as string,
      StakingHelperABI,
      signer,
    ) as StakingHelper;

    const stakingV2 = OlympusStakingv2__factory.connect(addresses[networkID].STAKING_V2, signer);

    let stakeTx;
    const uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (version2) {
        const rebasing = true; // when true stake into sOHM
        if (action === ACTION_STAKE) {
          uaData.type = ACTION_STAKE;
          // 3rd arg is rebase
          // 4th argument is claim default to true
          stakeTx = rebase
            ? await stakingV2.stake(address, ethers.utils.parseUnits(value, "gwei"), true, true)
            : await stakingV2.stake(address, ethers.utils.parseUnits(value, "gwei"), false, true);
        } else {
          uaData.type = ACTION_UNSTAKE;
          // 3rd arg is trigger default to true for mainnet and false for rinkeby
          // 4th arg is rebasing
          stakeTx = rebase
            ? await stakingV2.unstake(address, ethers.utils.parseUnits(value, "gwei"), true, true)
            : await stakingV2.unstake(address, ethers.utils.parseUnits(value, "ether"), true, false);
        }
      } else {
        if (action === ACTION_STAKE) {
          uaData.type = ACTION_STAKE;
          stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"));
        } else {
          uaData.type = ACTION_UNSTAKE;
          stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true);
        }
      }
      const pendingTxnType = action === ACTION_STAKE ? PENDING_TXN_STAKING : PENDING_TXN_UNSTAKING;
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error(
            t`You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow`,
          ),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (stakeTx) {
        segmentUA(uaData);
        ReactGA.event({
          category: "Staking",
          action: uaData.type ?? "unknown",
          label: uaData.txHash ?? "unknown",
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
          metric1: parseFloat(uaData.value),
        });
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
