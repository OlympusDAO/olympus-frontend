export const defiLlamaChainToNetwork = (chain: string) => {
  switch (chain.toLowerCase()) {
    case "ethereum":
      return "ETH";
    case "polygon":
      return "MATIC";
    default:
      return chain.toUpperCase();
  }
};
