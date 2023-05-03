import { styled } from "@mui/material/styles";
import { DataRow } from "@olympusdao/component-library";
import { BRIDGE_CHAINS } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useEstimateSendFee } from "src/hooks/useBridging";
import { formatBalance } from "src/views/Stake/components/StakeArea/components/StakeBalances";
import { useAccount, useNetwork } from "wagmi";

const StyledDataRow = styled(DataRow)({
  margin: "1rem", // not actually doing anything without a component library change to add a className prop
});

export const BridgeFees = ({ amount, receivingChain }: { amount: string; receivingChain: number }) => {
  const { address } = useAccount();
  const { chain = { id: 1 } } = useNetwork();
  const { data: fee, isLoading: feeIsLoading } = useEstimateSendFee({
    destinationChainId: receivingChain,
    recipientAddress: address as string,
    amount,
  });
  const totalFees = (fee?.nativeFee || new DecimalBigNumber("0")).add(fee?.gasFee || new DecimalBigNumber("0"));

  return (
    <>
      <StyledDataRow
        id="bridging-chain-fees"
        title={`${BRIDGE_CHAINS[chain.id as keyof typeof BRIDGE_CHAINS].name} Est. Gas Fees`}
        // isLoading={feeIsLoading}
        balance={!!fee?.gasFee ? `${formatBalance(fee.gasFee)} ETH` : `--`}
      />
      <StyledDataRow
        id="receiving-chain-fees"
        title={`${BRIDGE_CHAINS[receivingChain as keyof typeof BRIDGE_CHAINS].name} Gas Fees`}
        // isLoading={feeIsLoading}
        balance={!!fee?.nativeFee ? `${formatBalance(fee.nativeFee)} ETH` : `--`}
      />
      <StyledDataRow
        id="total-fees"
        title={`Total Est. Gas Fees`}
        // isLoading={feeIsLoading}
        balance={totalFees.gt("0") ? `${formatBalance(totalFees)} ETH` : `--`}
      />
    </>
  );
};
