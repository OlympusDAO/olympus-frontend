import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { formatNumber } from "src/helpers";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";

export const StakeFiveDayYield = () => {
  const { data: rebaseRate } = useStakingRebaseRate();

  const props: PropsOf<typeof DataRow> = { title: t`ROI (5-Day Rate)` };

  if (rebaseRate) {
    const fiveDayRate = (Math.pow(1 + rebaseRate, 5 * 3) - 1) * 100;
    props.balance = `${formatNumber(fiveDayRate, 4)}%`;
  } else props.isLoading = true;

  return <DataRow {...props} />;
};
