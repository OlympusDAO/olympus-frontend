import { BigNumber, ethers } from "ethers";
import {
  isBondLP,
  getMarketPrice,
  contractForBond,
  contractForReserve,
  addressForBond,
  addressForAsset,
  toNum,
  bondName,
} from "../helpers";
import { getBalances } from "./AccountSlice";
import { addresses, Actions, BONDS, Nested } from "../constants";
import { abi as BondCalcContract } from "../abi/bonds/OhmDaiCalcContract.json";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { IBondData } from "src/reducers";
import { fetchPendingTxns, clearPendingTxn } from "./PendingTxnsSlice";
import { createSlice, createSelector, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { OlympusBondingCalculator } from "src/typechain";

interface IChangeApproval {
  readonly bond: string;
  readonly networkID: number;
  readonly provider: StaticJsonRpcProvider | undefined;
}

interface ICalcBondDetails {
  readonly bond: string;
  readonly networkID: number;
  readonly provider: StaticJsonRpcProvider | undefined;
  readonly value: string | null;
}

interface ICalcUserBondDetails {
  readonly address: string;
  readonly bond: string;
  readonly provider: StaticJsonRpcProvider;
  readonly networkID: number;
}

interface IBondAsset {
  readonly address: string;
  readonly bond: string;
  readonly networkID: number;
  readonly provider: StaticJsonRpcProvider;
  readonly slippage: number;
  readonly value: string;
}

interface IRedeemBond {
  readonly address: string;
  readonly autostake: boolean;
  readonly bond: string;
  readonly networkID: number;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export const fetchBondInProgress = () => ({
  type: Actions.FETCH_BOND_INPROGRESS,
  payload: { loading: true },
});

export const changeApproval = createAsyncThunk(
  "bonding/changeApproval",
  async ({ bond, provider, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const reserveContract = contractForReserve({ bond, networkID, provider: signer });

    let approveTx: ethers.ContractTransaction | null = null;
    try {
      const bondAddresses = addresses[networkID].BONDS as Nested;
      if (bond == BONDS.ohm_dai)
        approveTx = await reserveContract.approve(
          bondAddresses.OHM_DAI,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      else if (bond === BONDS.ohm_frax)
        approveTx = await reserveContract.approve(
          bondAddresses.OHM_FRAX,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      else if (bond === BONDS.dai)
        approveTx = await reserveContract.approve(
          bondAddresses.DAI,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      else if (bond === BONDS.frax)
        // <-- added for frax
        approveTx = await reserveContract.approve(
          bondAddresses.FRAX,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      else {
        // bond === BONDS.eth
        // <-- added for eth
        approveTx = await reserveContract.approve(
          bondAddresses.ETH,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      }
      dispatch(
        fetchPendingTxns({ txnHash: approveTx.hash, text: "Approving " + bondName(bond), type: "approve_" + bond }),
      );
      await approveTx.wait();
    } catch (error) {
      alert(error.message);
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
  },
);

export const calcBondDetails = createAsyncThunk(
  "bonding/calcBondDetails",
  async ({ bond, value, provider, networkID }: ICalcBondDetails, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }
    let amountInWei;
    if (!value || value === "") {
      amountInWei = ethers.utils.parseEther("0.0001"); // Use a realistic SLP ownership
    } else {
      amountInWei = ethers.utils.parseEther(value);
    }

    // const vestingTerm = VESTING_TERM; // hardcoded for now
    let bondPrice, bondDiscount, valuation, bondQuote;

    const bondContract = contractForBond({ bond, networkID, provider });
    const bondCalcContract = new ethers.Contract(
      addresses[networkID].BONDINGCALC_ADDRESS as string,
      BondCalcContract,
      provider,
    ) as OlympusBondingCalculator;

    const terms = await bondContract.terms();
    const maxBondPrice = toNum(await bondContract.maxPayout());
    const debtRatio = toNum(await bondContract.standardizedDebtRatio()) / Math.pow(10, 9);

    let marketPrice = await getMarketPrice({ networkID, provider });

    try {
      bondPrice = toNum(await bondContract.bondPriceInUSD());
      bondDiscount = (marketPrice * Math.pow(10, 9) - bondPrice) / bondPrice; // 1 - bondPrice / (bondPrice * Math.pow(10, 9));
    } catch (e) {
      console.log("error getting bondPriceInUSD", e);
    }
    const reserveAddresses = addresses[networkID].RESERVES as Nested;
    if (bond === BONDS.ohm_dai) {
      // RFV = assume 1:1 backing
      valuation = await bondCalcContract.valuation(reserveAddresses.OHM_DAI, amountInWei);
      bondQuote = toNum(await bondContract.payoutFor(valuation));
      bondQuote = bondQuote / Math.pow(10, 9);
    } else if (bond === BONDS.ohm_frax) {
      valuation = await bondCalcContract.valuation(reserveAddresses.OHM_FRAX, amountInWei);
      bondQuote = toNum(await bondContract.payoutFor(valuation));
      bondQuote = bondQuote / Math.pow(10, 9);
    } else {
      // RFV = DAI
      bondQuote = toNum(await bondContract.payoutFor(amountInWei));
      bondQuote = bondQuote / Math.pow(10, 18);
    }

    // Display error if user tries to exceed maximum.
    if (!!value && bondQuote && parseFloat(bondQuote.toString()) > maxBondPrice / Math.pow(10, 9)) {
      alert(
        "You're trying to bond more than the maximum payout available! The maximum bond payout is " +
          (maxBondPrice / Math.pow(10, 9)).toFixed(2).toString() +
          " OHM.",
      );
    }

    // Calculate bonds purchased
    const token = contractForReserve({ bond, networkID, provider });
    let purchased = toNum(await token.balanceOf(addresses[networkID].TREASURY_ADDRESS as string));

    // Value the bond
    if (isBondLP(bond)) {
      const markdown = toNum(await bondCalcContract.markdown(addressForAsset({ bond, networkID })));
      purchased = toNum(await bondCalcContract.valuation(addressForAsset({ bond, networkID }), purchased));
      purchased = (markdown / Math.pow(10, 18)) * (purchased / Math.pow(10, 9));
    } else if (bond === BONDS.eth) {
      purchased = purchased / Math.pow(10, 18);
      let ethPrice = await (bondContract as any).assetPrice(); // TS-REFACTOR: weird abi/types mismatch
      ethPrice = ethPrice / Math.pow(10, 8);
      purchased = purchased * ethPrice;
    } else {
      purchased = purchased / Math.pow(10, 18);
    }

    return {
      bond,
      bondDiscount,
      debtRatio,
      bondQuote,
      purchased,
      vestingTerm: toNum(terms.vestingTerm),
      maxBondPrice: maxBondPrice / Math.pow(10, 9),
      bondPrice: toNum(bondPrice || 0) / Math.pow(10, 18),
      marketPrice: marketPrice / Math.pow(10, 9),
    };
  },
);

export const calculateUserBondDetails = createAsyncThunk(
  "bonding/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetails, { dispatch }) => {
    if (!address) return;

    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = contractForBond({ bond, provider, networkID });
    const reserveContract = contractForReserve({ bond, networkID, provider });

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = toNum(bondDetails.payout) / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    const bondAddresses = addresses[networkID].BONDS as Nested;

    let allowance, balance;
    if (bond === BONDS.ohm_dai) {
      allowance = await reserveContract.allowance(address, bondAddresses.OHM_DAI);

      balance = toNum(await reserveContract.balanceOf(address));
      balance = ethers.utils.formatUnits(balance, "ether");
    } else if (bond === BONDS.dai) {
      allowance = await reserveContract.allowance(address, bondAddresses.DAI);

      balance = toNum(await reserveContract.balanceOf(address));
      balance = ethers.utils.formatEther(balance);
    } else if (bond === BONDS.ohm_frax) {
      allowance = await reserveContract.allowance(address, bondAddresses.OHM_FRAX);

      balance = toNum(await reserveContract.balanceOf(address));
      balance = ethers.utils.formatUnits(balance, "ether");
    } else if (bond === BONDS.frax) {
      allowance = await reserveContract.allowance(address, bondAddresses.FRAX);

      balance = toNum(await reserveContract.balanceOf(address));
      balance = ethers.utils.formatUnits(balance, "ether");
    } else if (bond === BONDS.eth) {
      allowance = await reserveContract.allowance(address, bondAddresses.ETH);

      balance = toNum(await reserveContract.balanceOf(address));
      balance = ethers.utils.formatUnits(balance, "ether");
    }

    return {
      bond,
      allowance: Number(allowance),
      balance: Number(balance),
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

export const bondAsset = createAsyncThunk(
  "bonding/bondAsset",
  async ({ value, address, bond, networkID, provider, slippage }: IBondAsset, { dispatch }) => {
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005; // 0.5% as default
    const valueInWei = ethers.utils.parseUnits(value.toString(), "ether");

    let balance;

    // Calculate maxPremium based on premium and slippage.
    // const calculatePremium = await bonding.calculatePremium();
    const signer = provider.getSigner();
    const bondContract = contractForBond({ bond, provider: signer, networkID });
    const calculatePremium = toNum(await bondContract.bondPrice());
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

    // Deposit the bond
    let bondTx;
    try {
      bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress);
      dispatch(fetchPendingTxns({ txnHash: bondTx.hash, text: "Bonding " + bondName(bond), type: "bond_" + bond }));
      await bondTx.wait();
      // TODO: it may make more sense to only have it in the finally.
      // UX preference (show pending after txn complete or after balance updated)

      return calculateUserBondDetails({ address, bond, networkID, provider });
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else alert(error.message);
      return;
    } finally {
      if (bondTx) {
        dispatch(clearPendingTxn(bondTx.hash));
      }
    }
  },
);

export const redeemBond = createAsyncThunk(
  "bonding/redeemBond",
  async ({ address, bond, networkID, provider, autostake }: IRedeemBond, { dispatch }) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    // TS-REFACTOR-NOTE: contract type mismatch (need old bondContract)
    const bondContract = contractForBond({ bond, networkID, provider: signer }) as ethers.Contract;

    let redeemTx;
    try {
      redeemTx = await bondContract.redeem(address, autostake === true);
      const pendingTxnType = "redeem_bond_" + bond + (autostake === true ? "_autostake" : "");
      dispatch(fetchPendingTxns({ txnHash: redeemTx.hash, text: "Redeeming " + bondName(bond), type: pendingTxnType }));
      await redeemTx.wait();
      await dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));

      dispatch(getBalances({ address, networkID, provider }));
    } catch (error) {
      alert(error.message);
    } finally {
      if (redeemTx) {
        dispatch(clearPendingTxn(redeemTx.hash));
      }
    }
  },
);

// TS-REFACTOR-TODO: figure out the correct typing of this slice's state.
interface IBondSlice {
  status: string;
  [key: string]: any;
}

// TS-REFACTOR-TODO: replace any
const setBondState = (state: IBondSlice, payload: any) => {
  const bond = payload.bond;
  const newState = { ...state[bond], ...payload };
  state[bond] = newState;
  state.loading = false;
};

const initialState: IBondSlice = {
  status: "idle",
};

const bondingSlice = createSlice({
  name: "bonding",
  initialState,
  reducers: {
    fetchBondSuccess(state, action) {
      (state as any)[action.payload.bond] = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(calcBondDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(calcBondDetails.fulfilled, (state, action) => {
        setBondState(state, action.payload);
        state.loading = false;
      })
      .addCase(calcBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        setBondState(state, action.payload);
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default bondingSlice.reducer;

export const { fetchBondSuccess } = bondingSlice.actions;

// TS-REFACTOR-TODO: don't use any
const baseInfo = (state: any) => state.bonding;

export const getBondingState = createSelector(baseInfo, bonding => bonding);
