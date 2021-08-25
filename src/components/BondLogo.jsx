import { getTokenImage, getTokenImageWithSVG } from "../helpers";
import { Box } from "@material-ui/core";

function BondHeader({ bond }) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={"64px"}>
      {getTokenImage("ohm")}
      {/* {getTokenImageWithSVG(bond.bondIconSvg)} */}
    </Box>
  );
}

export default BondHeader;
