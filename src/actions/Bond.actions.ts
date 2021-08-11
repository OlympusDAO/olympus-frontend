import { BigNumber, ethers } from "ethers";
import {
  isBondLP,
  getMarketPrice,
  contractForBond,
  contractForReserve,
  addressForAsset,
  toNum,
  bondName,
} from "../helpers";
import { addresses, Actions, BONDS, Nested } from "../constants";
import { abi as BondCalcContract } from "../abi/BondCalcContract.json";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { IBondData } from "src/reducers";
import { Dispatch } from "redux";
import { OlympusBondingCalculator } from "src/typechain";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxns.actions";

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
  readonly autostake: boolean | null;
  readonly bond: string;
  readonly networkID: number;
  readonly provider: StaticJsonRpcProvider;
}

export const fetchBondSuccess = (payload: IBondData) => ({
  type: Actions.FETCH_BOND_SUCCESS,
  payload,
});

export const changeApproval =
  ({ bond, provider, networkID }: IChangeApproval) =>
  async (dispatch: Dispatch) => {
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
  };

export const calcBondDetails =
  ({ bond, value, provider, networkID }: ICalcBondDetails) =>
  async (dispatch: Dispatch) => {
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

    return dispatch(
      fetchBondSuccess({
        bond,
        bondDiscount,
        debtRatio,
        bondQuote,
        purchased,
        vestingTerm: toNum(terms.vestingTerm),
        maxBondPrice: maxBondPrice / Math.pow(10, 9),
        bondPrice: toNum(bondPrice || 0) / Math.pow(10, 18),
        marketPrice: marketPrice / Math.pow(10, 9),
      }),
    );
  };

export const calculateUserBondDetails =
  ({ address, bond, networkID, provider }: ICalcUserBondDetails) =>
  async (dispatch: Dispatch) => {
    if (!address) return;

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

    return dispatch(
      fetchBondSuccess({
        bond,
        allowance,
        balance,
        interestDue,
        bondMaturationBlock,
        pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
      }),
    );
  };

export const bondAsset =
  ({ value, address, bond, networkID, provider, slippage }: IBondAsset) =>
  async (dispatch: Dispatch) => {
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

      const reserveContract = contractForReserve({ bond, provider, networkID });

      if (bond === BONDS.ohm_dai || bond === BONDS.ohm_frax) {
        balance = await reserveContract.balanceOf(address);
      } else if (bond === BONDS.dai) {
        balance = await reserveContract.balanceOf(address);
        balance = ethers.utils.formatEther(balance);
      }

      return dispatch(fetchBondSuccess({ bond, balance }));
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
  };

export const redeemBond =
  ({ address, bond, networkID, provider, autostake }: IRedeemBond) =>
  async (dispatch: Dispatch) => {
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
    } catch (error) {
      alert(error.message);
    } finally {
      if (redeemTx) {
        dispatch(clearPendingTxn(redeemTx.hash));
      }
    }
  };
