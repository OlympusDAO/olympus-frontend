import { BigNumber, ethers } from "ethers";
import {
  isBondLP,
  getMarketPrice,
  contractForBond,
  contractForReserve,
  addressForBond,
  addressForAsset,
  toNum,
} from "../helpers";
import { addresses, Actions, BONDS, Nested } from "../constants";
import { abi as BondOhmDaiCalcContract } from "../abi/bonds/OhmDaiCalcContract.json";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Dispatch } from "redux";
import { OlympusBondingCalculator } from "../typechain";
import { IBondData } from "src/reducers";

interface IOldBondInfo {
  readonly lastBlock: BigNumber;
  readonly payoutRemaining: BigNumber;
  readonly vestingPeriod: BigNumber;
}

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
  async (_dispatch: Dispatch) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const reserveContract = contractForReserve({ bond, networkID, provider: signer })!;

    try {
      const nestedAddress = addresses[networkID].BONDS as Nested;
      let approveTx: ethers.ContractTransaction | null;
      if (bond == BONDS.ohm_dai)
        approveTx = await reserveContract.approve(
          nestedAddress.OHM_DAI,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      else if (bond === BONDS.ohm_frax)
        approveTx = await reserveContract.approve(
          nestedAddress.OHM_FRAX,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      else if (bond === BONDS.dai)
        approveTx = await reserveContract.approve(
          nestedAddress.DAI,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );
      // <-- added for frax
      // bond === BONDS.frax
      else
        approveTx = await reserveContract.approve(
          nestedAddress.FRAX,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );

      await approveTx.wait();
    } catch (error) {
      alert(error.message);
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
    let bondDiscount, valuation, bondQuote;
    const bondContract = contractForBond({ bond, networkID, provider });
    const bondCalcContract = new ethers.Contract(
      (addresses[networkID].BONDS as Nested).OHM_DAI_CALC,
      BondOhmDaiCalcContract,
      provider,
    ) as OlympusBondingCalculator;

    const marketPrice = await getMarketPrice({ networkID, provider });
    const terms = await bondContract.terms();
    const maxBondPrice = toNum(await bondContract.maxPayout());
    let debtRatio, bondPrice;
    try {
      bondPrice = toNum(await bondContract.bondPriceInUSD());

      bondDiscount = (marketPrice * Math.pow(10, 9) - bondPrice) / bondPrice; // 1 - bondPrice / (marketPrice * Math.pow(10, 9));
      if (bond === BONDS.ohm_dai) {
        debtRatio = toNum(await bondContract.standardizedDebtRatio()) / Math.pow(10, 9);
        // RFV = assume 1:1 backing
        valuation = await bondCalcContract.valuation(addresses[networkID].LP_ADDRESS as string, amountInWei);
        bondQuote = toNum(await bondContract.payoutFor(valuation));
        bondQuote = bondQuote / Math.pow(10, 9);
      } else if (bond === BONDS.ohm_frax) {
        debtRatio = toNum(await bondContract.standardizedDebtRatio()) / Math.pow(10, 9);
        valuation = await bondCalcContract.valuation((addresses[networkID].RESERVES as Nested).OHM_FRAX, amountInWei);
        bondQuote = toNum(await bondContract.payoutFor(valuation));
        bondQuote = bondQuote / Math.pow(10, 9);
      } else {
        // RFV = DAI
        debtRatio = await bondContract.standardizedDebtRatio();
        bondQuote = toNum(await bondContract.payoutFor(amountInWei));
        bondQuote = bondQuote / Math.pow(10, 18);
      }
    } catch (e) {
      debtRatio = 0;
      bondPrice = 0;
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
        bondPrice: bondPrice / Math.pow(10, 18),
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
    if (bond === BONDS.dai_v1 || bond === BONDS.ohm_frax_v1 || bond === BONDS.ohm_dai_v1) {
      const bondDetails = (await bondContract.bondInfo(address)) as unknown as IOldBondInfo;
      interestDue = toNum(bondDetails.payoutRemaining) / Math.pow(10, 9);
      bondMaturationBlock = +bondDetails.vestingPeriod + +bondDetails.lastBlock;
      pendingPayout = await bondContract.pendingPayoutFor(address);
    } else {
      const bondDetails = await bondContract.bondInfo(address);
      interestDue = toNum(bondDetails.payout) / Math.pow(10, 9);
      bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
      pendingPayout = await bondContract.pendingPayoutFor(address);
    }

    let allowance: number | BigNumber | undefined, balance;
    const nestedBondAddresses = addresses[networkID].BONDS as Nested;
    if (bond === BONDS.ohm_dai || bond === BONDS.ohm_dai_v1) {
      allowance = await reserveContract.allowance(address, nestedBondAddresses.OHM_DAI);

      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, "ether");
    } else if (bond === BONDS.dai || bond === BONDS.dai_v1) {
      allowance = await reserveContract.allowance(address, nestedBondAddresses.DAI);

      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatEther(balance);
    } else if (bond === BONDS.ohm_frax || bond === BONDS.ohm_frax_v1) {
      allowance = await reserveContract.allowance(address, nestedBondAddresses.OHM_FRAX);

      balance = await reserveContract.balanceOf(address);
      balance = ethers.utils.formatUnits(balance, "ether");
    } else if (bond === BONDS.frax) {
      allowance = await reserveContract.allowance(address, nestedBondAddresses.FRAX);

      balance = await reserveContract.balanceOf(address);
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
    // as there is no else clause, so balance may not be set.

    // Calculate maxPremium based on premium and slippage.
    // const calculatePremium = await bonding.calculatePremium();
    const signer = provider.getSigner();
    const bondContract = contractForBond({ bond, provider: signer, networkID });
    const calculatePremium = toNum(await bondContract.bondPrice());
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

    // Deposit the bond
    try {
      const bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress);
      await bondTx.wait();

      const reserveContract = contractForReserve({ bond, provider, networkID });

      if (bond === BONDS.ohm_dai || bond === BONDS.ohm_frax) {
        balance = ethers.utils.formatEther(await reserveContract.balanceOf(address));
      } else if (bond === BONDS.dai) {
        balance = ethers.utils.formatEther(await reserveContract.balanceOf(address));
      }

      return dispatch(fetchBondSuccess({ bond, balance }));
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
        alert("You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
      } else alert(error.message);
      return;
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
    const bondContract = contractForBond({ bond, networkID, provider: signer }) as ethers.Contract; // TS-REFACTOR: contract type mismatch (need old bondContract)

    try {
      let redeemTx;
      if (bond === BONDS.dai_v1 || bond === BONDS.ohm_dai_v1 || bond === BONDS.ohm_frax_v1) {
        redeemTx = await bondContract.redeem(false); // TS-REFACTOR: takes two args, but only one is passed.
      } else {
        redeemTx = await bondContract.redeem(address, autostake === true);
      }

      await redeemTx.wait();
    } catch (error) {
      alert(error.message);
    }
  };
