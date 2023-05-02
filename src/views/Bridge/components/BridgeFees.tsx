import { styled } from "@mui/material/styles";
import { DataRow } from "@olympusdao/component-library";
import { useEstimateSendFee } from "src/hooks/useBridging";
import { formatBalance } from "src/views/Stake/components/StakeArea/components/StakeBalances";
import { useAccount } from "wagmi";

const StyledDataRow = styled(DataRow)({
  margin: "1rem", // not actually doing anything without a component library change to add a className prop
});

export const BridgeFees = ({ amount, receivingChain }: { amount: string; receivingChain: number }) => {
  const { address } = useAccount();
  const { data: fee, isLoading: feeIsLoading } = useEstimateSendFee({
    destinationChainId: receivingChain,
    recipientAddress: address as string,
    amount,
  });

  return (
    <>
      <StyledDataRow
        id="bridge-gas-fees"
        title={`Est. Gas Fees`}
        // isLoading={feeIsLoading}
        balance={!!fee?.gasFee ? `${formatBalance(fee.gasFee)} ETH` : `--`}
      />
      <StyledDataRow
        id="bridge-fees"
        title={`Bridge Fees`}
        // isLoading={feeIsLoading}
        balance={!!fee?.nativeFee ? `${formatBalance(fee.nativeFee)} ETH` : `--`}
      />
    </>
  );
};
