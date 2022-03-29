import { Trans } from "@lingui/macro";
import { Button, Typography } from "@material-ui/core";
import { NETWORKS } from "src/constants";
import { useWeb3Context } from "src/hooks";
import { useSwitchNetwork } from "src/hooks/useSwitchNetwork";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { NetworkId } from "src/networkDetails";

export const WrapSwitchNetwork = () => {
  const { mutate } = useSwitchNetwork();
  const networks = useTestableNetworks();

  const { networkId } = useWeb3Context();
  const isMainnet = networkId === networks.MAINNET;

  if (!isMainnet)
    return (
      <>
        <Typography variant="h6" style={{ margin: "15px 0 10px 0" }}>
          Back to Ethereum Mainnet
        </Typography>

        <Button onClick={() => mutate(NetworkId.MAINNET)} variant="outlined">
          <img
            height="28px"
            width="28px"
            src={String(NETWORKS[NetworkId.MAINNET].image)}
            alt={NETWORKS[NetworkId.MAINNET].imageAltText}
          />

          <Typography variant="h6" style={{ marginLeft: "8px" }}>
            {NETWORKS[NetworkId.MAINNET].chainName}
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

      <Button onClick={() => mutate(NetworkId.AVALANCHE)} variant="outlined" style={{ margin: "0.3rem" }}>
        <img
          height="28px"
          width="28px"
          alt={NETWORKS[NetworkId.AVALANCHE].imageAltText}
          src={String(NETWORKS[NetworkId.AVALANCHE].image)}
        />

        <Typography variant="h6" style={{ marginLeft: "8px" }}>
          {NETWORKS[NetworkId.AVALANCHE].chainName}
        </Typography>
      </Button>

      <Button onClick={() => mutate(NetworkId.ARBITRUM)} variant="outlined" style={{ margin: "0.3rem" }}>
        <img
          height="28px"
          width="28px"
          alt={NETWORKS[NetworkId.ARBITRUM].imageAltText}
          src={String(NETWORKS[NetworkId.ARBITRUM].image)}
        />

        <Typography variant="h6" style={{ marginLeft: "8px" }}>
          {NETWORKS[NetworkId.ARBITRUM].chainName}
        </Typography>
      </Button>
    </>
  );
};
