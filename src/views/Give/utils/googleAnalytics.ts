import { trackGAEvent } from "src/helpers/analytics";

export interface IUAData {
  address: string;
  value: string;
  recipient: string;
  approved: boolean;
  txHash: string | null;
  type: string;
}

export interface IUARecipientData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string;
}

export const trackGiveEvent = (uaData: IUAData, eventAction?: string) => {
  trackGAEvent({
    category: "Olympus Give",
    action: eventAction ? eventAction : uaData.type ? uaData.type : "unknown",
    label: uaData.recipient ?? "unknown",
    value: Math.round(parseFloat(uaData.value)),
    metric1: parseFloat(uaData.value),
    dimension1: uaData.txHash ?? "unknown",
    dimension2: uaData.address,
  });
};

export const trackRedeemEvent = (uaData: IUARecipientData, eventAction?: string) => {
  trackGAEvent({
    category: "Olympus Give",
    action: eventAction ? eventAction : uaData.type ? uaData.type : "unknown",
    label: uaData.address ?? "unknown",
    value: Math.round(parseFloat(uaData.value)),
    metric1: parseFloat(uaData.value),
    dimension1: uaData.txHash ?? "unknown",
    dimension2: uaData.address,
  });
};
