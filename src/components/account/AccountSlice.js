import { ethers } from "ethers";
import { addresses, Actions } from "../../constants";
import { abi as ierc20Abi } from "../../abi/IERC20.json";
import { abi as sOHM } from "../../abi/sOHM.json";
import { abi as sOHMv2 } from "../../abi/sOhmv2.json";

import { createSlice, createSelector, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const accountAdapter = createEntityAdapter();

const initialState = accountAdapter.getInitialState({
  status: "idle",
});

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async (networkID, provider, address) => {
    // console.log("networkID = ", networkID)
    // console.log("addresses = ",addresses)

    let ohmBalance = 0;
    let sohmBalance = 0;
    let oldsohmBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let lpStaked = 0;
    let pendingRewards = 0;
    let lpBondAllowance = 0;
    let daiBondAllowance = 0;
    let aOHMAbleToClaim = 0;

    // const accountQuery = `
    //   query($id: String) {
    //     ohmie(id: $id) {
    //       id
    //       lastBalance {
    //         ohmBalance
    //         sohmBalance
    //         bondBalance
    //       }
    //     }
    //   }
    // `;

    // const graphData = await apollo(accountQuery);

    // these work in playground but show up as null, maybe subgraph api not caught up?
    // ohmBalance = graphData.data.ohmie.lastBalance.ohmBalance;
    // sohmBalance = graphData.data.ohmie.lastBalance.sohmBalance;
    let migrateContract;
    let unstakeAllowanceSohm;

    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS, ierc20Abi, provider);
    const daiBalance = await daiContract.balanceOf(address);

    if (addresses[networkID].OHM_ADDRESS) {
      const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, provider);
      ohmBalance = await ohmContract.balanceOf(address);
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    }

    if (addresses[networkID].DAI_BOND_ADDRESS) {
      daiBondAllowance = await daiContract.allowance(address, addresses[networkID].DAI_BOND_ADDRESS);
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      const sohmContract = await new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOHMv2, provider);
      sohmBalance = await sohmContract.balanceOf(address);
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    }

    if (addresses[networkID].OLD_SOHM_ADDRESS) {
      const oldsohmContract = await new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, sOHM, provider);
      oldsohmBalance = await oldsohmContract.balanceOf(address);

      const signer = provider.getSigner();
      unstakeAllowanceSohm = await oldsohmContract.allowance(address, addresses[networkID].OLD_STAKING_ADDRESS);
    }

    return fetchAccountSuccess({
      balances: {
        dai: ethers.utils.formatEther(daiBalance),
        ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        oldsohm: ethers.utils.formatUnits(oldsohmBalance, "gwei"),
      },
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
      },
      migrate: {
        unstakeAllowance: unstakeAllowanceSohm,
      },
      bonding: {
        daiAllowance: daiBondAllowance,
      },
    });
  },
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      accountAdapter.setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        accountAdapter.setAll(state, action.payload);
        state.status = "idle";
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

export const { selectAll } = accountAdapter.getSelectors(state => state.account);

export const getAccountState = createSelector(
  // watch the state for changes
  selectAll,
  // and return the new state upon changes
  account => account,
);
