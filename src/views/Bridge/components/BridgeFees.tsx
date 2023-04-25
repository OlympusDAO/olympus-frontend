import { DataRow } from "@olympusdao/component-library";
import { useEstimateSendFee } from "src/hooks/useBridging";
import { formatBalance } from "src/views/Stake/components/StakeArea/components/StakeBalances";
import { useAccount } from "wagmi";

export const BridgeFees = ({ amount, receivingChain }: { amount: string; receivingChain: number }) => {
  const { address } = useAccount();
  const { data: fee, isLoading: feeIsLoading } = useEstimateSendFee({
    destinationChainId: receivingChain,
    recipientAddress: address as string,
    amount,
  });

  return (
    <DataRow
      id="bridge-fees"
      title={`Fees`}
      // isLoading={feeIsLoading}
      balance={fee ? `${formatBalance(fee.nativeFee)} ETH` : `--`}
    />
  );
};
