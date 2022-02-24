import { t } from "@lingui/macro";
import { DataRow } from "@olympusdao/component-library";
import { BigNumber } from "ethers";
import { convertGohmToOhm, formatNumber, nonNullable, parseBigNumber } from "src/helpers";
import {
  useFuseBalance,
  useGohmBalance,
  useGohmTokemakBalance,
  useSohmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";

export const StakeNextRebaseAmount = () => {
  const { data: rebaseRate } = useStakingRebaseRate();

  const sohmBalances = useSohmBalance();
  const gohmBalances = useGohmBalance();
  const wsohmBalances = useWsohmBalance();
  const v1sohmBalances = useV1SohmBalance();
  const gohmFuseBalances = useFuseBalance();
  const gohmTokemakBalances = useGohmTokemakBalance();

  const networks = useTestableNetworks();
  const { data: currentIndex } = useCurrentIndex();

  const sohmTokens = [sohmBalances[networks.MAINNET].data, v1sohmBalances[networks.MAINNET].data];
  const totalSohmBalance = sohmTokens.filter(nonNullable).reduce((res, bal) => res.add(bal), BigNumber.from(0));

  const gohmTokens = [
    gohmBalances[networks.MAINNET].data,
    gohmBalances[NetworkId.ARBITRUM].data,
    gohmBalances[NetworkId.AVALANCHE].data,
    gohmBalances[NetworkId.POLYGON].data,
    gohmBalances[NetworkId.FANTOM].data,
    wsohmBalances[NetworkId.MAINNET].data,
    wsohmBalances[NetworkId.ARBITRUM].data,
    wsohmBalances[NetworkId.AVALANCHE].data,
    gohmFuseBalances[NetworkId.MAINNET].data,
    gohmTokemakBalances[NetworkId.MAINNET].data,
  ];
  const totalGohmBalance = gohmTokens.filter(nonNullable).reduce((res, bal) => res.add(bal), BigNumber.from(0));

  const props: PropsOf<typeof DataRow> = { title: t`Next Reward Amount` };

  if (rebaseRate && sohmBalances && totalGohmBalance && currentIndex) {
    const gohmBalanceAsSohm = convertGohmToOhm(totalGohmBalance, currentIndex);

    const totalCombinedBalance = parseBigNumber(gohmBalanceAsSohm, 18) + parseBigNumber(totalSohmBalance);

    const nextRewardAmount = rebaseRate * totalCombinedBalance;
    props.balance = `${formatNumber(nextRewardAmount, 4)} sOHM`;
  } else props.isLoading = true;

  return <DataRow {...props} />;
};
