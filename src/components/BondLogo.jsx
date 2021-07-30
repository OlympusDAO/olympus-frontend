import { isBondLP, getTokenImage } from "../helpers";

function BondHeader({ bond }) {
  const ohmAssetImg = () => {
    return getTokenImage("ohm");
  };

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
    <div className="ohm-pairs">
      {isBondLP(bond) && (
        <div className="ohm-pair" style={{ zIndex: 2 }}>
          <div className="ohm-logo-bg">
            <img className="ohm-pair-img" src={`${ohmAssetImg()}`} />
          </div>
        </div>
      )}

      <div className="ohm-pair" style={{ zIndex: 1 }}>
        <img className="reserve-pair-img" src={`${reserveAssetImg()}`} />
      </div>
    </div>
  );
}

export default BondHeader;
