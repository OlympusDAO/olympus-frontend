import { BigNumber, ethers } from "ethers";
import {
  isBondLP,
  getMarketPrice,
  contractForBond,
  contractForReserve,
  addressForBond,
  addressForAsset,
} from "../helpers";
import { addresses, Actions, BONDS, Nested } from "../constants";
import { abi as BondOhmDaiCalcContract } from "../abi/bonds/OhmDaiCalcContract.json";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Dispatch } from "redux";
import { OlympusBondingCalculator } from "../typechain";

// TS-REFACTOR-TODO: these types are probably not going to be number, will probably be BigNumber
interface IBondDetails {
  readonly allowance?: number | BigNumber;
  readonly balance?: string | BigNumber;
  readonly bond: string; // TS-REFACTOR-TODO: maybe be more explicit w/ specific bond strings
  readonly bondDiscount?: number | undefined;
  readonly bondMaturationBlock?: number;
  readonly bondPrice?: number | undefined;
  readonly bondQuote?: number | undefined;
  readonly debtRatio?: number | BigNumber;
  readonly interestDue?: number;
  readonly marketPrice?: number;
  readonly maxBondPrice?: number;
  readonly pendingPayout?: string;
  readonly purchased?: number;
  readonly vestingTerm?: number;
}

interface IOldBondInfo {
  readonly lastBlock: BigNumber;
  readonly payoutRemaining: BigNumber;
  readonly vestingPeriod: BigNumber;
}

export const fetchBondSuccess = (payload: IBondDetails) => ({
  type: Actions.FETCH_BOND_SUCCESS,
  payload,
});

export const changeApproval =
  ({
    bond,
    provider,
    address, // TS-REFACTOR-TODO: address not used
    networkID,
  }: {
    bond: string;
    provider: StaticJsonRpcProvider;
    address: string;
    networkID: number;
  }) =>
  async (dispatch: Dispatch) => {
    // TS-REFACTOR-TODO: dispatch not used
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
      else if (bond === BONDS.frax)
        // <-- added for frax
        approveTx = await reserveContract.approve(
          nestedAddress.FRAX,
          ethers.utils.parseUnits("1000000000", "ether").toString(),
        );

      await approveTx!.wait(); // TS-REFACTOR-TODO: approvetx may be null, we don't check this.
    } catch (error) {
      alert(error.message);
    }
  };

export const calcBondDetails =
  ({
    bond,
    value,
    provider,
    networkID,
  }: {
    bond: string;
    value: string | null;
    provider: StaticJsonRpcProvider;
    networkID: number;
  }) =>
  async (dispatch: Dispatch) => {
    let amountInWei;
    if (!value || value === "") {
      amountInWei = ethers.utils.parseEther("0.0001"); // Use a realistic SLP ownership
    } else {
      amountInWei = ethers.utils.parseEther(value);
    }

    // const vestingTerm = VESTING_TERM; // hardcoded for now
    let bondDiscount, valuation, bondQuote;
    const bondContract = contractForBond({ bond, networkID, provider })!; // TS-REFACTOR-TODO: can possibly be null
    const bondCalcContract = new ethers.Contract(
      (addresses[networkID].BONDS as Nested).OHM_DAI_CALC,
      BondOhmDaiCalcContract,
      provider,
    ) as OlympusBondingCalculator;

    const marketPrice = await getMarketPrice({ networkID, provider });
    const terms = await bondContract.terms();
    const maxBondPrice = (await bondContract.maxPayout()) as unknown as number;

    let debtRatio, bondPrice;
    try {
      bondPrice = (await bondContract.bondPriceInUSD()) as unknown as number;

      bondDiscount = (marketPrice * Math.pow(10, 9) - bondPrice) / bondPrice; // 1 - bondPrice / (marketPrice * Math.pow(10, 9));
      if (bond === BONDS.ohm_dai) {
        debtRatio = ((await bondContract.standardizedDebtRatio()) as unknown as number) / Math.pow(10, 9);
        // RFV = assume 1:1 backing
        valuation = await bondCalcContract.valuation(addresses[networkID].LP_ADDRESS as string, amountInWei);
        bondQuote = (await bondContract.payoutFor(valuation)) as unknown as number;
        bondQuote = bondQuote / Math.pow(10, 9);
      } else if (bond === BONDS.ohm_frax) {
        debtRatio = ((await bondContract.standardizedDebtRatio()) as unknown as number) / Math.pow(10, 9);
        valuation = await bondCalcContract.valuation((addresses[networkID].RESERVES as Nested).OHM_FRAX, amountInWei);
        bondQuote = (await bondContract.payoutFor(valuation)) as unknown as number;
        bondQuote = bondQuote / Math.pow(10, 9);
      } else {
        // RFV = DAI
        debtRatio = await bondContract.standardizedDebtRatio();
        bondQuote = (await bondContract.payoutFor(amountInWei)) as unknown as number;
        bondQuote = bondQuote / Math.pow(10, 18);
      }
    } catch (e) {
      debtRatio = 0;
      bondPrice = 0;
    }

    // TS-REFACTOR-TODO: bondQuote is actually a number, but we're still passing it to parseFloat
    // Display error if user tries to exceed maximum.
    if (!!value && parseFloat(bondQuote as unknown as string) > maxBondPrice / Math.pow(10, 9)) {
      alert(
        "You're trying to bond more than the maximum payout available! The maximum bond payout is " +
          (maxBondPrice / Math.pow(10, 9)).toFixed(2).toString() +
          " OHM.",
      );
    }

    // Calculate bonds purchased
    const token = contractForReserve({ bond, networkID, provider })!; // TS-REFACTOR-TODO: can possibly be null, casting as not null
    let purchased = (await token.balanceOf(addresses[networkID].TREASURY_ADDRESS as string)) as unknown as number;

    // Value the bond
    if (isBondLP(bond)) {
      // TS-REFACTOR-TODO: addressForAsset can possibly return null, casted as not null
      const markdown = (await bondCalcContract.markdown(addressForAsset({ bond, networkID })!)) as unknown as number;
      purchased = (await bondCalcContract.valuation(
        addressForAsset({ bond, networkID })!,
        purchased,
      )) as unknown as number;
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
        vestingTerm: terms.vestingTerm as unknown as number,
        maxBondPrice: maxBondPrice / Math.pow(10, 9),
        bondPrice: bondPrice / Math.pow(10, 18),
        marketPrice: marketPrice / Math.pow(10, 9),
      }),
    );
  };

export const calculateUserBondDetails =
  ({
    address,
    bond,
    networkID,
    provider,
  }: {
    address: string;
    bond: string;
    provider: StaticJsonRpcProvider;
    networkID: number;
  }) =>
  async (dispatch: Dispatch) => {
    if (!address) return;

    // Calculate bond details.
    const bondContract = contractForBond({ bond, provider, networkID })!; // TS-REFACTOR-TODO: can possibly be null
    const reserveContract = contractForReserve({ bond, networkID, provider })!; // TS-REFACTOR-TODO: can possibly be null

    let interestDue, pendingPayout, bondMaturationBlock;
    if (bond === BONDS.dai_v1 || bond === BONDS.ohm_frax_v1 || bond === BONDS.ohm_dai_v1) {
      const bondDetails = (await bondContract.bondInfo(address)) as unknown as IOldBondInfo;
      interestDue = (bondDetails.payoutRemaining as unknown as number) / Math.pow(10, 9);
      bondMaturationBlock = +bondDetails.vestingPeriod + +bondDetails.lastBlock;
      pendingPayout = await bondContract.pendingPayoutFor(address);
    } else {
      const bondDetails = await bondContract.bondInfo(address);
      interestDue = (bondDetails.payout as unknown as number) / Math.pow(10, 9);
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
  ({
    value,
    address,
    bond,
    networkID,
    provider,
    slippage,
  }: {
    value: string;
    address: string;
    bond: string;
    networkID: number;
    provider: StaticJsonRpcProvider;
    slippage: number;
  }) =>
  async (dispatch: Dispatch) => {
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005; // 0.5% as default
    const valueInWei = ethers.utils.parseUnits(value.toString(), "ether");

    let balance: BigNumber | string = ""; // TS-REFACTOR-TODO: needs to be set
    // as there is no else clause, so balance may not be set.

    // Calculate maxPremium based on premium and slippage.
    // const calculatePremium = await bonding.calculatePremium();
    const signer = provider.getSigner();
    const bondContract = contractForBond({ bond, provider: signer, networkID })!; // TS-REFACTOR-TODO: can possibly be null
    const calculatePremium = (await bondContract.bondPrice()) as unknown as number;
    const maxPremium = Math.round(calculatePremium * (1 + acceptedSlippage));

    // Deposit the bond
    try {
      const bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress);
      await bondTx.wait();

      const reserveContract = contractForReserve({ bond, provider, networkID })!; // TS-REFACTOR-TODO: can possibly be null

      if (bond === BONDS.ohm_dai || bond === BONDS.ohm_frax) {
        balance = await reserveContract.balanceOf(address);
        balance = ethers.utils.formatEther(balance);
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
    }
  };

export const redeemBond =
  ({
    address,
    bond,
    networkID,
    provider,
    autostake,
  }: {
    autostake: boolean;
    address: string;
    bond: string;
    provider: StaticJsonRpcProvider;
    networkID: number;
  }) =>
  async (dispatch: Dispatch) => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const bondContract = contractForBond({ bond, networkID, provider: signer })! as any; // TS-REFACTOR-TODO: can possibly be null

    try {
      let redeemTx;
      if (bond === BONDS.dai_v1 || bond === BONDS.ohm_dai_v1 || bond === BONDS.ohm_frax_v1) {
        redeemTx = await bondContract.redeem(false); // TS-REFACTOR-TODO: takes two args, but only one is passed.
      } else {
        redeemTx = await bondContract.redeem(address, autostake === true);
      }

      await redeemTx.wait();
    } catch (error) {
      alert(error.message);
    }
  };
