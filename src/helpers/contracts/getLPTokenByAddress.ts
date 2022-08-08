import { getBalancerLPToken } from "src/helpers/contracts/getBalancerLPToken";
import { getCurveLPToken } from "src/helpers/contracts/getCurveLPToken";
import { getGelatoLPToken } from "src/helpers/contracts/getGelatoLPToken";
import { getUniOrSushiLPToken } from "src/helpers/contracts/getUniOrSushiLPToken";
import { NetworkId } from "src/networkDetails";

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
