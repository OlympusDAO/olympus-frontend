import { Provider } from "@ethersproject/providers";

import Fuse from "../index";

export const alchemyURL = `https://eth-mainnet.alchemyapi.io/v2/2Mt-6brbJvTA4w9cpiDtnbTo6qOoySnN`;
export const testnetURL = `http://localhost:8545`;

export const initFuseWithProviders = (provider: Provider) => {
  const fuse = new Fuse(provider);

  // @ts-ignore We have to do this to avoid Infura ratelimits on our large calls.
  // fuse.contracts.FusePoolLens.setProvider(alchemyURL);

  return fuse;
};
