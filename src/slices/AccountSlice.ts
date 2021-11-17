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
import { FuseProxy, IERC20, IERC20__factory, SOhmv2, SOhmv2__factory, WsOHM } from "src/typechain";

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
    const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, provider) as WsOHM;
    const wsohmBalance = await wsohmContract.balanceOf(address);

    const gOhmContract = new ethers.Contract(
      addresses[networkID].GOHM_ADDRESS as string,
      ierc20Abi,
      provider,
    ) as IERC20;
    const gOhmBalance = await gOhmContract.balanceOf(address);

    const ohmContractV2 = new ethers.Contract(addresses[networkID].OHM_V2 as string, ierc20Abi, provider) as IERC20;
    const ohmV2Balance = await ohmContractV2.balanceOf(address);

    const sOhmContractV2 = new ethers.Contract(addresses[networkID].SOHM_V2 as string, ierc20Abi, provider) as IERC20;
    const sOhmV2Balance = await sOhmContractV2.balanceOf(address);

    // NOTE (appleseed): wsohmAsSohm is wsOHM given as a quantity of sOHM
    const wsohmAsSohm = await wsohmContract.wOHMTosOHM(wsohmBalance);
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
        wsohm: ethers.utils.formatEther(wsohmBalance),
        wsohmAsSohm: ethers.utils.formatUnits(wsohmAsSohm, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
        gohm: ethers.utils.formatUnits(gOhmBalance, "gwei"),
        ohmv2: ethers.utils.formatUnits(ohmV2Balance, "gwei"),
        sohmv2: ethers.utils.formatUnits(sOhmV2Balance, "gwei"),
      },
    };
  },
);

export const getMigrationAllowances = createAsyncThunk(
  "account/getMigrationAllowances",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let ohmAllowance = BigNumber.from(0);
    let sOhmAllowance = BigNumber.from(0);
    let wsOhmAllowance = BigNumber.from(0);

    if (addresses[networkID].OHM_ADDRESS) {
      const ohmContract = IERC20__factory.connect(addresses[networkID].OHM_ADDRESS, provider);
      ohmAllowance = await ohmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      const sOhmContract = SOhmv2__factory.connect(addresses[networkID].SOHM_ADDRESS, provider);
      sOhmAllowance = await sOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
    }

    if (addresses[networkID].WSOHM_ADDRESS) {
      const wsOhmContract = IERC20__factory.connect(addresses[networkID].WSOHM_ADDRESS, provider);
      wsOhmAllowance = await wsOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
    }
    return {
      migration: {
        ohm: +ohmAllowance,
        sohm: +sOhmAllowance,
        wsohm: +wsOhmAllowance,
      },
      isMigrationComplete: false,
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let ohmBalance = BigNumber.from(0);
    let sohmBalance = BigNumber.from(0);
    let fsohmBalance = BigNumber.from(0);
    let fsohmString = "0.0";
    let wsohmBalance = BigNumber.from(0);
    let wsohmAsSohm = BigNumber.from(0);
    let wrapAllowance = BigNumber.from(0);
    let unwrapAllowance = BigNumber.from(0);
    let stakeAllowance = BigNumber.from(0);
    let unstakeAllowance = BigNumber.from(0);
    let lpStaked = 0;
    let pendingRewards = 0;
    let lpBondAllowance = 0;
    let daiBondAllowance = 0;
    let aOHMAbleToClaim = 0;
    let poolBalance = BigNumber.from(0);
    let poolAllowance = BigNumber.from(0);
    let gOhmBalance = BigNumber.from(0);
    let ohmV2Balance = BigNumber.from(0);
    let sOhmV2Balance = BigNumber.from(0);
    let unstakeAllowanceV2 = BigNumber.from(0);
    let stakeAllowanceV2 = BigNumber.from(0);

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

    if (addresses[networkID].OHM_V2) {
      const ohmContractV2 = new ethers.Contract(addresses[networkID].OHM_V2 as string, ierc20Abi, provider) as IERC20;
      ohmV2Balance = await ohmContractV2.balanceOf(address);
      stakeAllowanceV2 = await ohmContractV2.allowance(address, addresses[networkID].STAKING_V2);
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider) as SOhmv2;
      sohmBalance = await sohmContract.balanceOf(address);
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      poolAllowance = await sohmContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
      wrapAllowance = await sohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);
    }

    if (addresses[networkID].SOHM_V2) {
      const sOhmContractV2 = new ethers.Contract(addresses[networkID].SOHM_V2 as string, sOHMv2, provider) as SOhmv2;
      sOhmV2Balance = await sOhmContractV2.balanceOf(address);
      unstakeAllowanceV2 = await sOhmContractV2.allowance(address, addresses[networkID].STAKING_V2);
      // poolAllowance = await sOhmV2.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
      // wrapAllowance = await sOhmV2.allowance(address, addresses[networkID].WSOHM_ADDRESS);
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
          provider.getSigner(),
        ) as FuseProxy;
        // fsohmContract.signer;
        const balanceOfUnderlying = await fsohmContract.callStatic.balanceOfUnderlying(address);
        fsohmBalance = balanceOfUnderlying.add(fsohmBalance);
      }
    }

    if (addresses[networkID].WSOHM_ADDRESS) {
      const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, provider) as WsOHM;
      wsohmBalance = await wsohmContract.balanceOf(address);
      // NOTE (appleseed): wsohmAsSohm is used to calc your next reward amount
      wsohmAsSohm = await wsohmContract.wOHMTosOHM(wsohmBalance);
      unwrapAllowance = await wsohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);
    }

    if (addresses[networkID].GOHM_ADDRESS) {
      const gOhmContract = new ethers.Contract(
        addresses[networkID].GOHM_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      gOhmBalance = await gOhmContract.balanceOf(address);
    }

    return {
      balances: {
        dai: ethers.utils.formatEther(daiBalance),
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        fsohm: ethers.utils.formatUnits(fsohmBalance, "gwei"),
        wsohm: ethers.utils.formatEther(wsohmBalance),
        wsohmAsSohm: ethers.utils.formatUnits(wsohmAsSohm, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
        gohm: ethers.utils.formatUnits(gOhmBalance, "ether"),
        ohmv2: ethers.utils.formatUnits(ohmV2Balance, "gwei"),
        sohmv2: ethers.utils.formatUnits(sOhmV2Balance, "gwei"),
      },
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
        ohmStakeV2: +stakeAllowanceV2,
        ohmUnstakeV2: +unstakeAllowanceV2,
      },
      wrapping: {
        ohmWrap: +wrapAllowance,
        ohmUnwrap: +unwrapAllowance,
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
    gohm: string;
    ohmv2: string;
    sohmv2: string;
  };
  loading: boolean;
  migration: {
    ohm: number;
    sohm: number;
    wsohm: number;
  };
  isMigrationComplete: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { ohm: "", sohm: "", dai: "", oldsohm: "", gohm: "", ohmv2: "", sohmv2: "" },
  migration: { ohm: 0.0, sohm: 0.0, wsohm: 0.0 },
  isMigrationComplete: false,
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
      })
      .addCase(getMigrationAllowances.pending, state => {
        state.loading = true;
      })
      .addCase(getMigrationAllowances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getMigrationAllowances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
