import { useCallback, useState } from "react";
import "./tyche.scss";
import DirectYield from "./DirectYield";

function Tyche() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div id="yield-directing-view">
      <DirectYield />
    </div>
  );
}

export default Tyche;
