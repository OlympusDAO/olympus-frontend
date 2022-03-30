import { t, Trans } from "@lingui/macro";
import { Box, FormControl, Typography } from "@material-ui/core";
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
import { BondInfoText } from "../../../BondInfoText";

export const BondInputArea: React.VFC<{ bond: Bond; slippage: number; recipientAddress: string }> = props => {
  const { pathname } = useLocation();
  const isInverseBond = pathname.includes("inverse");

  const { address } = useWeb3Context();
  const networks = useTestableNetworks();

  const currentIndex = useCurrentIndex().data;
  const info = useBondData(props.bond).data;

  const [amount, setAmount] = useState("");
  const balance = useBalance(props.bond.quoteToken.addresses)[networks.MAINNET].data;
  const setMax = () => balance && setAmount(balance.toAccurateString());

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        <WalletConnectedGuard message="Please connect your wallet to purchase bonds">
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
            <FormControl className="ohm-input" fullWidth>
              <Input
                type="number"
                labelWidth={55}
                value={amount}
                endString={t`Max`}
                placeholder={t`Amount`}
                endStringOnClick={setMax}
                id="outlined-adornment-amount"
                onChange={event => setAmount(event.currentTarget.value)}
              />
            </FormControl>

            <PrimaryButton
              id="bond-btn"
              className="transaction-button"
              onClick={() => {
                //
              }}
            >
              Bond
            </PrimaryButton>
          </TokenAllowanceGuard>
        </WalletConnectedGuard>
      </Box>

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
            `${new DecimalBigNumber(amount, props.bond.quoteToken.decimals).toFormattedString(4)} ` +
            `sOHM (≈${new DecimalBigNumber(amount, props.bond.quoteToken.decimals)
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
              {info?.maxPayout.inBaseToken.toFormattedString(4)} sOHM (≈
              {info?.maxPayout.inQuoteToken.toFormattedString(4)} {props.bond.quoteToken.name})
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

      <div className="help-text">
        <Typography variant="body2">
          <BondInfoText isInverseBond={isInverseBond} />
        </Typography>
      </div>
    </Box>
  );
};
