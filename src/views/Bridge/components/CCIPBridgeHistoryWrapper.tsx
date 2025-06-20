import { Paper } from "@olympusdao/component-library";
import { useCCIPBridgeHistory } from "src/hooks/useCCIPBridgeHistory";
import { CCIPBridgeHistory } from "src/views/Bridge/components/CCIPBridgeHistory";

interface CCIPBridgeHistoryWrapperProps {
  sendingChain: number;
  receivingChain: number;
  isSmallScreen: boolean;
  isCCIPBridge: boolean;
}

export const CCIPBridgeHistoryWrapper = ({
  sendingChain,
  receivingChain,
  isSmallScreen,
  isCCIPBridge,
}: CCIPBridgeHistoryWrapperProps) => {
  // This hook is now called within the wallet provider context
  const { data: ccipTransferEvents } = useCCIPBridgeHistory({
    sendingChain,
    receivingChain,
  });

  if (!isCCIPBridge) {
    return null;
  }

  return (
    <Paper headerText="CCIP Bridging History">
      <CCIPBridgeHistory isSmallScreen={isSmallScreen} txs={ccipTransferEvents || []} />
    </Paper>
  );
};
