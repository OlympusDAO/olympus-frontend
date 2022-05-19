import { Dispatch, SetStateAction } from "react";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";
import {
  useFuseBalance,
  useGohmBalance,
  useGohmTokemakBalance,
  useOhmBalance,
  useSohmBalance,
} from "src/hooks/useBalance";
import { useOldAssetsDetected } from "src/hooks/useOldAssetsDetected";
import { useOldAssetsEnoughToMigrate } from "src/hooks/useOldAssetsEnoughToMigrate";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { Stake, V1Stake } from "src/views";

export const StakeVersionContainer: React.FC<{ setMigrationModalOpen: Dispatch<SetStateAction<boolean>> }> = props => {
  const oldAssetsDetected = useOldAssetsDetected();
  const oldAssetsEnoughToMigrate = useOldAssetsEnoughToMigrate();

  const networks = useTestableNetworks();
  const { data: sOhmBalance = new DecimalBigNumber("0", 9) } = useSohmBalance()[networks.MAINNET];
  const { data: ohmBalance = new DecimalBigNumber("0", 9) } = useOhmBalance()[networks.MAINNET];
  const gohmBalances = useGohmBalance();
  const { data: gohmFuseBalance = new DecimalBigNumber("0", 18) } = useFuseBalance()[NetworkId.MAINNET];
  const { data: gohmTokemakBalance = new DecimalBigNumber("0", 18) } = useGohmTokemakBalance()[NetworkId.MAINNET];
  const gohmTokens = [
    gohmFuseBalance,
    gohmTokemakBalance,
    gohmBalances[networks.MAINNET].data,
    gohmBalances[NetworkId.ARBITRUM].data,
    gohmBalances[NetworkId.AVALANCHE].data,
    gohmBalances[NetworkId.POLYGON].data,
    gohmBalances[NetworkId.FANTOM].data,
    gohmBalances[NetworkId.OPTIMISM].data,
  ];
  const totalGohmBalance = gohmTokens
    .filter(nonNullable)
    .reduce((res, bal) => res.add(bal), new DecimalBigNumber("0", 18));
  const newAssetsDetected = Number(totalGohmBalance) || Number(sOhmBalance) || Number(ohmBalance);

  if (newAssetsDetected || (!newAssetsDetected && !oldAssetsDetected) || !oldAssetsEnoughToMigrate) return <Stake />;

  return <V1Stake setMigrationModalOpen={props.setMigrationModalOpen} />;
};
