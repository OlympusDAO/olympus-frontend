import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsOHM } from "../abi/wsOHM.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";
import { FuseProxy, IERC20, SOhmv2, WsOHM } from "src/typechain";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(
      addresses[networkID].SOHM_ADDRESS as string,
      ierc20Abi,
      provider,
    ) as IERC20;
    const sohmBalance = await sohmContract.balanceOf(address);
    let poolBalance = BigNumber.from(0);
    const poolTokenContract = new ethers.Contract(
      addresses[networkID].PT_TOKEN_ADDRESS as string,
      ierc20Abi,
      provider,
    ) as IERC20;
    poolBalance = await poolTokenContract.balanceOf(address);

    return {
      balances: {
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let ohmBalance = BigNumber.from(0);
    let sohmBalance = BigNumber.from(0);
    let fsohmBalance = 0;
    let wsohmBalance = BigNumber.from(0);
    let stakeAllowance = BigNumber.from(0);
    let unstakeAllowance = BigNumber.from(0);
    let lpStaked = 0;
    let pendingRewards = 0;
    let lpBondAllowance = 0;
    let daiBondAllowance = 0;
    let aOHMAbleToClaim = 0;
    let poolBalance = BigNumber.from(0);
    let poolAllowance = BigNumber.from(0);

    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const daiBalance = await daiContract.balanceOf(address);

    if (addresses[networkID].OHM_ADDRESS) {
      const ohmContract = new ethers.Contract(
        addresses[networkID].OHM_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      ohmBalance = await ohmContract.balanceOf(address);
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider) as SOhmv2;
      sohmBalance = await sohmContract.balanceOf(address);
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      poolAllowance = await sohmContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
    }

    if (addresses[networkID].PT_TOKEN_ADDRESS) {
      const poolTokenContract = new ethers.Contract(
        addresses[networkID].PT_TOKEN_ADDRESS,
        ierc20Abi,
        provider,
      ) as IERC20;
      poolBalance = await poolTokenContract.balanceOf(address);
    }

    for (const fuseAddressKey of ["FUSE_6_SOHM", "FUSE_18_SOHM"]) {
      if (addresses[networkID][fuseAddressKey]) {
        const fsohmContract = new ethers.Contract(
          addresses[networkID][fuseAddressKey] as string,
          fuseProxy,
          provider,
        ) as FuseProxy;
        fsohmContract.signer;
        const exchangeRate = ethers.utils.formatEther(await fsohmContract.exchangeRateStored());
        const balance = ethers.utils.formatUnits(await fsohmContract.balanceOf(address), "gwei");
        fsohmBalance += Number(balance) * Number(exchangeRate);
      }
    }

    if (addresses[networkID].WSOHM_ADDRESS) {
      const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, provider) as WsOHM;
      const balance = await wsohmContract.balanceOf(address);
      wsohmBalance = await wsohmContract.wOHMTosOHM(balance);
    }

    return {
      balances: {
        dai: ethers.utils.formatEther(daiBalance),
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        fsohm: fsohmBalance,
        wsohm: ethers.utils.formatUnits(wsohmBalance, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
      },
      bonding: {
        daiAllowance: daiBondAllowance,
      },
      pooling: {
        sohmPool: +poolAllowance,
      },
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    let interestDue: BigNumberish = Number(bondDetails.payout.toString()) / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = BigNumber.from(0);
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    const balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    ohm: string;
    sohm: string;
    dai: string;
    oldsohm: string;
    fsohm: number;
    wsohm: string;
  };
  loading: boolean;
  staking?: {
    ohmStake: number;
    ohmUnstake: number;
  };
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { ohm: "", sohm: "", dai: "", oldsohm: "", fsohm: 0, wsohm: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
