import { Box, Typography } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import { BRIDGE_CHAINS, BRIDGE_CHAINS_LIST } from "src/constants/addresses";

export const ChainPickerModal = ({
  isOpen,
  handleConfirmClose,
}: {
  isOpen: boolean;
  handleConfirmClose: () => void;
}) => {
  const chainIds = BRIDGE_CHAINS_LIST;
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
        <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="start" gap={2}>
          {chainIds.map(chainId => {
            const chain = BRIDGE_CHAINS[chainId as keyof typeof BRIDGE_CHAINS];
            return (
              <Box key={chainId} display="flex" flexDirection="row" justifyContent="space-between" gap={1}>
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
                </div>{" "}
                {chain.name && chain.name}
              </Box>
            );
          })}
        </Box>
      </>
    </Modal>
  );
};
