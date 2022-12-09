import { CheckBoxOutlineBlank, CheckBoxOutlined } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { DataRow, PrimaryButton, SwapCard, SwapCollection, TokenStack } from "@olympusdao/component-library";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import {
  BOND_DEPOSITORY_ADDRESSES,
  BOND_FIXED_EXPIRY_TELLER_ADDRESSES,
  BOND_FIXED_TERM_TELLER_ADDRESSES,
  OP_BOND_DEPOSITORY_ADDRESSES,
} from "src/constants/addresses";
import { shorten } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BondDiscount } from "src/views/Bond/components/BondDiscount";
import { BondDuration } from "src/views/Bond/components/BondDuration";
import BondConfirmModal from "src/views/Bond/components/BondModal/components/BondConfirmModal";
import { usePurchaseBond } from "src/views/Bond/components/BondModal/components/BondInputArea/hooks/usePurchaseBond";
import { Bond } from "src/views/Bond/hooks/useBond";
import { useAccount } from "wagmi";

export const BondInputArea: React.VFC<{
  bond: Bond;
  slippage: string;
  recipientAddress: string;
  isInverseBond: boolean;
  handleSettingsOpen: () => void;
}> = props => {
  const { pathname } = useLocation();
  const isInverseBond: boolean = pathname.includes("inverse");

  const { address = "" } = useAccount();
  const networks = useTestableNetworks();

  const currentIndex = useCurrentIndex().data;
  const balance = useBalance(props.bond.quoteToken.addresses)[networks.MAINNET].data;

  const [amount, setAmount] = useState("");
  const [checked, setChecked] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const parsedAmount = new DecimalBigNumber(amount, props.bond.quoteToken.decimals);
  const amountInBaseToken = parsedAmount.div(props.bond.price.inBaseToken, 4);

  const showDisclaimer = new DecimalBigNumber("0").gt(props.bond.discount);
  /**
   * Sets the input to the maximum amount a user can bond.
   * It returns the smallest value of either:
   *  - Total bond capacity
   *  - Max payout for this specific bond interval
   *  - The users balance of the quoteToken
   */
  const setMax = () => {
    if (!balance) return;

    if (props.bond.capacity.inQuoteToken.lt(props.bond.maxPayout.inQuoteToken)) {
      return setAmount(
        props.bond.capacity.inQuoteToken.lt(balance)
          ? props.bond.capacity.inQuoteToken.toString() // Capacity is the smallest
          : balance.toString(),
      );
    }

    setAmount(
      props.bond.maxPayout.inQuoteToken.lt(balance)
        ? props.bond.maxPayout.inQuoteToken.toString() // Payout is the smallest
        : balance.toString(),
    );
  };

  const purchaseBondMutation = usePurchaseBond(props.bond);

  const baseTokenString = `${(props.bond.maxPayout.inBaseToken.lt(props.bond.capacity.inBaseToken)
    ? props.bond.maxPayout.inBaseToken
    : props.bond.capacity.inBaseToken
  ).toString({ decimals: 4, format: true })}${" "}
  ${isInverseBond ? props.bond.baseToken.name : `OHM`}`;

  const quoteTokenString = `
    ${(props.bond.maxPayout.inQuoteToken.lt(props.bond.capacity.inQuoteToken)
      ? props.bond.maxPayout.inQuoteToken
      : props.bond.capacity.inQuoteToken
    ).toString({ decimals: 4, format: true })}${" "}
    ${props.bond.quoteToken.name}`;
  const v3FixedEpiry = props.bond.isV3Bond && !props.bond.isFixedTerm;
  const v2SpenderContract =
    !props.bond.isV3Bond && isInverseBond ? OP_BOND_DEPOSITORY_ADDRESSES : BOND_DEPOSITORY_ADDRESSES;
  const spenderContract = props.bond.isV3Bond
    ? v3FixedEpiry
      ? BOND_FIXED_EXPIRY_TELLER_ADDRESSES
      : BOND_FIXED_TERM_TELLER_ADDRESSES
    : v2SpenderContract;
  //close the confirmation modal after transaction.
  if (purchaseBondMutation.isSuccess) {
    purchaseBondMutation.reset();
    setConfirmOpen(false);
  }

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
        <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
          <Box mb="21px">
            <SwapCollection
              UpperSwapCard={
                <SwapCard
                  id="from"
                  token={<TokenStack tokens={props.bond.quoteToken.icons} sx={{ fontSize: "21px" }} />}
                  tokenName={props.bond.quoteToken.name}
                  info={`${balance?.toString({ decimals: 4, format: true, trim: true }) || "0.00"} ${
                    props.bond.quoteToken.name
                  }`}
                  endString="Max"
                  endStringOnClick={setMax}
                  value={amount}
                  onChange={event => setAmount(event.currentTarget.value)}
                  inputProps={{ "data-testid": "fromInput" }}
                />
              }
              LowerSwapCard={
                <SwapCard
                  id="to"
                  token={<TokenStack tokens={props.bond.baseToken.icons} sx={{ fontSize: "21px" }} />}
                  tokenName={props.bond.baseToken.name}
                  value={amountInBaseToken.toString()}
                  inputProps={{ "data-testid": "toInput" }}
                />
              }
            />
          </Box>
          <WalletConnectedGuard fullWidth>
            <TokenAllowanceGuard
              isVertical
              tokenAddressMap={props.bond.quoteToken.addresses}
              spenderAddressMap={spenderContract}
              approvalText={`Approve ${props.bond.quoteToken.name} to Bond`}
              message={
                <>
                  First time bonding <b>{props.bond.quoteToken.name}</b>? <br /> Please approve Olympus DAO to use your{" "}
                  <b>{props.bond.quoteToken.name}</b> for bonding.
                </>
              }
            >
              {showDisclaimer && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={event => setChecked(event.target.checked)}
                      icon={<CheckBoxOutlineBlank viewBox="0 0 24 24" />}
                      checkedIcon={<CheckBoxOutlined viewBox="0 0 24 24" />}
                    />
                  }
                  label={
                    isInverseBond
                      ? `I understand that I'm buying a negative premium bond`
                      : `I understand that I'm buying a negative discount bond`
                  }
                />
              )}
              <PrimaryButton
                fullWidth
                disabled={props.bond.isSoldOut || purchaseBondMutation.isLoading || (showDisclaimer && !checked)}
                onClick={() => setConfirmOpen(true)}
              >
                {purchaseBondMutation.isLoading ? "Bonding..." : "Bond"}
              </PrimaryButton>
            </TokenAllowanceGuard>
          </WalletConnectedGuard>
          <Box mt="24px">
            <DataRow
              title={`You Will Get`}
              balance={
                <span>
                  {amountInBaseToken.toString({ decimals: 4, format: true, trim: true })}{" "}
                  {isInverseBond ? props.bond.baseToken.name : `OHM`}{" "}
                  {!isInverseBond && !!currentIndex && (
                    <span>
                      (≈{amountInBaseToken.div(currentIndex).toString({ decimals: 4, format: true, trim: false })} gOHM)
                    </span>
                  )}
                </span>
              }
              tooltip={`The total amount of payout asset you will recieve from this bond purchase. (OHM quantity will be higher due to rebasing)`}
            />

            <DataRow
              title={isInverseBond ? `Max You Can Sell` : `Max You Can Buy`}
              tooltip={`The maximum quantity of payout token we are able to offer via bonds at this moment in time.`}
              balance={
                <span>
                  {isInverseBond
                    ? `${quoteTokenString} (≈${baseTokenString})`
                    : props.bond.baseToken === props.bond.quoteToken
                    ? `${baseTokenString}`
                    : `${baseTokenString} (≈${quoteTokenString})`}
                </span>
              }
            />

            <DataRow
              title={isInverseBond ? `Premium` : `Discount`}
              balance={<BondDiscount discount={props.bond.discount} textOnly />}
              tooltip={`Negative discount is bad (you pay more than the market value). The bond discount is the percentage difference between ${
                isInverseBond ? props.bond.baseToken.name : `OHM`
              }'s market value and the bond's price.`}
            />

            <DataRow
              title={`Vesting Term`}
              balance={<BondDuration duration={props.bond.duration} />}
              tooltip={`The duration of the Bond whereby the bond can be claimed in it's entirety.  Bonds are no longer vested linearly and are locked for entire duration.`}
            />

            {props.recipientAddress !== address && (
              <DataRow title={`Recipient`} balance={shorten(props.recipientAddress)} />
            )}
          </Box>
        </Box>
      </Box>
      <BondConfirmModal
        bond={props.bond}
        slippage={props.slippage}
        recipientAddress={props.recipientAddress}
        spendAmount={amount}
        receiveAmount={amountInBaseToken.toString({ decimals: 4, format: true, trim: true })}
        onSubmit={() =>
          purchaseBondMutation.mutate({
            amount,
            isInverseBond,
            slippage: props.slippage,
            recipientAddress: props.recipientAddress,
          })
        }
        handleSettingsOpen={props.handleSettingsOpen}
        isOpen={confirmOpen}
        handleConfirmClose={() => setConfirmOpen(false)}
        disabled={purchaseBondMutation.isLoading}
      />
    </Box>
  );
};

interface StakeFormElement extends HTMLFormElement {
  elements: HTMLFormControlsCollection & { amount: HTMLInputElement };
}
