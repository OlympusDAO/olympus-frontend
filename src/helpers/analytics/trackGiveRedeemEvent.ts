import { getGiveProjectName } from "../GiveProjectNameHelper";
import { trackGAEvent } from "./trackGAEvent";

export interface IUARecipientData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string;
}

export const trackGiveRedeemEvent = (uaData: IUARecipientData, eventAction?: string) => {
  trackGAEvent({
    category: "Olympus Give",
    action: eventAction ? eventAction : uaData.type ? uaData.type : "unknown",
    label: getGiveProjectName(uaData.address, "unknown"),
    value: Math.round(parseFloat(uaData.value)),
    metric1: parseFloat(uaData.value),
    dimension1: uaData.txHash ?? "unknown",
    dimension2: uaData.address,
  });
};
