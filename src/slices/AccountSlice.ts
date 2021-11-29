import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sTELOv2 } from "../abi/sTelov2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsTELO } from "../abi/wsTELO.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";
import { FuseProxy, IERC20, STELOv2, WsTELO } from "src/typechain";

interface IUserBalances {
  balances: {
    telo: string;
    stelo: string;
    fstelo: string;
    wstelo: string;
    wsteloAsStelo: string;
    pool: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const teloContract = new ethers.Contract(addresses[networkID].TELO_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const teloBalance = await teloContract.balanceOf(address);
    const steloContract = new ethers.Contract(
      addresses[networkID].STELO_ADDRESS as string,
      ierc20Abi,
      provider,
    ) as IERC20;
    const steloBalance = await steloContract.balanceOf(address);
    const wsteloContract = new ethers.Contract(addresses[networkID].WSTELO_ADDRESS as string, wsTELO, provider) as WsTELO;
    const wsteloBalance = await wsteloContract.balanceOf(address);
    // NOTE (appleseed): wsteloAsStelo is wsTELO given as a quantity of sTELO
    const wsteloAsStelo = await wsteloContract.wTELOTosTELO(wsteloBalance);
    const poolTokenContract = new ethers.Contract(
      addresses[networkID].PT_TOKEN_ADDRESS as string,
      ierc20Abi,
      provider,
    ) as IERC20;
    const poolBalance = await poolTokenContract.balanceOf(address);

    let fsteloBalance = BigNumber.from(0);
    for (const fuseAddressKey of ["FUSE_6_STELO", "FUSE_18_STELO", "FUSE_36_STELO"]) {
      if (addresses[networkID][fuseAddressKey]) {
        const fsteloContract = new ethers.Contract(
          addresses[networkID][fuseAddressKey] as string,
          fuseProxy,
          provider.getSigner(),
        ) as FuseProxy;
        // fsteloContract.signer;
        const balanceOfUnderlying = await fsteloContract.callStatic.balanceOfUnderlying(address);
        fsteloBalance = balanceOfUnderlying.add(fsteloBalance);
      }
    }

    return {
      balances: {
        telo: ethers.utils.formatUnits(teloBalance, "gwei"),
        stelo: ethers.utils.formatUnits(steloBalance, "gwei"),
        fstelo: ethers.utils.formatUnits(fsteloBalance, "gwei"),
        wstelo: ethers.utils.formatEther(wsteloBalance),
        wsteloAsStelo: ethers.utils.formatUnits(wsteloAsStelo, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

interface IUserAccountDetails {
  staking: {
    teloStake: number;
    teloUnstake: number;
  };
  wrapping: {
    steloWrap: number;
    wsteloUnwrap: number;
  };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    const teloContract = new ethers.Contract(addresses[networkID].TELO_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const stakeAllowance = await teloContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);

    const steloContract = new ethers.Contract(addresses[networkID].STELO_ADDRESS as string, sTELOv2, provider) as STELOv2;
    const unstakeAllowance = await steloContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    const poolAllowance = await steloContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
    const wrapAllowance = await steloContract.allowance(address, addresses[networkID].WSTELO_ADDRESS);

    const wsteloContract = new ethers.Contract(addresses[networkID].WSTELO_ADDRESS as string, wsTELO, provider) as WsTELO;
    const unwrapAllowance = await wsteloContract.allowance(address, addresses[networkID].WSTELO_ADDRESS);

    await dispatch(getBalances({ address, networkID, provider }));

    return {
      staking: {
        teloStake: +stakeAllowance,
        teloUnstake: +unstakeAllowance,
      },
      wrapping: {
        teloWrap: +wrapAllowance,
        teloUnwrap: +unwrapAllowance,
      },
      pooling: {
        steloPool: +poolAllowance,
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
    telo: string;
    stelo: string;
    dai: string;
    oldstelo: string;
    fstelo: string;
    wstelo: string;
    wsteloAsStelo: string;
    pool: string;
  };
  loading: boolean;
  staking: {
    teloStake: number;
    teloUnstake: number;
  };
  pooling: {
    steloPool: number;
  };
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { telo: "", stelo: "", dai: "", oldstelo: "", fstelo: "", wstelo: "", pool: "", wsteloAsStelo: "" },
  staking: { teloStake: 0, teloUnstake: 0 },
  wrapping: { steloWrap: 0, wsteloUnwrap: 0 },
  pooling: { steloPool: 0 },
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
