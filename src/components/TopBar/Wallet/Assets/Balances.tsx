import { AssetCard, OHMTokenStackProps } from "@olympusdao/component-library";
import { FC } from "react";
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
}
export interface OHMAssetsProps {
  assets: TokenArray[];
}

/**
 * Component for Displaying Assets
 */
const Balances: FC<OHMAssetsProps> = ({ assets }) => {
  const { data: priceFeed = { usd_24h_change: -0 } } = GetTokenPrice();

  return (
    <>
      {assets
        .filter(asset => Number(asset.balance) > 0 || asset.alwaysShow)
        .map(
          (
            token: TokenArray = {
              label: "",
              assetValue: 0,
            },
            index,
          ) => {
            const lineThree =
              token.lineThreeLabel && token.lineThreeValue
                ? { lineThreeLabel: token.lineThreeLabel, lineThreeValue: token.lineThreeValue }
                : {};
            console.log(token.lineThreeValue, "ineThree");
            const extraProps =
              token.ctaText && token.ctaOnClick ? { ctaText: token.ctaText, ctaOnClick: token.ctaOnClick } : {};
            return (
              <AssetCard
                key={index}
                token={token.symbol}
                label={token.label}
                assetValue={formatCurrency(token.assetValue, 2)}
                assetBalance={`${token.balance} ${token.underlyingSymbol ? token.underlyingSymbol : token.symbol}`}
                pnl={
                  token.pnl
                    ? token.pnl
                    : Number(token.balance) > 0
                    ? formatCurrency(
                        Number(token.balance) === 0 ? 0 : Number(token.balance) * priceFeed.usd_24h_change,
                        2,
                      )
                    : ""
                }
                timeRemaining={token.timeRemaining}
                {...extraProps}
                {...lineThree}
              />
            );
          },
        )}
    </>
  );
};

export default Balances;
