import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsOHM } from "../abi/wsOHM.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Bond, NetworkID } from "src/lib/Bond"; // TODO: this type definition needs to move out of BOND.
import { RootState } from "src/store";

interface IGetBalances {
  address: string;
  networkID: NetworkID;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IGetBalances) => {
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(address);
    let poolBalance = 0;
    if (networkID === 4) {
      const poolTokenContract = new ethers.Contract(
        addresses[networkID].PT_TOKEN_ADDRESS as string,
        ierc20Abi,
        provider,
      );
      poolBalance = await poolTokenContract.balanceOf(address);
    }

    return {
      balances: {
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

interface ILoadAccountDetails {
  address: string;
  networkID: NetworkID;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
  balances: {
    dai: string;
    ohm: string;
    sohm: string;
    oldsohm: string;
  };
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
  migrate: {
    unstakeAllowance: number;
  };
  bonding: {
    daiAllowance: number;
  };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: ILoadAccountDetails) => {
    let ohmBalance = 0;
    let sohmBalance = 0;
    let fsohmBalance = 0;
    let wsohmBalance = 0;
    let oldsohmBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let lpStaked = 0;
    let pendingRewards = 0;
    let lpBondAllowance = 0;
    let daiBondAllowance = 0;
    let aOHMAbleToClaim = 0;
    let unstakeAllowanceSohm;
    let poolBalance = 0;
    let poolAllowance = 0;

    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, provider);
    const daiBalance = await daiContract.balanceOf(address);

    if (addresses[networkID].OHM_ADDRESS) {
      const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, provider);
      ohmBalance = await ohmContract.balanceOf(address);
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider);
      sohmBalance = await sohmContract.balanceOf(address);
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      if (networkID === 4) {
        poolAllowance = await sohmContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
      }
    }

    if (addresses[networkID].PT_TOKEN_ADDRESS) {
      const poolTokenContract = await new ethers.Contract(addresses[networkID].PT_TOKEN_ADDRESS, ierc20Abi, provider);
      if (networkID === 4) {
        poolBalance = await poolTokenContract.balanceOf(address);
      }
    }

    for (const fuseAddressKey of ["FUSE_6_SOHM", "FUSE_18_SOHM"]) {
      if (addresses[networkID][fuseAddressKey]) {
        const fsohmContract = await new ethers.Contract(
          addresses[networkID][fuseAddressKey] as string,
          fuseProxy,
          provider,
        );
        fsohmContract.signer;
        const exchangeRate = ethers.utils.formatEther(await fsohmContract.exchangeRateStored());
        const balance = ethers.utils.formatUnits(await fsohmContract.balanceOf(address), "gwei");
        fsohmBalance += Number(balance) * Number(exchangeRate);
      }
    }

    if (addresses[networkID].WSOHM_ADDRESS) {
      const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, provider);
      const balance = await wsohmContract.balanceOf(address);
      wsohmBalance = await wsohmContract.wOHMTosOHM(balance);
    }

    if (addresses[networkID].OLD_SOHM_ADDRESS) {
      const oldsohmContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS as string, sOHM, provider);
      oldsohmBalance = await oldsohmContract.balanceOf(address);
      unstakeAllowanceSohm = await oldsohmContract.allowance(address, addresses[networkID].OLD_STAKING_ADDRESS);
    }

    return {
      balances: {
        dai: ethers.utils.formatEther(daiBalance),
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        fsohm: fsohmBalance,
        wsohm: ethers.utils.formatUnits(wsohmBalance, "gwei"),
        oldsohm: ethers.utils.formatUnits(oldsohmBalance, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
      },
      migrate: {
        unstakeAllowance: +unstakeAllowanceSohm,
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

interface ICalcUserBondDetails {
  address: string;
  bond: Bond;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  networkID: NetworkID;
}
export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetails, { dispatch }) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: 0,
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = 0;
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    const balanceVal = ethers.utils.formatEther(balance);

    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance),
      balance: Number(balanceVal),
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
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { ohm: "", sohm: "", dai: "", oldsohm: "" },
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
