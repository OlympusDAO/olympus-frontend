import { useEffect } from "react";
import { NavigateFunction } from "react-router-dom";
import { NetworkId, VIEWS_FOR_NETWORK } from "src/constants";

/**
 * will redirect from paths that aren't active on a given network yet.
 */
export function usePathForNetwork({
  pathName,
  networkID,
  navigate,
}: {
  pathName: string;
  networkID: NetworkId;
  navigate: NavigateFunction;
}) {
  const handlePathForNetwork = () => {
    // do nothing if networkID is -1 since that's a default state
    // if (networkID === -1) return;

    switch (pathName) {
      case "stake":
        if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].stake) {
          break;
        } else if ([NetworkId.ARBITRUM, NetworkId.ARBITRUM_GOERLI].includes(networkID)) {
          navigate("/bridge");
          break;
        } else {
          navigate("/dashboard");
          break;
        }
      case "bonds":
        if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].bonds) {
          break;
        } else {
          navigate("/stake");
          break;
        }
      case "zap":
        if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].zap) {
          break;
        } else {
          navigate("/stake");
          break;
        }
      case "range":
        if (VIEWS_FOR_NETWORK[networkID] && VIEWS_FOR_NETWORK[networkID].range) {
          break;
        } else {
          navigate("/stake");
          break;
        }
      default:
        console.log("pathForNetwork ok");
    }
  };

  useEffect(() => {
    handlePathForNetwork();
  }, [networkID]);
}
