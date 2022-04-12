import { NetworkId } from "src/networkDetails";

export const ACTION_GIVE = "give";
export const ACTION_GIVE_EDIT = "editGive";
export const ACTION_GIVE_WITHDRAW = "endGive";

export const isSupportedChain = (chainID: NetworkId): boolean => {
  // Give is only supported on Ethereum mainnet (1) and rinkeby (4) for the moment.
  if (chainID === NetworkId.MAINNET || chainID === NetworkId.TESTNET_RINKEBY) return true;

  return false;
};

export const getTypeFromAction = (action: string): string => {
  if (action === ACTION_GIVE) return ACTION_GIVE;

  if (action === ACTION_GIVE_EDIT) return ACTION_GIVE_EDIT;

  if (action === ACTION_GIVE_WITHDRAW) return ACTION_GIVE_WITHDRAW;

  return "";
};
