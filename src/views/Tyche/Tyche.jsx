import { useCallback, useState } from "react";
import "./tyche.scss";
import DirectYield from "./DirectYield";
import Redeem from "./Redeem";

function Tyche() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div id="yield-directing-view">
      <DirectYield />
      <Redeem />
    </div>
  );
}

export default Tyche;
