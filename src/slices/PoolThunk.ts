import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { RootState } from "src/store";
import { AwardAbi2, PrizePoolAbi, PrizePoolAbi2, SOHM } from "src/typechain";

import { abi as AwardPool } from "../abi/33-together/AwardAbi2.json";
import { abi as PrizePool } from "../abi/33-together/PrizePoolAbi2.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { addresses } from "../constants";
import { setAll } from "../helpers";
import { getCreditMaturationDaysAndLimitPercentage } from "../helpers/33Together";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import {
  IActionAsyncThunk,
  IActionValueAsyncThunk,
  IBaseAsyncThunk,
  IChangeApprovalAsyncThunk,
  IJsonRPCError,
  IValueAsyncThunk,
} from "./interfaces";
import { error, info } from "./MessagesSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";

export const getPoolValues = createAsyncThunk(
  "pool/getPoolValues",
  async ({ networkID, provider }: IBaseAsyncThunk) => {
    // calculate 33-together
    const poolReader = new ethers.Contract(
      addresses[networkID].PT_PRIZE_POOL_ADDRESS,
      PrizePool,
      provider,
    ) as PrizePoolAbi;
    const poolAwardBalance = await poolReader.callStatic.captureAwardBalance();
    const creditPlanOf = await poolReader.creditPlanOf(addresses[networkID].PT_TOKEN_ADDRESS);
    const poolCredit = getCreditMaturationDaysAndLimitPercentage(
      creditPlanOf.creditRateMantissa,
      creditPlanOf.creditLimitMantissa,
    );

    const awardReader = new ethers.Contract(
      addresses[networkID].PT_PRIZE_STRATEGY_ADDRESS,
      AwardPool,
      provider,
    ) as AwardAbi2;
    const poolAwardPeriodRemainingSeconds = await awardReader.prizePeriodRemainingSeconds();

    return {
      awardBalance: ethers.utils.formatUnits(poolAwardBalance, "gwei"),
      awardPeriodRemainingSeconds: poolAwardPeriodRemainingSeconds.toString(),
      creditMaturationInDays: poolCredit[0],
      creditLimitPercentage: poolCredit[1],
    };
  },
);

export const getRNGStatus = createAsyncThunk("pool/getRNGStatus", async ({ networkID, provider }: IBaseAsyncThunk) => {
  const awardReader = new ethers.Contract(
    addresses[networkID].PT_PRIZE_STRATEGY_ADDRESS,
    AwardPool,
    provider,
  ) as AwardAbi2;
  const isRngRequested = await awardReader.isRngRequested();
  let isRngTimedOut = false;
  if (isRngRequested) isRngTimedOut = await awardReader.isRngTimedOut();

  return {
    isRngRequested: isRngRequested,
    isRngTimedOut: isRngTimedOut,
    rngRequestCompleted: Date.now(),
  };
});

export const changeApproval = createAsyncThunk(
  "pool/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, signer) as SOHM;

    let approveTx;
    let depositAllowance = await sohmContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);

    // return early if approval already exists
    if (depositAllowance.gt(BigNumber.from("0"))) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          pooling: {
            sohmPool: +depositAllowance,
          },
        }),
      );
    }

    try {
      if (token === "sohm") {
        approveTx = await sohmContract.approve(
          addresses[networkID].PT_PRIZE_POOL_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );

        const text = "Approve Pool Deposit";
        const pendingTxnType = "approve_pool_together";
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

    // go get fresh allowance
    depositAllowance = await sohmContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        pooling: {
          sohmPool: +depositAllowance,
        },
      }),
    );
  },
);

// NOTE (appleseed): https://docs.pooltogether.com/protocol/prize-pool#depositing
export const poolDeposit = createAsyncThunk(
  "pool/deposit",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const signer = provider.getSigner();
    const poolContract = new ethers.Contract(
      addresses[networkID].PT_PRIZE_POOL_ADDRESS,
      PrizePool,
      signer,
    ) as PrizePoolAbi;
    let poolTx;
    const uaData = {
      address: address,
      value: value,
      type: "33t Deposit",
      approved: false,
      txHash: "",
    };
    try {
      if (action === "deposit") {
        poolTx = await poolContract.depositTo(
          address,
          ethers.utils.parseUnits(value, "gwei"),
          addresses[networkID].PT_TOKEN_ADDRESS,
          "0x0000000000000000000000000000000000000000", // referral address
        );
        const text = "Pool " + action;
        const pendingTxnType = "pool_deposit";
        dispatch(fetchPendingTxns({ txnHash: poolTx.hash, text: text, type: pendingTxnType }));
        await poolTx.wait();
      } else {
        console.log("unrecognized action: ", action);
      }
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
      if (poolTx) {
        uaData.txHash = poolTx.hash;
        uaData.approved = true;
        segmentUA(uaData);
        dispatch(clearPendingTxn(poolTx.hash));
      }
    }

    dispatch(getBalances({ address, networkID, provider }));
  },
);

export interface IEarlyExitFeePayload {
  readonly withdraw: {
    earlyExitFee: [ethers.BigNumber, ethers.BigNumber] & {
      exitFee: ethers.BigNumber;
      burnedCredit: ethers.BigNumber;
    };
    stringExitFee: string;
    credit: ethers.BigNumber;
  };
}

export const getEarlyExitFee = createAsyncThunk(
  "pool/getEarlyExitFee",
  async ({ value, provider, address, networkID }: IValueAsyncThunk) => {
    const poolReader = new ethers.Contract(
      addresses[networkID].PT_PRIZE_POOL_ADDRESS,
      PrizePool,
      provider,
    ) as PrizePoolAbi;
    // NOTE (appleseed): we chain callStatic in the below function to force the transaction through w/o a gas fee
    // ... this may be a result of `calculateEarlyExitFee` not being explicity declared as `view` or `pure` in the contract.
    // Explanation from ethers docs: https://docs.ethers.io/v5/api/contract/contract/#contract-callStatic
    //
    // `callStatic` would be equivalent to `call` in web3js: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-call
    //
    // PoolTogether actually uses a custom implementation of a MultiCall using web3js to batch two calls together:
    // https://github.com/pooltogether/etherplex/blob/9cf1b94e8879c08c7951d1308c14712aaaa5cec7/src/MulticallContract.ts#L33
    //
    const earlyExitFee = await poolReader.callStatic.calculateEarlyExitFee(
      address,
      addresses[networkID].PT_TOKEN_ADDRESS,
      ethers.utils.parseUnits(value, "gwei"),
    );
    // NOTE (appleseed): poolTogether calcs this credit, but it's not used...
    const credit = await poolReader.callStatic.balanceOfCredit(address, addresses[networkID].PT_TOKEN_ADDRESS);

    return {
      withdraw: {
        earlyExitFee: earlyExitFee,
        stringExitFee: ethers.utils.formatUnits(earlyExitFee.exitFee, "gwei"),
        credit: credit,
      },
    };
  },
);

// NOTE (appleseed): https://docs.pooltogether.com/protocol/prize-pool#withdraw-instantly
export const poolWithdraw = createAsyncThunk(
  "pool/withdraw",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const poolContract = new ethers.Contract(
      addresses[networkID].PT_PRIZE_POOL_ADDRESS,
      PrizePool,
      signer,
    ) as PrizePoolAbi2;

    let poolTx;
    const uaData = {
      address: address,
      value: value,
      type: "Withdraw",
      earlyExitFee: "",
      approved: false,
      txHash: "",
    };
    try {
      if (action === "withdraw") {
        const earlyExitFee = await dispatch(getEarlyExitFee({ value, provider, address, networkID }));
        poolTx = await poolContract.withdrawInstantlyFrom(
          address,
          ethers.utils.parseUnits(value, "gwei"),
          addresses[networkID].PT_TOKEN_ADDRESS,
          (earlyExitFee.payload as any).withdraw.earlyExitFee.exitFee, // maximum exit fee
          // TS-REFACTOR-TODO: set the payload type above once we've added typechain in.
        );
        uaData.earlyExitFee = (earlyExitFee.payload as any).withdraw.stringExitFee;
        uaData.txHash = poolTx.hash;
        const text = "Pool " + action;
        const pendingTxnType = "pool_withdraw";
        dispatch(fetchPendingTxns({ txnHash: poolTx.hash, text: text, type: pendingTxnType }));
        await poolTx.wait();
      } else {
        console.log("unrecognized action: ", action);
      }
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
      if (poolTx) {
        dispatch(clearPendingTxn(poolTx.hash));
      }
    }
    uaData.approved = true;
    segmentUA(uaData);
    dispatch(getBalances({ address, networkID, provider }));
  },
);

export const awardProcess = createAsyncThunk(
  "pool/awardProcess",
  async ({ action, provider, address, networkID }: IActionAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const poolContract = new ethers.Contract(
      addresses[networkID].PT_PRIZE_STRATEGY_ADDRESS,
      AwardPool,
      signer,
    ) as AwardAbi2;

    let poolTx;

    try {
      if (action === "startAward") {
        poolTx = await poolContract.startAward();
      } else if (action === "completeAward") {
        poolTx = await poolContract.completeAward();
      } else if (action === "cancelAward") {
        poolTx = await poolContract.cancelAward();
      } else {
        console.log("unrecognized action: ", action);
      }
      const text = "Pool " + action;
      const pendingTxnType = "pool_" + action;
      const txnHash: string = poolTx ? poolTx.hash : "";
      dispatch(fetchPendingTxns({ txnHash, text: text, type: pendingTxnType }));
      await poolTx?.wait();
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
      if (poolTx) {
        dispatch(clearPendingTxn(poolTx.hash));
      }
    }

    dispatch(getBalances({ address, networkID, provider }));
  },
);

const initialState = {
  loading: false,
  isRngRequested: false,
  isRngTimedOut: false,
  rngRequestCompleted: false,
  creditMaturationInDays: 0,
  creditLimitPercentage: 0,
  awardPeriodRemainingSeconds: 0,
  awardBalance: 0,
};

const poolTogetherSlice = createSlice({
  name: "poolData",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getPoolValues.pending, state => {
        state.loading = true;
      })
      .addCase(getPoolValues.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getPoolValues.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getRNGStatus.pending, state => {
        state.loading = true;
      })
      .addCase(getRNGStatus.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getRNGStatus.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default poolTogetherSlice.reducer;

const baseInfo = (state: RootState) => state.poolData;

export const getPoolState = createSelector(baseInfo, app => app);
