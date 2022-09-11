import { Button, Typography } from "@mui/material";
import { TertiaryButton, Token } from "@olympusdao/component-library";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";
import { useNetwork, useSwitchNetwork } from "wagmi";

export const WrapSwitchNetwork = () => {
  const networks = useTestableNetworks();

  const { chain = { id: 1 } } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const isMainnet = chain.id === networks.MAINNET;
  if (!isMainnet)
    return (
      <>
        <Typography variant="h6" style={{ margin: "15px 0 10px 0" }}>
          Back to Ethereum Mainnet
        </Typography>

        <Button onClick={() => switchNetwork?.(NetworkId.MAINNET)} variant="outlined" color="secondary">
          <Token name="ETH" style={{ fontSize: "28px" }} />

          <Typography variant="h6" style={{ marginLeft: "8px" }}>
            Ethereum
          </Typography>
        </Button>
      </>
    );

  return (
    <>
      <Typography variant="body1" style={{ margin: "15px 0 10px 0" }}>
        Got wsOHM on Avalanche or Arbitrum? Click below to switch networks and migrate to gOHM (no bridge required!)
      </Typography>

      <TertiaryButton size="large" onClick={() => switchNetwork?.(NetworkId.AVALANCHE)} style={{ margin: "0.3rem" }}>
        <Token name="AVALANCHE" style={{ marginRight: "8px" }} />
        Avalanche
      </TertiaryButton>

      <TertiaryButton size="large" onClick={() => switchNetwork?.(NetworkId.ARBITRUM)} style={{ margin: "0.3rem" }}>
        <Token name="ARBITRUM" style={{ marginRight: "8px" }} />
        Arbitrum
      </TertiaryButton>
    </>
  );
};
