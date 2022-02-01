import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { NetworkId } from "src/constants";
import { formatNumber, parseBigNumber } from "src/helpers";
import { useSohmBalance } from "src/hooks/useBalances";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";

export const StakeNextRebaseAmount = () => {
  const { data: sohmBalance } = useSohmBalance();
  const { data: rebaseRate } = useStakingRebaseRate();

  const props: PropsOf<typeof DataRow> = { title: t`Next Reward Amount` };

  if (rebaseRate && sohmBalance) {
    const nextRewardAmount = rebaseRate * parseBigNumber(sohmBalance[NetworkId.MAINNET]);
    props.balance = `${formatNumber(nextRewardAmount, 4)} sOHM`;
  } else props.isLoading = true;

  return <DataRow {...props} />;
};
