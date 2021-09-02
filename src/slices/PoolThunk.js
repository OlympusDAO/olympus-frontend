import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as PrizePool } from "../abi/33-together/PrizePoolAbi2.json";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";

export const fetchPoolSuccess = payload => ({
  type: Actions.FETCH_POOL_SUCCESS,
  payload,
});

export const changeApproval = createAsyncThunk(
  "pool/changeApproval",
  async ({ token, provider, address, networkID }, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const sohmContract = await new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, signer);

    let approveTx;
    try {
      if (token === "sohm") {
        approveTx = await sohmContract.approve(
          addresses[networkID].POOL_TOGETHER.PRIZE_POOL_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );

        const text = "Approve Pool Deposit";
        const pendingTxnType = "approve_pool_together";
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
      } else {
        console.log("token not sohm", token);
      }
    } catch (error) {
      alert(error.message);
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    const depositAllowance = await sohmContract.allowance(
      address,
      addresses[networkID].POOL_TOGETHER.PRIZE_POOL_ADDRESS,
    );

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
// TODO (appleseed): what are referral rewards? ^^^, left as zero-address
export const poolDeposit = createAsyncThunk(
  "pool/deposit",
  async ({ action, value, provider, address, networkID }, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }
    const signer = provider.getSigner();
    const poolContract = await new ethers.Contract(
      addresses[networkID].POOL_TOGETHER.PRIZE_POOL_ADDRESS,
      PrizePool,
      signer,
    );
    let poolTx;

    try {
      if (action === "deposit") {
        poolTx = await poolContract.depositTo(
          address,
          ethers.utils.parseUnits(value, "gwei"),
          addresses[networkID].POOL_TOGETHER.POOL_TOKEN_ADDRESS,
          "0x0000000000000000000000000000000000000000", // referral address
        );
        const text = "Pool " + action;
        const pendingTxnType = "pool_deposit";
        dispatch(fetchPendingTxns({ txnHash: poolTx.hash, text: text, type: pendingTxnType }));
        await poolTx.wait();
      } else {
        console.log("unrecognized action: ", action);
      }
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else {
        alert(error.message);
      }
      return;
    } finally {
      if (poolTx) {
        dispatch(clearPendingTxn(poolTx.hash));
      }
    }

    return dispatch(getBalances({ address, networkID, provider }));
  },
);

export const getEarlyExitFee = createAsyncThunk(
  "pool/getEarlyExitFee",
  async ({ value, provider, address, networkID }) => {
    const poolReader = new ethers.Contract(addresses[networkID].POOL_TOGETHER.PRIZE_POOL_ADDRESS, PrizePool, provider);
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
      addresses[networkID].POOL_TOGETHER.POOL_TOKEN_ADDRESS,
      ethers.utils.parseUnits(value, "gwei"),
    );
    // NOTE (appleseed): poolTogether calcs this credit, but it's not used...
    const credit = await poolReader.callStatic.balanceOfCredit(
      address,
      addresses[networkID].POOL_TOGETHER.POOL_TOKEN_ADDRESS,
    );

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
  async ({ action, value, provider, address, networkID }, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const poolContract = await new ethers.Contract(
      addresses[networkID].POOL_TOGETHER.PRIZE_POOL_ADDRESS,
      PrizePool,
      signer,
    );

    let poolTx;

    try {
      if (action === "withdraw") {
        const earlyExitFee = await dispatch(getEarlyExitFee({ value, provider, address, networkID }));

        poolTx = await poolContract.withdrawInstantlyFrom(
          address,
          ethers.utils.parseUnits(value, "gwei"),
          addresses[networkID].POOL_TOGETHER.POOL_TOKEN_ADDRESS,
          earlyExitFee.payload.withdraw.earlyExitFee.exitFee, // maximum exit fee
        );
        const text = "Pool " + action;
        const pendingTxnType = "pool_withdraw";
        dispatch(fetchPendingTxns({ txnHash: poolTx.hash, text: text, type: pendingTxnType }));
        await poolTx.wait();
      } else {
        console.log("unrecognized action: ", action);
      }
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else {
        alert(error.message);
      }
      return;
    } finally {
      if (poolTx) {
        dispatch(clearPendingTxn(poolTx.hash));
      }
    }

    return dispatch(getBalances({ address, networkID, provider }));
  },
);
