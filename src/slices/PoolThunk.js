import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as PrizePool } from "../abi/33-together/PrizePoolAbi.json";
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
          addresses[networkID].POOL_TOGETHER.POOL_ADDRESS,
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
    }

    const depositAllowance = await sohmContract.allowance(address, addresses[networkID].POOL_TOGETHER.POOL_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        pooling: {
          sohmPool: +depositAllowance,
        },
      }),
    );
  },
);

export const poolDeposit = createAsyncThunk(
  "pool/deposit",
  async ({ action, value, provider, address, networkID }, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const poolContract = await new ethers.Contract(addresses[networkID].POOL_TOGETHER.POOL_ADDRESS, PrizePool, signer);
    let poolTx;

    try {
      if (action === "deposit") {
        poolTx = await poolContract.timelockDepositTo(
          addresses[networkID].POOL_TOGETHER.POOL_ADDRESS,
          ethers.utils.parseUnits(value, "gwei"),
          addresses[networkID].POOL_TOGETHER.POOL_TOKEN_ADDRESS,
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

export const poolWithdraw = createAsyncThunk(
  "pool/withdraw",
  async ({ action, value, provider, address, networkID }, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const poolContract = await new ethers.Contract(addresses[networkID].POOL_TOGETHER.POOL_ADDRESS, PrizePool, signer);

    let poolTx;

    try {
      if (action === "withdraw") {
        console.log("you tryin to withdraw eh?", action, poolContract);
        // poolTx = await poolContract.withdrawInstantlyFrom(addresses[networkID].POOL_TOGETHER.POOL_ADDRESS, value, address, ethers.utils.parseUnits(value, "gwei"), , );
        const text = "Pool " + action;
        const pendingTxnType = "pool_withdraw";
        // dispatch(fetchPendingTxns({ txnHash: poolTx.hash, text: text, type: pendingTxnType }));
        // await poolTx.wait();
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
