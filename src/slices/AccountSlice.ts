import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { GOHM_ADDRESSES, MIGRATOR_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { RootState } from "src/store";
import { IERC20, IERC20__factory, WsOHM } from "src/typechain";
import { GOHM__factory } from "src/typechain/factories/GOHM__factory";

import ierc20Abi from "../abi/IERC20.json";
import MockSohm from "../abi/MockSohm.json";
import wsOHM from "../abi/wsOHM.json";
import { addresses } from "../constants";
import { handleContractError, setAll } from "../helpers";
import { IBaseAddressAsyncThunk } from "./interfaces";

interface IUserBalances {
  balances: {
    ohmV1: string;
    sohmV1: string;
    wsohm: string;
    mockSohm: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk): Promise<IUserBalances> => {
    let ohmBalance = BigNumber.from("0");
    let sohmBalance = BigNumber.from("0");
    let mockSohmBalance = BigNumber.from("0");
    let wsohmBalance = BigNumber.from("0");
    try {
      const wsohmContract = new ethers.Contract(
        addresses[networkID].WSOHM_ADDRESS as string,
        wsOHM.abi,
        provider,
      ) as WsOHM;
      wsohmBalance = await wsohmContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }
    try {
      const ohmContract = new ethers.Contract(
        addresses[networkID].OHM_ADDRESS as string,
        ierc20Abi.abi,
        provider,
      ) as IERC20;
      ohmBalance = await ohmContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }
    try {
      const sohmContract = new ethers.Contract(
        addresses[networkID].SOHM_ADDRESS as string,
        ierc20Abi.abi,
        provider,
      ) as IERC20;
      sohmBalance = await sohmContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }
    /*
      Needed a sOHM contract on testnet that could easily
      be manually rebased to test redeem features
    */
    try {
      if (Environment.isGiveEnabled() && addresses[networkID] && addresses[networkID].MOCK_SOHM) {
        const mockSohmContract = new ethers.Contract(
          addresses[networkID].MOCK_SOHM as string,
          MockSohm.abi,
          provider,
        ) as IERC20;
        mockSohmBalance = await mockSohmContract.balanceOf(address);
      } else {
        console.debug("Unable to find MOCK_SOHM contract on chain ID " + networkID);
      }
    } catch (e) {
      handleContractError(e);
    }

    return {
      balances: {
        ohmV1: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohmV1: ethers.utils.formatUnits(sohmBalance, "gwei"),
        wsohm: ethers.utils.formatEther(wsohmBalance),
        mockSohm: ethers.utils.formatUnits(mockSohmBalance, "gwei"),
      },
    };
  },
);

interface IUserAccountDetails {
  staking: {
    ohmStakeV1: number;
    ohmUnstakeV1: number;
  };
  wrapping: {
    sohmWrap: number;
    wsohmUnwrap: number;
    gOhmUnwrap: number;
    wsOhmMigrate: number;
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
        ohmAllowance = await ohmContract.allowance(
          address,
          MIGRATOR_ADDRESSES[networkID as keyof typeof MIGRATOR_ADDRESSES],
        );
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      try {
        const sOhmContract = IERC20__factory.connect(addresses[networkID].SOHM_ADDRESS, provider);
        sOhmAllowance = await sOhmContract.allowance(
          address,
          MIGRATOR_ADDRESSES[networkID as keyof typeof MIGRATOR_ADDRESSES],
        );
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].WSOHM_ADDRESS) {
      try {
        const wsOhmContract = IERC20__factory.connect(addresses[networkID].WSOHM_ADDRESS, provider);
        wsOhmAllowance = await wsOhmContract.allowance(
          address,
          MIGRATOR_ADDRESSES[networkID as keyof typeof MIGRATOR_ADDRESSES],
        );
      } catch (e) {
        handleContractError(e);
      }
    }

    if (GOHM_ADDRESSES[networkID as keyof typeof GOHM_ADDRESSES]) {
      try {
        const gOhmContract = IERC20__factory.connect(
          GOHM_ADDRESSES[networkID as keyof typeof GOHM_ADDRESSES],
          provider,
        );
        gOhmAllowance = await gOhmContract.allowance(
          address,
          MIGRATOR_ADDRESSES[networkID as keyof typeof MIGRATOR_ADDRESSES],
        );
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
    let gOhmUnwrapAllowance = BigNumber.from("0");
    let wsOhmMigrateAllowance = BigNumber.from("0");

    try {
      const gOhmContract = GOHM__factory.connect(GOHM_ADDRESSES[networkID as keyof typeof GOHM_ADDRESSES], provider);
      gOhmUnwrapAllowance = await gOhmContract.allowance(
        address,
        STAKING_ADDRESSES[networkID as keyof typeof STAKING_ADDRESSES],
      );

      const wsOhmContract = IERC20__factory.connect(addresses[networkID].WSOHM_ADDRESS, provider);
      wsOhmMigrateAllowance = await wsOhmContract.balanceOf(address);

      const ohmContract = new ethers.Contract(
        addresses[networkID].OHM_ADDRESS as string,
        ierc20Abi.abi,
        provider,
      ) as IERC20;
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);

      const sohmContract = new ethers.Contract(
        addresses[networkID].SOHM_ADDRESS as string,
        ierc20Abi.abi,
        provider,
      ) as IERC20;
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      wrapAllowance = await sohmContract.allowance(
        address,
        STAKING_ADDRESSES[networkID as keyof typeof STAKING_ADDRESSES],
      );
    } catch (e) {
      handleContractError(e);
    }
    await dispatch(getBalances({ address, networkID, provider }));

    return {
      staking: {
        ohmStakeV1: +stakeAllowance,
        ohmUnstakeV1: +unstakeAllowance,
      },
      wrapping: {
        sohmWrap: Number(ethers.utils.formatUnits(wrapAllowance, "gwei")),
        gOhmUnwrap: Number(ethers.utils.formatUnits(gOhmUnwrapAllowance, "ether")),
        wsOhmMigrate: Number(ethers.utils.formatUnits(wsOhmMigrateAllowance, "ether")),
      },
    };
  },
);

export interface IAccountSlice extends IUserAccountDetails, IUserBalances {
  balances: {
    ohmV1: string;
    sohmV1: string;
    dai: string;
    wsohm: string;
    mockSohm: string;
  };
  loading: boolean;
  staking: {
    ohmStakeV1: number;
    ohmUnstakeV1: number;
  };
  migration: {
    ohm: number;
    sohm: number;
    wsohm: number;
    gohm: number;
  };
  isMigrationComplete: boolean;
}

const initialState: IAccountSlice = {
  loading: false,
  balances: {
    ohmV1: "",
    sohmV1: "",
    dai: "",
    wsohm: "",
    mockSohm: "",
  },
  staking: { ohmStakeV1: 0, ohmUnstakeV1: 0 },
  wrapping: { sohmWrap: 0, wsohmUnwrap: 0, gOhmUnwrap: 0, wsOhmMigrate: 0 },
  migration: { ohm: 0, sohm: 0, wsohm: 0, gohm: 0 },
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
