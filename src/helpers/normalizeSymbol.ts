export const normalizeSymbol = (symbol: string[]) => {
  return symbol.map(s => {
    switch (s.toLowerCase()) {
      case "weth":
        return "wETH";
      case "wsteth":
        return "wstETH";
      case "gohm":
        return "gOHM";
      case "wftm":
        return "FTM";
      case "fraxbp":
        return "FRAX";
      case "usdc.e":
        return "USDC";
      case "wavax":
        return "AVAX";
      case "crvfrax":
        return "CRV";
      default:
        return s;
    }
  });
};
