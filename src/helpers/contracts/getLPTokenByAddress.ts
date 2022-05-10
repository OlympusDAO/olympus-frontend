import { NetworkId } from "src/networkDetails";

import { getBalancerLPToken } from "./getBalancerLPToken";
import { getCurveLPToken } from "./getCurveLPToken";
import { getGelatoLPToken } from "./getGelatoLPToken";
import { getUniOrSushiLPToken } from "./getUniOrSushiLPToken";

export const getLPTokenByAddress = async ({ address, networkId }: { address: string; networkId: NetworkId }) => {
  // Note that the order between gelato and uniOrSushi is important here. Since all contract
  // calls to uniOrSushi are a subset of the calls to gelato, checking if a token is a gelato LP
  // must always preceed checking if it's a uniOrSushi LP.
  const gelato = await getGelatoLPToken({ address, networkId });
  if (gelato) return gelato;

  const uniOrSushi = await getUniOrSushiLPToken({ address, networkId });
  if (uniOrSushi) return uniOrSushi;

  const balancer = await getBalancerLPToken({ address, networkId });
  if (balancer) return balancer;

  return getCurveLPToken({ address, networkId });
};
