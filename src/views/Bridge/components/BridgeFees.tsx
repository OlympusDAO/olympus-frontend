import { styled } from "@mui/material/styles";
import { DataRow } from "@olympusdao/component-library";
import { BRIDGE_CHAINS } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useEstimateSendFee, useEstimateSolanaBridgeFee } from "src/hooks/useBridging";
import { NetworkId } from "src/networkDetails";
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
  const solanaFeeQuery = useEstimateSolanaBridgeFee({ solanaAddress: recipientAddress, amount });
  const evmFeeQuery = useEstimateSendFee({ destinationChainId: receivingChain, recipientAddress, amount });
  const isSolanaDestination = receivingChain === NetworkId.SOLANA || receivingChain === NetworkId.SOLANA_DEVNET;
  const feeQuery = isSolanaDestination ? solanaFeeQuery : evmFeeQuery;
  const fee = feeQuery.data;
  const nativeFee = isSolanaDestination
    ? fee && typeof fee === "object" && isSolanaDestination
      ? fee
      : new DecimalBigNumber("0")
    : fee && typeof fee === "object" && "nativeFee" in fee && fee.nativeFee
      ? fee.nativeFee
      : new DecimalBigNumber("0");
  const gasFee =
    fee && typeof fee === "object" && "gasFee" in fee && fee.gasFee ? fee.gasFee : new DecimalBigNumber("0");
  const totalFees = nativeFee.add(gasFee);

  return (
    <>
      {!!gasFee?.gt("0") && (
        <StyledDataRow
          id="bridging-chain-fees"
          title={`${BRIDGE_CHAINS[chain.id as keyof typeof BRIDGE_CHAINS]?.name} Est. Gas Fees`}
          balance={
            gasFee instanceof DecimalBigNumber ? `${formatBalance(gasFee)} ${chain?.nativeCurrency?.symbol}` : `--`
          }
        />
      )}
      <StyledDataRow
        id="receiving-chain-fees"
        tooltip="Paid on source chain. Used to cover the gas on the receiving chain."
        title={`${BRIDGE_CHAINS[receivingChain as keyof typeof BRIDGE_CHAINS]?.name} Bridge Fees`}
        balance={
          nativeFee instanceof DecimalBigNumber && nativeFee.gt("0")
            ? `${formatBalance(nativeFee)} ${chain?.nativeCurrency?.symbol}`
            : `--`
        }
      />
      {gasFee instanceof DecimalBigNumber &&
        gasFee.gt("0") &&
        nativeFee instanceof DecimalBigNumber &&
        nativeFee.gt("0") && (
          <StyledDataRow
            id="total-fees"
            title={`Total Est. Fees`}
            balance={
              totalFees instanceof DecimalBigNumber && totalFees.gt("0")
                ? `${formatBalance(totalFees)} ${chain?.nativeCurrency?.symbol}`
                : `--`
            }
          />
        )}
    </>
  );
};
