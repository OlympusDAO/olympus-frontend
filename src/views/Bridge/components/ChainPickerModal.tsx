import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { Icon, Modal, OHMTokenProps, Token } from "@olympusdao/component-library";
import { BRIDGE_CHAINS, BRIDGEABLE_CHAINS } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";
import { useSwitchNetwork } from "wagmi";

export const ChainPickerModal = ({
  isOpen,
  selectedChain,
  setSelectedChain,
  handleConfirmClose,
  variant,
  baseChain,
}: {
  isOpen: boolean;
  selectedChain: NetworkId;
  setSelectedChain: React.Dispatch<React.SetStateAction<number>>;
  handleConfirmClose: () => void;
  variant: "send" | "receive";
  baseChain: NetworkId;
}) => {
  // for sending variant
  const { switchNetworkAsync } = useSwitchNetwork();
  const chainIds = BRIDGEABLE_CHAINS[baseChain as keyof typeof BRIDGEABLE_CHAINS]?.availableChains || [];
  const chainsInSelector = variant === "send" ? [selectedChain, ...chainIds] : chainIds;
  const theme = useTheme();
  const handleSelection = async (e: React.MouseEvent, chainId: NetworkId) => {
    e.preventDefault();
    console.log("handle selection");
    const isSolana = chainId === NetworkId.SOLANA || chainId === NetworkId.SOLANA_DEVNET;
    if (variant === "send") {
      if (!isSolana) {
        await switchNetworkAsync?.(chainId);
      }
      setSelectedChain(chainId);
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
          {chainsInSelector.map((chainId: NetworkId) => {
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
                  {chain?.image ? (
                    <Avatar src={chain.image} sx={{ width: "36px", height: "36px" }} />
                  ) : chain?.token === "BASE" ? (
                    <Avatar src="/assets/images/base.svg" sx={{ width: "36px", height: "36px" }} />
                  ) : chain?.token === "BERACHAIN" ? (
                    <Avatar src="/assets/images/berachain.svg" sx={{ width: "36px", height: "36px" }} />
                  ) : (
                    <Token name={chain?.token as OHMTokenProps["name"]} />
                  )}
                  <Typography variant="body1" sx={{ fontWeight: "400" }}>
                    {chain?.name && chain.name}
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
