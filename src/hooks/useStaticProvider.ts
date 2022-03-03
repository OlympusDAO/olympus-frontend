import { useMemo } from "react";
import { NetworkId } from "src/constants";
import { Providers } from "src/helpers/providers/Providers";

export const useStaticProvider = (networkId: NetworkId) => Providers.getStaticProvider(networkId);

export const useStaticProviders = (networkIds: NetworkId[]) => {
  return useMemo(() => networkIds.map(networkId => Providers.getStaticProvider(networkId)), [networkIds]);
};
