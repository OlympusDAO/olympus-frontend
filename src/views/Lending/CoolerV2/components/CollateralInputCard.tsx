import { Token } from "@olympusdao/component-library";
import { SwapCard } from "@olympusdao/component-library";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useMonoCoolerPosition } from "src/views/Lending/CoolerV2/hooks/useMonoCoolerPosition";

interface CollateralInputCardProps {
  isRepayMode: boolean;
  collateralAmount: DecimalBigNumber;
  collateralToBeReleased: DecimalBigNumber;
  onCollateralChange: (value: DecimalBigNumber) => void;
  onCollateralInputChange?: (value: DecimalBigNumber) => void;
  disabled?: boolean;
  currentDebt?: DecimalBigNumber;
}

export const CollateralInputCard = ({
  isRepayMode,
  collateralAmount,
  collateralToBeReleased,
  onCollateralChange,
  onCollateralInputChange,
  disabled,
  currentDebt,
}: CollateralInputCardProps) => {
  const networks = useTestableNetworks();
  const { data: position } = useMonoCoolerPosition();
  const { data: collateralBalance } = useBalance({ [networks.MAINNET_SEPOLIA]: position?.collateralAddress || "" })[
    networks.MAINNET_SEPOLIA
  ];

  const hasDebt = currentDebt && !currentDebt.eq(new DecimalBigNumber("0", 18));
  const showCollateralToBeReleased = isRepayMode && hasDebt;
  const totalCollateral = position?.collateral ? new DecimalBigNumber(position.collateral, 18) : undefined;

  const handleCollateralChange = (value: DecimalBigNumber) => {
    if (isRepayMode && totalCollateral && value.gt(totalCollateral)) {
      value = totalCollateral;
    }
    onCollateralChange(value);
    onCollateralInputChange?.(value);
  };

  return (
    <SwapCard
      id="collateral-input"
      token={<Token name="gOHM" sx={{ width: "21px", height: "21px" }} />}
      tokenName="gOHM"
      value={showCollateralToBeReleased ? collateralToBeReleased.toString() : collateralAmount.toString()}
      onChange={e => {
        const value = new DecimalBigNumber(e.target.value, 18);
        if (!showCollateralToBeReleased) {
          handleCollateralChange(value);
        }
      }}
      info={
        showCollateralToBeReleased
          ? "Collateral to be Released"
          : `Balance: ${collateralBalance?.toString({ decimals: 4 }) || "0"} gOHM`
      }
      endString={showCollateralToBeReleased ? undefined : "Max"}
      endStringOnClick={() => {
        if (!showCollateralToBeReleased) {
          if (isRepayMode && totalCollateral) {
            handleCollateralChange(totalCollateral);
          } else {
            collateralBalance && handleCollateralChange(collateralBalance);
          }
        }
      }}
      inputProps={{
        "data-testid": "collateral-input",
        disabled: showCollateralToBeReleased || disabled,
      }}
    />
  );
};
