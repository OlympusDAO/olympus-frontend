export const normalizeSymbol = (symbol: string[]) => {
  return symbol.map(s => {
    switch (s.toLowerCase()) {
      case "weth":
        return "wETH";
      case "gohm":
        return "gOHM";
      case "wftm":
        return "FTM";
      case "fraxbp":
        return "FRAX";
      case "wavax":
        return "AVAX";
      default:
        return s;
    }
  });
};
