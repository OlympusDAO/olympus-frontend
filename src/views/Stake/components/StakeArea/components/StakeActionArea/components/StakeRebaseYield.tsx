import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { formatNumber } from "src/helpers";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";

export const StakeRebaseYield = () => {
  const { data: rebaseRate } = useStakingRebaseRate();

  const props: PropsOf<typeof DataRow> = { title: t`Next Reward Yield` };

  if (rebaseRate) props.balance = `${formatNumber(rebaseRate * 100, 4)}%`;
  else props.isLoading = true;

  return <DataRow {...props} />;
};
