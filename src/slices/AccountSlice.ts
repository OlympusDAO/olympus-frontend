import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsOHM } from "../abi/wsOHM.json";
import { abi as OlympusGiving } from "../abi/OlympusGiving.json";
import { abi as MockSohm } from "../abi/MockSohm.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";
import { FuseProxy, IERC20, SOhmv2, WsOHM } from "src/typechain";

interface IUserBalances {
  balances: {
    ohm: string;
    sohm: string;
    fsohm: string;
    wsohm: string;
    wsohmAsSohm: string;
    pool: string;
    mockSohm: string;
  };
}

interface IUserDonationInfo {
  [key: string]: number;
}

interface IUserRecipientInfo {
  totalDebt: string;
  carry: string;
  agnosticAmount: string;
  indexAtLastChange: string;
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const ohmBalance = await ohmContract.balanceOf(address);
    console.log(ohmBalance);
    const sohmContract = new ethers.Contract(
      addresses[networkID].SOHM_ADDRESS as string,
      ierc20Abi,
      provider,
    ) as IERC20;
    const sohmBalance = await sohmContract.balanceOf(address);
    console.log(sohmBalance);
    const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, provider) as WsOHM;
    const wsohmBalance = await wsohmContract.balanceOf(address);
    console.log(wsohmBalance);
    // NOTE (appleseed): wsohmAsSohm is wsOHM given as a quantity of sOHM
    const wsohmAsSohm = await wsohmContract.wOHMTosOHM(wsohmBalance);
    console.log(wsohmAsSohm);
    const poolTokenContract = new ethers.Contract(
      addresses[networkID].PT_TOKEN_ADDRESS as string,
      ierc20Abi,
      provider,
    ) as IERC20;
    const poolBalance = await poolTokenContract.balanceOf(address);
    console.log(poolBalance);
    let fsohmBalance = BigNumber.from(0);
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
    console.log(fsohmBalance);
    // delete before mainnet
    let mockSohmBalance = BigNumber.from(0);
    if (addresses[networkID].MOCK_SOHM) {
      const mockSohmContract = new ethers.Contract(
        addresses[networkID].MOCK_SOHM as string,
        MockSohm,
        provider,
      ) as IERC20;
      mockSohmBalance = await mockSohmContract.balanceOf(address);
    }
    console.log(mockSohmBalance);

    return {
      balances: {
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        fsohm: ethers.utils.formatUnits(fsohmBalance, "gwei"),
        wsohm: ethers.utils.formatEther(wsohmBalance),
        wsohmAsSohm: ethers.utils.formatUnits(wsohmAsSohm, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
        mockSohm: ethers.utils.formatUnits(mockSohmBalance, "gwei"), // delete before mainnet
      },
    };
  },
);

export const getDonationBalances = createAsyncThunk(
  "account/getDonationBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const mockSohmContract = new ethers.Contract(addresses[networkID].MOCK_SOHM as string, MockSohm, provider);
    // Change to .allowance before mainnet
    const giveAllowance = await mockSohmContract._allowedValue(address, addresses[networkID].GIVING_ADDRESS);
    const givingContract = new ethers.Contract(addresses[networkID].GIVING_ADDRESS as string, OlympusGiving, provider);
    let donationInfo: IUserDonationInfo = {};
    let i = 0;
    let endOfDonations = false;
    while (!endOfDonations) {
      try {
        let currDonation = await givingContract.donationInfo(address, i);
        if (currDonation.recipient === "0x0000000000000000000000000000000000000000") {
          i += 1;
          continue;
        } else {
          donationInfo[currDonation.recipient] = parseFloat(
            ethers.utils.formatUnits(currDonation.amount.toNumber(), "gwei"),
          );
          i += 1;
        }
      } catch (e: unknown) {
        endOfDonations = true;
      }
    }

    return {
      giving: {
        sohmGive: +giveAllowance,
        donationInfo: donationInfo,
      },
    };
  },
);

export const getRedemptionBalances = createAsyncThunk(
  "account/getRedemptionBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const givingContract = new ethers.Contract(addresses[networkID].GIVING_ADDRESS as string, OlympusGiving, provider);
    const redeemableBalance = await givingContract.redeemableBalance(address);
    console.log(redeemableBalance);

    let recipientInfo: IUserRecipientInfo = {
      totalDebt: "",
      carry: "",
      agnosticAmount: "",
      indexAtLastChange: "",
    };
    try {
      let recipientInfoData = await givingContract.recipientInfo(address);
      recipientInfo.totalDebt = ethers.utils.formatUnits(recipientInfoData.totalDebt.toNumber(), "gwei");
      recipientInfo.carry = ethers.utils.formatUnits(recipientInfoData.carry.toNumber(), "gwei");
      recipientInfo.agnosticAmount = ethers.utils.formatUnits(recipientInfoData.agnosticAmount.toNumber(), "gwei");
      recipientInfo.indexAtLastChange = ethers.utils.formatUnits(
        recipientInfoData.indexAtLastChange.toNumber(),
        "gwei",
      );
    } catch (e: unknown) {}

    return {
      redeeming: {
        sohmRedeemable: ethers.utils.formatUnits(redeemableBalance, "gwei"),
        recipientInfo: recipientInfo,
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
  };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    console.log(stakeAllowance);

    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider) as SOhmv2;
    const unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    const poolAllowance = await sohmContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
    const wrapAllowance = await sohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);

    const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, provider) as WsOHM;
    const unwrapAllowance = await wsohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);
    console.log(unwrapAllowance);

    await dispatch(getBalances({ address, networkID, provider }));
    await dispatch(getDonationBalances({ address, networkID, provider }));
    await dispatch(getRedemptionBalances({ address, networkID, provider }));

    return {
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
      },
      wrapping: {
        ohmWrap: +wrapAllowance,
        ohmUnwrap: +unwrapAllowance,
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

export interface IAccountSlice extends IUserAccountDetails, IUserBalances {
  giving: { sohmGive: number; donationInfo: IUserDonationInfo };
  redeeming: { sohmRedeemable: string; recipientInfo: IUserRecipientInfo };
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    ohm: string;
    sohm: string;
    dai: string;
    oldsohm: string;
    fsohm: string;
    wsohm: string;
    wsohmAsSohm: string;
    pool: string;
    mockSohm: string;
  };
  loading: boolean;
  staking: {
    ohmStake: number;
    ohmUnstake: number;
  };
  pooling: {
    sohmPool: number;
  };
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { ohm: "", sohm: "", dai: "", oldsohm: "", fsohm: "", wsohm: "", pool: "", wsohmAsSohm: "", mockSohm: "" },
  giving: { sohmGive: 0, donationInfo: {} },
  redeeming: {
    sohmRedeemable: "",
    recipientInfo: {
      totalDebt: "",
      carry: "",
      agnosticAmount: "",
      indexAtLastChange: "",
    },
  },
  staking: { ohmStake: 0, ohmUnstake: 0 },
  wrapping: { sohmWrap: 0, wsohmUnwrap: 0 },
  pooling: { sohmPool: 0 },
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
      .addCase(getDonationBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getDonationBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getDonationBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getRedemptionBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getRedemptionBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getRedemptionBalances.rejected, (state, { error }) => {
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
