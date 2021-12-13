import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsOHM } from "../abi/wsOHM.json";
import { abi as fiatDAO } from "../abi/FiatDAOContract.json";

import { setAll, handleContractError } from "../helpers";
import { trim } from "src/helpers";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";
import { FiatDAOContract, FuseProxy, IERC20, IERC20__factory, SOhmv2, SOhmv2__factory, WsOHM } from "src/typechain";
import { GOHM__factory } from "src/typechain/factories/GOHM__factory";

interface IUserBalances {
  balances: {
    gohm: string;
    ohm: string;
    sohm: string;
    fsohm: string;
    wsohm: string;
    fiatDaowsohm: string;
    wsohmAsSohm: string;
    pool: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    let gOhmBalance = BigNumber.from("0");
    let ohmBalance = BigNumber.from("0");
    let sohmBalance = BigNumber.from("0");
    let wsohmBalance = BigNumber.from("0");
    let wsohmAsSohm = BigNumber.from("0");
    let poolBalance = BigNumber.from("0");
    let fsohmBalance = BigNumber.from(0);
    let fiatDaowsohmBalance = BigNumber.from("0");
    try {
      const gOhmContract = GOHM__factory.connect(addresses[networkID].GOHM_ADDRESS, provider);
      gOhmBalance = await gOhmContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }
    try {
      const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, provider) as WsOHM;
      wsohmBalance = await wsohmContract.balanceOf(address);
      // NOTE (appleseed): wsohmAsSohm is wsOHM given as a quantity of sOHM
      wsohmAsSohm = await wsohmContract.wOHMTosOHM(wsohmBalance);
    } catch (e) {
      handleContractError(e);
    }
    try {
      const ohmContract = new ethers.Contract(
        addresses[networkID].OHM_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      ohmBalance = await ohmContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }
    try {
      const sohmContract = new ethers.Contract(
        addresses[networkID].SOHM_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      sohmBalance = await sohmContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }
    try {
      const poolTokenContract = new ethers.Contract(
        addresses[networkID].PT_TOKEN_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      poolBalance = await poolTokenContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }
    try {
      for (const fuseAddressKey of ["FUSE_6_SOHM", "FUSE_18_SOHM", "FUSE_36_SOHM"]) {
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
    } catch (e) {
      handleContractError(e);
    }
    try {
      if (addresses[networkID].FIATDAO_WSOHM_ADDRESS) {
        const fiatDaoContract = new ethers.Contract(
          addresses[networkID].FIATDAO_WSOHM_ADDRESS as string,
          fiatDAO,
          provider,
        ) as FiatDAOContract;
        fiatDaowsohmBalance = await fiatDaoContract.balanceOf(address, addresses[networkID].WSOHM_ADDRESS as string);
      }
    } catch (e) {
      handleContractError(e);
    }

    return {
      balances: {
        gohm: ethers.utils.formatEther(gOhmBalance),
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        fsohm: ethers.utils.formatUnits(fsohmBalance, "gwei"),
        wsohm: ethers.utils.formatEther(wsohmBalance),
        fiatDaowsohm: ethers.utils.formatEther(fiatDaowsohmBalance),
        wsohmAsSohm: ethers.utils.formatUnits(wsohmAsSohm, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

interface IUserAccountDetails {
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
  wrapping: {
    sohmWrap: number;
    wsohmUnwrap: number;
    gOhmUnwrap: number;
  };
}

export const getMigrationAllowances = createAsyncThunk(
  "account/getMigrationAllowances",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let ohmAllowance = BigNumber.from(0);
    let sOhmAllowance = BigNumber.from(0);
    let wsOhmAllowance = BigNumber.from(0);
    let gOhmAllowance = BigNumber.from(0);

    if (addresses[networkID].OHM_ADDRESS) {
      try {
        const ohmContract = IERC20__factory.connect(addresses[networkID].OHM_ADDRESS, provider);
        ohmAllowance = await ohmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      try {
        const sOhmContract = IERC20__factory.connect(addresses[networkID].SOHM_ADDRESS, provider);
        sOhmAllowance = await sOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].WSOHM_ADDRESS) {
      try {
        const wsOhmContract = IERC20__factory.connect(addresses[networkID].WSOHM_ADDRESS, provider);
        wsOhmAllowance = await wsOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].GOHM_ADDRESS) {
      try {
        const gOhmContract = IERC20__factory.connect(addresses[networkID].GOHM_ADDRESS, provider);
        gOhmAllowance = await gOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    return {
      migration: {
        ohm: +ohmAllowance,
        sohm: +sOhmAllowance,
        wsohm: +wsOhmAllowance,
        gohm: +gOhmAllowance,
      },
      isMigrationComplete: false,
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    let stakeAllowance = BigNumber.from("0");
    let unstakeAllowance = BigNumber.from("0");
    let wrapAllowance = BigNumber.from("0");
    let unwrapAllowance = BigNumber.from("0");
    let gOhmUnwrapAllowance = BigNumber.from("0");
    let poolAllowance = BigNumber.from("0");
    try {
      const gOhmContract = GOHM__factory.connect(addresses[networkID].GOHM_ADDRESS, provider);
      gOhmUnwrapAllowance = await gOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);

      const ohmContract = new ethers.Contract(
        addresses[networkID].OHM_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);

      const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider) as SOhmv2;
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      poolAllowance = await sohmContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
      wrapAllowance = await sohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);

      const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, provider) as WsOHM;
      unwrapAllowance = await wsohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);
    } catch (e) {
      console.warn("failed contract calls in slice", e);
    }
    await dispatch(getBalances({ address, networkID, provider }));

    return {
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
      },
      wrapping: {
        ohmWrap: Number(ethers.utils.formatUnits(wrapAllowance, "gwei")),
        ohmUnwrap: Number(ethers.utils.formatUnits(unwrapAllowance, "gwei")),
        gOhmUnwrap: Number(ethers.utils.formatUnits(gOhmUnwrapAllowance, "ether")),
      },
    };
  },
);

export interface IUserBondDetails {
  // bond: string;
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
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID) || "");
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
    gohm: string;
    ohm: string;
    sohm: string;
    dai: string;
    oldsohm: string;
    fsohm: string;
    wsohm: string;
    fiatDaowsohm: string;
    wsohmAsSohm: string;
    pool: string;
  };
  loading: boolean;
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
  migration: {
    ohm: number;
    sohm: number;
    wsohm: number;
    gohm: number;
  };
  pooling: {
    sohmPool: number;
  };
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: {
    gohm: "",
    ohm: "",
    sohm: "",
    dai: "",
    oldsohm: "",
    fsohm: "",
    wsohm: "",
    fiatDaowsohm: "",
    pool: "",
    wsohmAsSohm: "",
  },
  staking: { ohmStake: 0, ohmUnstake: 0 },
  wrapping: { sohmWrap: 0, wsohmUnwrap: 0, gOhmUnwrap: 0 },
  pooling: { sohmPool: 0 },
  migration: { ohm: 0, sohm: 0, wsohm: 0, gohm: 0 },
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
      .addCase(getMigrationAllowances.fulfilled, (state, action) => {
        setAll(state, action.payload);
      })
      .addCase(getMigrationAllowances.rejected, (state, { error }) => {
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);

export const accountBalances = (state: any) => {
  let formattedCurrentIndex, fiatDaoAsSohm, gOhmAsSohm;

  if (state.app.currentIndex) {
    formattedCurrentIndex = trim(Number(state.app.currentIndex), 1);
    fiatDaoAsSohm = Number(state.account.balances.fiatDaowsohm) * Number(state.app.currentIndex);
    gOhmAsSohm = Number(state.account.balances.gohm) * Number(state.app.currentIndex);
  }
  const trimmedBalance = Number(
    [
      state.account.balances.sohm,
      state.account.balances.fsohm,
      state.account.balances.wsohmAsSohm,
      gOhmAsSohm,
      fiatDaoAsSohm,
    ]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const trimmedStakingAPY =
    state.app.stakingAPY && new Intl.NumberFormat("en-US").format(Number(trim(state.app.stakingAPY * 100, 1)));
  const stakingRebasePercentage = trim(state.app.stakingRebase * 100, 4);
  const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * trimmedBalance, 4);
  const formattedStakingTVL = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(state.app.stakingTVL);

  const returnObject = {
    loading: state.app.loading,
    fiveDayRate: trim(Number(state.app.fiveDayRate) * 100, 4),
    ohmBalance: trim(Number(state.account.balances.ohm), 4),
    oldSohmBalance: state.account.balances.oldsohm,
    sohmBalance: trim(Number(state.account.balances.sohm), 4),
    fsohmBalance: trim(Number(state.account.balances.fsohm), 4),
    wsohmBalance: trim(Number(state.account.balances.wsohm), 4),
    fiatDaowsohmBalance: trim(Number(state.account.balances.fiatDaowsohm), 4),
    gOhmBalance: trim(Number(state.account.balances.gohm), 4),
    wsohmAsSohm: state.account.balances.wsohmAsSohm,
    stakeAllowance: state.account.staking.ohmStake,
    unstakeAllowance: state.account.staking.ohmUnstake,
    stakingTVL: state.app.stakingTVL,
    pendingTransactions: state.pendingTransactions,
    fiatDaoAsSohm: fiatDaoAsSohm,
    gOhmAsSohm: gOhmAsSohm,
    trimmedBalance: trimmedBalance,
    trimmedStakingAPY: trimmedStakingAPY,
    stakingRebasePercentage: stakingRebasePercentage,
    nextRewardValue: nextRewardValue,
    formattedStakingTVL: formattedStakingTVL,
    formattedCurrentIndex: formattedCurrentIndex,
  };

  return returnObject;
};
