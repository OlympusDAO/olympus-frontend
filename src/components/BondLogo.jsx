import { Box, SvgIcon } from "@material-ui/core";
import { v2BondDetails } from "src/constants";
import { useWeb3Context } from "src/hooks/web3Context";

function BondLogo({ bond }) {
  const { networkId } = useWeb3Context();
  let viewBox = "0 0 32 32";
  let style = { height: "32px", width: "32px" };
  let width = "32px";

  // Need more space if its an LP token
  if (bond.isLP) {
    viewBox = "0 0 64 32";
    style = { height: "32px", width: "62px" };
    width = "64px";
  }

  let bondIconSvg;
  if (bond && bond.bondIconSvg) {
    bondIconSvg = bond.bondIconSvg;
  } else {
    // look it up for V2 bonds
    const details = v2BondDetails[networkId][bond.quoteToken];
    bondIconSvg = details && details.bondIconSvg;
    if (details && details.bondIconViewBox) viewBox = details.bondIconViewBox;
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={width}>
      <SvgIcon component={bondIconSvg} viewBox={viewBox} style={style} />
    </Box>
  );
}

export default BondLogo;
