import { t, Trans } from "@lingui/macro";
import { Box } from "@material-ui/core";
import { DataRow, Input, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { BOND_DEPOSITORY_CONTRACT } from "src/constants/contracts";
import { shorten } from "src/helpers";
import { Bond } from "src/helpers/bonds/Bond";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useWeb3Context } from "src/hooks/web3Context";
import { useBondData } from "src/views/Bond/hooks/useBondData";

import { BondDiscount } from "../../../BondDiscount";
import { BondDuration } from "../../../BondDuration";
import { usePurchaseBond } from "./hooks/usePurchaseBond";

export const BondInputArea: React.VFC<{ bond: Bond; slippage: string; recipientAddress: string }> = props => {
  const { pathname } = useLocation();
  const isInverseBond: boolean = pathname.includes("inverse");

  const { address } = useWeb3Context();
  const networks = useTestableNetworks();

  const info = useBondData(props.bond).data;
  const currentIndex = useCurrentIndex().data;
  const balance = useBalance(props.bond.quoteToken.addresses)[networks.MAINNET].data;

  const [amount, setAmount] = useState("");
  const parsedAmount = new DecimalBigNumber(amount, props.bond.quoteToken.decimals);
  const amountInBaseToken = parsedAmount.div(info?.price.inBaseToken || new DecimalBigNumber("1", 0), 4);
  const setMax = () => balance && setAmount(balance.toAccurateString());

  const purchaseBondMutation = usePurchaseBond(props.bond);
  const handleSubmit = (event: React.FormEvent<StakeFormElement>) => {
    event.preventDefault();
    // TODO: If bond has existing unclaimed rewards
    const amount = event.currentTarget.elements["amount"].value;
    purchaseBondMutation.mutate({ amount, slippage: props.slippage, recipientAddress: props.recipientAddress });
  };

  return (
    <Box display="flex" flexDirection="column">
      <WalletConnectedGuard message="Please connect your wallet to purchase bonds">
        <form onSubmit={handleSubmit}>
          <Box display="flex" justifyContent="center">
            <Box display="flex" flexDirection="column" width="60%">
              <TokenAllowanceGuard
                isVertical
                tokenAddressMap={props.bond.quoteToken.addresses}
                spenderAddressMap={BOND_DEPOSITORY_CONTRACT.addresses}
                message={
                  <>
                    <Trans>First time bonding</Trans> <b>{props.bond.quoteToken.name}</b>? <br />{" "}
                    <Trans>Please approve Olympus DAO to use your</Trans> <b>{props.bond.quoteToken.name}</b>{" "}
                    <Trans>for bonding</Trans>.
                  </>
                }
              >
                <Input
                  type="string"
                  name="amount"
                  value={amount}
                  endString={t`Max`}
                  endStringOnClick={setMax}
                  id="outlined-adornment-amount"
                  onChange={event => setAmount(event.currentTarget.value)}
                  placeholder={t`Enter an amount of` + ` ${props.bond.quoteToken.name}`}
                />

                <Box mt="8px">
                  <PrimaryButton
                    fullWidth
                    className=""
                    type="submit"
                    disabled={info?.isSoldOut || purchaseBondMutation.isLoading}
                  >
                    {purchaseBondMutation.isLoading ? "Bonding..." : "Bond"}
                  </PrimaryButton>
                </Box>
              </TokenAllowanceGuard>
            </Box>
          </Box>
        </form>
      </WalletConnectedGuard>

      <Box className="bond-data">
        <DataRow
          isLoading={!balance}
          title={t`Your Balance`}
          balance={`${balance?.toFormattedString(4)} ${props.bond.quoteToken.name}`}
        />

        <DataRow
          isLoading={!info}
          title={t`You Will Get`}
          balance={
            `${amountInBaseToken.toFormattedString(4)} ` +
            `sOHM (≈${amountInBaseToken
              .div(currentIndex || new DecimalBigNumber("1", 0), 4)
              .toFormattedString(4)} gOHM)`
          }
          tooltip={t`The total amount of payout asset you will recieve from this bond purchase. (sOHM quantity will be higher due to rebasing)`}
        />

        <DataRow
          isLoading={!info}
          title={t`Max You Can Buy`}
          tooltip={t`The maximum quantity of payout token we are able to offer via bonds at this moment in time.`}
          balance={
            <span>
              {(info?.maxPayout.inBaseToken.gt(info?.capacity.inBaseToken)
                ? info?.capacity.inBaseToken
                : info?.maxPayout.inBaseToken
              )?.toFormattedString(4)}{" "}
              sOHM (≈
              {(info?.maxPayout.inQuoteToken.gt(info?.capacity.inQuoteToken)
                ? info?.capacity.inQuoteToken
                : info?.maxPayout.inQuoteToken
              )?.toFormattedString(4)}{" "}
              {props.bond.quoteToken.name})
            </span>
          }
        />

        <DataRow
          isLoading={!info}
          title={t`Discount`}
          balance={<BondDiscount discount={info?.discount} />}
          tooltip={t`Negative discount is bad (you pay more than the market value). The bond discount is the percentage difference between OHM's market value and the bond's price.`}
        />

        {!isInverseBond && (
          <DataRow
            isLoading={!info}
            title={t`Duration`}
            balance={<BondDuration duration={info?.duration} />}
            tooltip={t`The duration of the Bond whereby the bond can be claimed in it’s entirety.  Bonds are no longer vested linearly and are locked for entire duration.`}
          />
        )}

        {props.recipientAddress !== address && (
          <DataRow title={t`Recipient`} balance={shorten(props.recipientAddress)} isLoading={!info} />
        )}
      </Box>
    </Box>
  );
};

interface StakeFormElement extends HTMLFormElement {
  elements: HTMLFormControlsCollection & { amount: HTMLInputElement };
}
