import { AssetCard, OHMTokenStackProps } from "@olympusdao/component-library";
import { formatCurrency } from "src/helpers";

import { GetTokenPrice } from "../queries";

interface TokenArray {
  assetValue: number;
  symbol?: OHMTokenStackProps["tokens"];
  balance?: string;
  label?: string;
  timeRemaining?: string;
  underlyingSymbol?: string;
  pnl?: string | number;
  alwaysShow?: boolean;
  ctaOnClick?: () => void;
  ctaText?: string;
  lineThreeValue?: string | number;
  lineThreeLabel?: string;
  geckoTicker?: string;
}
/**
 * Component for Displaying Assets
 */
const Balances = (props: { token: TokenArray }) => {
  const { data: priceFeed = { usd_24h_change: -0 } } = GetTokenPrice(props.token.geckoTicker);
  const lineThree =
    props.token.lineThreeLabel && props.token.lineThreeValue
      ? { lineThreeLabel: props.token.lineThreeLabel, lineThreeValue: props.token.lineThreeValue }
      : {};
  const extraProps =
    props.token.ctaText && props.token.ctaOnClick
      ? { ctaText: props.token.ctaText, ctaOnClick: props.token.ctaOnClick }
      : {};
  if (Number(props.token.balance) > 0 || props.token.alwaysShow) {
    return (
      <AssetCard
        token={props.token.symbol}
        label={props.token.label}
        assetValue={formatCurrency(props.token.assetValue, 2)}
        assetBalance={`${props.token.balance} ${
          props.token.underlyingSymbol ? props.token.underlyingSymbol : props.token.symbol
        }`}
        pnl={
          props.token.pnl
            ? props.token.pnl
            : Number(props.token.balance) > 0
            ? formatCurrency(
                Number(props.token.balance) === 0
                  ? 0
                  : props.token.assetValue - Number(props.token.assetValue) / (1 + priceFeed.usd_24h_change / 100),
                2,
              )
            : ""
        }
        timeRemaining={props.token.timeRemaining}
        {...extraProps}
        {...lineThree}
      />
    );
  }
  return <> </>;
};

export default Balances;
