import { Box, Typography, useTheme } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import { BRIDGE_CHAINS } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";
import { useBridgeableChains } from "src/views/Bridge/helpers";

export const ChainPickerModal = ({
  isOpen,
  receivingChain,
  setReceivingChain,
  handleConfirmClose,
}: {
  isOpen: boolean;
  receivingChain: NetworkId;
  setReceivingChain: React.Dispatch<React.SetStateAction<number>>;
  handleConfirmClose: () => void;
}) => {
  const { data: chainDefaults, isInvalid } = useBridgeableChains();
  console.log("chainDefaults", chainDefaults);
  const chainIds = chainDefaults?.availableChains || [1];
  console.log("chainIds", chainIds);

  const theme = useTheme();
  const handleSelection = (e: React.MouseEvent, chainId: NetworkId) => {
    e.preventDefault();
    setReceivingChain(chainId);
    handleConfirmClose();
  };

  return (
    <Modal
      maxWidth="476px"
      minHeight="200px"
      open={isOpen}
      headerContent={
        <Box display="flex" flexDirection="row">
          <Typography variant="h4" sx={{ marginLeft: "6px" }}>
            Choose Destination Chain
          </Typography>
        </Box>
      }
      onClose={handleConfirmClose}
    >
      <>
        <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="start" gap={0}>
          {chainIds.map(chainId => {
            const chain = BRIDGE_CHAINS[chainId as keyof typeof BRIDGE_CHAINS];
            const selected = receivingChain === chainId;
            return (
              <Box
                key={chainId}
                onClick={e => handleSelection(e, chainId)}
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={1}
                sx={{
                  padding: "1rem",
                  height: "3rem",
                  width: "100%",
                  backgroundColor: selected ? theme.colors.gray[500] : ``,
                }}
              >
                <div
                  style={{
                    background: chain.iconBackground,
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  {chain.iconUrl && (
                    <img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} style={{ width: 24, height: 24 }} />
                  )}
                </div>
                <Typography variant="body1" sx={{ fontWeight: "400" }}>
                  {chain.name && chain.name}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </>
    </Modal>
  );
};
