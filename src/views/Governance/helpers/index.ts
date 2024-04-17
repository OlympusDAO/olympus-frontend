import { OHMChipProps } from "@olympusdao/component-library";

export const toCapitalCase = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export function getDateFromBlock(
  targetBlock?: number,
  currentBlock?: number,
  averageBlockTimeInSeconds?: number,
  currentTimestamp?: number,
): Date | undefined {
  if (targetBlock && currentBlock && averageBlockTimeInSeconds && currentTimestamp) {
    const date = new Date();
    date.setTime((currentTimestamp + averageBlockTimeInSeconds * (targetBlock - currentBlock)) * 1000);
    return date;
  }
  return undefined;
}

export const mapProposalStatus = (status: string) => {
  switch (status) {
    case "Active":
    case "Succeeded":
      return "success" as OHMChipProps["template"];
    case "Executed":
      return "purple" as OHMChipProps["template"];
    case "Queued":
      return "userFeedback" as OHMChipProps["template"];
    case "Canceled":
    case "Expired":
      return "gray" as OHMChipProps["template"];
    case "Defeated":
    case "Vetoed":
      return "error" as OHMChipProps["template"];
    case "Pending":
      return "darkGray" as OHMChipProps["template"];
  }
};
