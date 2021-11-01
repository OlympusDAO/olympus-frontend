import { useCallback, useState } from "react";
import "./give.scss";
import DepositYield from "./DepositYield";
import RedeemYield from "./RedeemYield";

function Give() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <div id="yield-directing-view">
      <DepositYield />
      <RedeemYield />
    </div>
  );
}

export default Give;
