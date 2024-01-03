import { FC } from "react";
import Icon from "src/components/library/Icon";
import Tooltip from "src/components/library/Tooltip/Tooltip";

export interface OHMInfoTooltipProps {
  message: string;
}

const InfoTooltip: FC<OHMInfoTooltipProps> = ({ message }) => {
  return (
    <Tooltip message={message}>
      <Icon name="info" style={{ margin: "0 5px", fontSize: "1em" }} className="info-icon" />
    </Tooltip>
  );
};

export default InfoTooltip;
