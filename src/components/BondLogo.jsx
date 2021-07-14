import { isBondLP, getOhmTokenImage, getFraxTokenImage, getDaiTokenImage } from "../helpers";

function BondHeader({ bond }) {
  const ohmAssetImg = () => {
    return getOhmTokenImage();
  };

  const reserveAssetImg = () => {
    if (bond.indexOf("frax") >= 0) {
      return getFraxTokenImage();
    } else if (bond.indexOf("dai") >= 0) {
      return getDaiTokenImage();
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
