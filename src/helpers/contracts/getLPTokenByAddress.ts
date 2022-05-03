import { NetworkId } from "src/networkDetails";

import { getBalancerLPToken } from "./getBalancerLPToken";
import { getCurveLPToken } from "./getCurveLPToken";
import { getGelatoLPToken } from "./getGelatoLPToken";

export const getLPTokenByAddress = async ({ address, networkId }: { address: string; networkId: NetworkId }) => {
  const balancer = await getBalancerLPToken({ address, networkId });
  if (balancer) return balancer;

  const curve = await getCurveLPToken({ address, networkId });
  if (curve) return curve;

  return getGelatoLPToken({ address, networkId });
};
