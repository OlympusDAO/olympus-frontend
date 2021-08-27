import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as PrizePool } from "../abi/33-together/PrizePoolAbi.json";
import { abi as Award } from "../abi/33-together/AwardAbi.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
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
      } else {
        console.log("token not sohm", token);
      }

      const text = "Approve Pool " + (token === "sohm" ? "Deposit" : "Withdraw");
      const pendingTxnType = token === "sohm" ? "approve_pool" : "approve_pool_withdraw";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
      await approveTx.wait();
    } catch (error) {
      alert(error.message);
      return;
    }

    const depositAllowance = await sohmContract.allowance(address, addresses[networkID].POOL_TOGETHER.POOL_ADDRESS);
    // const withdrawAllowance = ;

    return dispatch(
      fetchAccountSuccess({
        pool: {
          poolAllowance: +depositAllowance,
        },
      }),
    );
  },
);

export const changeDeposit = createAsyncThunk(
  "pool/changeDeposit",
  async ({ action, value, provider, address, networkID }, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const pool = await new ethers.Contract(addresses[networkID].POOL_TOGETHER.POOL_ADDRESS, PrizePool, signer);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, provider);

    let poolTx;

    try {
      if (action === "deposit") {
        poolTx = await pool.depositTo(ethers.utils.parseUnits(value, "gwei"));
      } else if (action === "withdraw") {
        console.log("you tryin to withdraw eh?", action, pool);
        // poolTx = await pool.withdrawInstantlyFrom(address, ethers.utils.parseUnits(value, "gwei"), , );
      } else {
        console.log("unrecognized action: ", action);
      }

      const text = "Pool " + action;
      const pendingTxnType = action === "deposit" ? "deposit" : "withdraw";
      dispatch(fetchPendingTxns({ txnHash: poolTx.hash, text: text, type: pendingTxnType }));
      await poolTx.wait();
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

    // need to add pool balances to getBalances
    // 0x7e41da986c80eaba53236fab0d3ff407e7440fb3 should be the contract address for that token
    return dispatch(getBalances({ address, networkID, provider }));
  },
);
