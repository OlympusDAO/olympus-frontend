import { NetworkId } from "src/networkDetails";

import { getBalancerLPToken } from "./getBalancerLPToken";
import { getCurveLPToken } from "./getCurveLPToken";
import { getGelatoLPToken } from "./getGelatoLPToken";

export const getLPTokenByAddress = async ({ address, networkId }: { address: string; networkId: NetworkId }) => {
  const guni = await getGelatoLPToken({ address, networkId });
  const curve = await getCurveLPToken({ address, networkId });
  const balancer = await getBalancerLPToken({ address, networkId });

  return guni || balancer || curve;
};
