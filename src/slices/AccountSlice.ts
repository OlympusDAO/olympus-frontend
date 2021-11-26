import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sTELOv2 } from "../abi/sTELOv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsTELO } from "../abi/wsTELO.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";
import { FuseProxy, IERC20, STELOv2, WsTELO } from "src/typechain";

interface IUserBalances {
  balances: {
    TELO: string;
    sTELO: string;
    fsTELO: string;
    wsTELO: string;
    wsTELOAsSTELO: string;
    pool: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const TELOContract = new ethers.Contract(addresses[networkID].TELO_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const TELOBalance = await TELOContract.balanceOf(address);
    const sTELOContract = new ethers.Contract(
      addresses[networkID].STELO_ADDRESS as string,
      ierc20Abi,
      provider,
    ) as IERC20;
    const sTELOBalance = await sTELOContract.balanceOf(address);
    const wsTELOContract = new ethers.Contract(addresses[networkID].WSTELO_ADDRESS as string, wsTELO, provider) as WsTELO;
    const wsTELOBalance = await wsTELOContract.balanceOf(address);
    // NOTE (appleseed): wsTELOAsSTELO is wsTELO given as a quantity of sTELO
    const wsTELOAsSTELO = await wsTELOContract.wTELOTosTELO(wsTELOBalance);
    const poolTokenContract = new ethers.Contract(
      addresses[networkID].PT_TOKEN_ADDRESS as string,
      ierc20Abi,
      provider,
    ) as IERC20;
    const poolBalance = await poolTokenContract.balanceOf(address);

    let fsTELOBalance = BigNumber.from(0);
    for (const fuseAddressKey of ["FUSE_6_STELO", "FUSE_18_STELO", "FUSE_36_STELO"]) {
      if (addresses[networkID][fuseAddressKey]) {
        const fsTELOContract = new ethers.Contract(
          addresses[networkID][fuseAddressKey] as string,
          fuseProxy,
          provider.getSigner(),
        ) as FuseProxy;
        // fsTELOContract.signer;
        const balanceOfUnderlying = await fsTELOContract.callStatic.balanceOfUnderlying(address);
        fsTELOBalance = balanceOfUnderlying.add(fsTELOBalance);
      }
    }

    return {
      balances: {
        TELO: ethers.utils.formatUnits(TELOBalance, "gwei"),
        sTELO: ethers.utils.formatUnits(sTELOBalance, "gwei"),
        fsTELO: ethers.utils.formatUnits(fsTELOBalance, "gwei"),
        wsTELO: ethers.utils.formatEther(wsTELOBalance),
        wsTELOAsSTELO: ethers.utils.formatUnits(wsTELOAsSTELO, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

interface IUserAccountDetails {
  staking: {
    TELOStake: number;
    TELOUnstake: number;
  };
  wrapping: {
    sTELOWrap: number;
    wsTELOUnwrap: number;
  };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    const TELOContract = new ethers.Contract(addresses[networkID].TELO_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const stakeAllowance = await TELOContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);

    const sTELOContract = new ethers.Contract(addresses[networkID].STELO_ADDRESS as string, sTELOv2, provider) as STELOv2;
    const unstakeAllowance = await sTELOContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    const poolAllowance = await sTELOContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
    const wrapAllowance = await sTELOContract.allowance(address, addresses[networkID].WSTELO_ADDRESS);

    const wsTELOContract = new ethers.Contract(addresses[networkID].WSTELO_ADDRESS as string, wsTELO, provider) as WsTELO;
    const unwrapAllowance = await wsTELOContract.allowance(address, addresses[networkID].WSTELO_ADDRESS);

    await dispatch(getBalances({ address, networkID, provider }));

    return {
      staking: {
        TELOStake: +stakeAllowance,
        TELOUnstake: +unstakeAllowance,
      },
      wrapping: {
        TELOWrap: +wrapAllowance,
        TELOUnwrap: +unwrapAllowance,
      },
      pooling: {
        sTELOPool: +poolAllowance,
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

interface IAccountSlice extends IUserAccountDetails, IUserBalances {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    TELO: string;
    sTELO: string;
    dai: string;
    oldsTELO: string;
    fsTELO: string;
    wsTELO: string;
    wsTELOAsSTELO: string;
    pool: string;
  };
  loading: boolean;
  staking: {
    TELOStake: number;
    TELOUnstake: number;
  };
  pooling: {
    sTELOPool: number;
  };
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { TELO: "", sTELO: "", dai: "", oldsTELO: "", fsTELO: "", wsTELO: "", pool: "", wsTELOAsSTELO: "" },
  staking: { TELOStake: 0, TELOUnstake: 0 },
  wrapping: { sTELOWrap: 0, wsTELOUnwrap: 0 },
  pooling: { sTELOPool: 0 },
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
