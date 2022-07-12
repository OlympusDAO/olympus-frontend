import { Trans } from "@lingui/macro";
import { Button, Typography } from "@mui/material";
import { Token } from "@olympusdao/component-library";
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
        <Trans>
          Got wsOHM on Avalanche or Arbitrum? Click below to switch networks and migrate to gOHM (no bridge required!)
        </Trans>
      </Typography>

      <Button
        onClick={() => switchNetwork?.(NetworkId.AVALANCHE)}
        variant="outlined"
        color="secondary"
        style={{ margin: "0.3rem" }}
      >
        <Token name="AVALANCHE" style={{ fontSize: "28px" }} />

        <Typography variant="h6" style={{ marginLeft: "8px" }}>
          Avalanche
        </Typography>
      </Button>

      <Button
        onClick={() => switchNetwork?.(NetworkId.ARBITRUM)}
        variant="outlined"
        color="secondary"
        style={{ margin: "0.3rem" }}
      >
        <Token name="ARBITRUM" style={{ fontSize: "28px" }} />

        <Typography variant="h6" style={{ marginLeft: "8px" }}>
          Arbitrum
        </Typography>
      </Button>
    </>
  );
};
