import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { convertGohmToOhm, formatNumber, parseBigNumber } from "src/helpers";
import { useGohmBalance, useSohmBalance } from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

export const StakeNextRebaseAmount = () => {
  const networks = useTestableNetworks();
  const { data: currentIndex } = useCurrentIndex();
  const { data: rebaseRate } = useStakingRebaseRate();

  const gohmBalances = useGohmBalance();
  const sohmBalances = useSohmBalance();
  const gohmBalance = gohmBalances[networks.MAINNET].data;
  const sohmBalance = sohmBalances[networks.MAINNET].data;

  const props: PropsOf<typeof DataRow> = { title: t`Next Reward Amount` };

  if (rebaseRate && sohmBalance && gohmBalance && currentIndex) {
    const gohmBalanceAsSohm = convertGohmToOhm(gohmBalance, currentIndex);

    const totalSohmBalance = parseBigNumber(gohmBalanceAsSohm, 18) + parseBigNumber(sohmBalance);

    const nextRewardAmount = rebaseRate * totalSohmBalance;
    props.balance = `${formatNumber(nextRewardAmount, 4)} sOHM`;
  } else props.isLoading = true;

  return <DataRow {...props} />;
};
