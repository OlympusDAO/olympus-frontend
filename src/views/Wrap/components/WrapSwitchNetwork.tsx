import { Box, Button, Typography } from "@material-ui/core";
import { NETWORKS } from "src/constants";
import { useSwitchNetwork } from "src/hooks/useSwitchNetwork";
import { NetworkId } from "src/networkDetails";

export const WrapSwitchNetwork = () => {
  const { mutate } = useSwitchNetwork();

  return (
    <Box width="100%" p={1} sx={{ textAlign: "center" }}>
      <Typography variant="body1" style={{ margin: "15px 0 10px 0" }}>
        Got wsOHM on Avalanche or Arbitrum? Click below to switch networks and migrate to gOHM (no bridge required!)
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
    </Box>
  );
};
