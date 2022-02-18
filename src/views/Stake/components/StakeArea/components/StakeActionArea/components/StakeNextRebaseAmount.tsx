import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { formatNumber, parseBigNumber } from "src/helpers";
import { useSohmBalance } from "src/hooks/useBalance";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

export const StakeNextRebaseAmount = () => {
  const networks = useTestableNetworks();
  const { data: rebaseRate } = useStakingRebaseRate();

  const sohmBalances = useSohmBalance();
  const sohmBalance = sohmBalances[networks.MAINNET].data;

  const props: PropsOf<typeof DataRow> = { title: t`Next Reward Amount` };

  if (rebaseRate && sohmBalance) {
    const nextRewardAmount = rebaseRate * parseBigNumber(sohmBalance);
    props.balance = `${formatNumber(nextRewardAmount, 4)} sOHM`;
  } else props.isLoading = true;

  return <DataRow {...props} />;
};
