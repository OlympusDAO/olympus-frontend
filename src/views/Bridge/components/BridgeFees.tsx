import { styled } from "@mui/material/styles";
import { DataRow } from "@olympusdao/component-library";
import { BRIDGE_CHAINS } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useEstimateSendFee } from "src/hooks/useBridging";
import { formatBalance } from "src/views/Stake/components/StakeArea/components/StakeBalances";
import { useNetwork } from "wagmi";

const StyledDataRow = styled(DataRow)({
  margin: "1rem", // not actually doing anything without a component library change to add a className prop
});

export const BridgeFees = ({
  amount,
  receivingChain,
  recipientAddress,
}: {
  amount: string;
  receivingChain: number;
  recipientAddress: string;
}) => {
  const { chain = { id: 1, nativeCurrency: { symbol: "ETH" } } } = useNetwork();
  const { data: fee, isLoading: feeIsLoading } = useEstimateSendFee({
    destinationChainId: receivingChain,
    recipientAddress,
    amount,
  });

  const totalFees = (fee?.nativeFee || new DecimalBigNumber("0")).add(fee?.gasFee || new DecimalBigNumber("0"));

  return (
    <>
      {!!fee?.gasFee && (
        <StyledDataRow
          id="bridging-chain-fees"
          title={`${BRIDGE_CHAINS[chain.id as keyof typeof BRIDGE_CHAINS].name} Est. Gas Fees`}
          balance={`${formatBalance(fee.gasFee)} ${chain?.nativeCurrency?.symbol}`}
        />
      )}
      <StyledDataRow
        id="receiving-chain-fees"
        tooltip="Paid on source chain. Used to cover the gas on the receiving chain."
        title={`${BRIDGE_CHAINS[receivingChain as keyof typeof BRIDGE_CHAINS].name} Bridge Fees`}
        balance={!!fee?.nativeFee ? `${formatBalance(fee.nativeFee)} ${chain?.nativeCurrency?.symbol}` : `--`}
      />
      {!!fee?.gasFee && !!fee?.nativeFee && (
        <StyledDataRow
          id="total-fees"
          title={`Total Est. Fees`}
          balance={totalFees.gt("0") ? `${formatBalance(totalFees)} ${chain?.nativeCurrency?.symbol}` : `--`}
        />
      )}
    </>
  );
};
