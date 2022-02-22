import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { convertGohmToOhm, formatNumber } from "src/helpers";
import { useGohmBalance, useSohmBalance } from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

export const StakeNextRebaseAmount = () => {
  const networks = useTestableNetworks();
  const { data: currentIndex } = useCurrentIndex();
  const { data: rebaseRate } = useStakingRebaseRate();

  const gohmBalance = useGohmBalance()[networks.MAINNET].data;
  const sohmBalance = useSohmBalance()[networks.MAINNET].data;

  const props: PropsOf<typeof DataRow> = { title: t`Next Reward Amount` };

  if (rebaseRate && sohmBalance && gohmBalance && currentIndex) {
    const totalSohmBalance = convertGohmToOhm(gohmBalance, currentIndex).add(sohmBalance);

    const nextRewardAmount = rebaseRate * totalSohmBalance.toApproxNumber();
    props.balance = `${formatNumber(nextRewardAmount, 4)} sOHM`;
  } else props.isLoading = true;

  return <DataRow {...props} />;
};
