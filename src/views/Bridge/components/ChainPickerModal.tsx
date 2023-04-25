import { Box, Typography, useTheme } from "@mui/material";
import { Icon, Modal, OHMTokenProps, Token } from "@olympusdao/component-library";
import { BRIDGE_CHAINS } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";
import { useBridgeableChains } from "src/views/Bridge/helpers";
import { useSwitchNetwork } from "wagmi";

export const ChainPickerModal = ({
  isOpen,
  selectedChain,
  setSelectedChain,
  handleConfirmClose,
  variant,
}: {
  isOpen: boolean;
  selectedChain: NetworkId;
  setSelectedChain: React.Dispatch<React.SetStateAction<number>>;
  handleConfirmClose: () => void;
  variant: "send" | "receive";
}) => {
  // for sending variant
  const { switchNetworkAsync } = useSwitchNetwork();
  // for all variants
  const { data: chainDefaults, isInvalid } = useBridgeableChains();
  const chainIds = chainDefaults?.availableChains || [1];
  const chainsInSelector = variant === "send" ? [selectedChain, ...chainIds] : chainIds;
  const theme = useTheme();
  const handleSelection = async (e: React.MouseEvent, chainId: NetworkId) => {
    e.preventDefault();
    console.log("handle selection");
    if (variant === "send") {
      await switchNetworkAsync?.(chainId);
      setSelectedChain(selectedChain);
    } else {
      setSelectedChain(chainId);
    }

    handleConfirmClose();
  };

  return (
    <Modal
      maxWidth="476px"
      minHeight="200px"
      open={isOpen}
      headerContent={
        <Box display="flex" flexDirection="row">
          <Typography variant="body1" sx={{ marginLeft: "6px", fontSize: "18px" }} fontWeight="500">
            {variant === "send" ? `Select source chain` : `Select target chain`}
          </Typography>
        </Box>
      }
      onClose={handleConfirmClose}
    >
      <>
        <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="start" gap={1}>
          {chainsInSelector.map(chainId => {
            const chain = BRIDGE_CHAINS[chainId as keyof typeof BRIDGE_CHAINS];
            const selected = variant === "send" && selectedChain === chainId;
            return (
              <Box
                key={chainId}
                onClick={e => handleSelection(e, chainId)}
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                sx={{
                  cursor: "pointer",
                  borderRadius: "12px",
                  padding: "1rem",
                  height: "5rem",
                  width: "100%",
                  backgroundColor: theme.colors.gray[700],
                  border: selected ? `1px solid ${theme.colors.primary[300]}` : ``,
                }}
              >
                <Box display="flex" gap={1} alignItems="center">
                  <Token name={chain.token as OHMTokenProps["name"]} />
                  <Typography variant="body1" sx={{ fontWeight: "400" }}>
                    {chain.name && chain.name}
                  </Typography>
                </Box>
                {selected && <Icon name="check-circle" sx={{ fontSize: "18px" }} htmlColor="#F8CC82" />}
              </Box>
            );
          })}
        </Box>
      </>
    </Modal>
  );
};
