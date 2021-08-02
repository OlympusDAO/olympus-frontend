import { isBondLP, getTokenImage, getPairImage } from "../helpers";
import { Box } from "@material-ui/core";

function BondHeader({ bond }) {
  const reserveAssetImg = () => {
    if (bond.indexOf("frax") >= 0) {
      return getTokenImage("frax");
    } else if (bond.indexOf("dai") >= 0) {
      return getTokenImage("dai");
    } else if (bond.indexOf("eth") >= 0) {
      return getTokenImage("eth");
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={"64px"}>
      {isBondLP(bond) ? getPairImage(bond) : reserveAssetImg()}
    </Box>
  );
}

export default BondHeader;
