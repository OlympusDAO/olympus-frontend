import { TOKEN_DECIMALS } from "src/constants";
import { segmentUA } from "src/helpers/userAnalyticHelpers";

import OhmImg from "src/assets/tokens/token_OHM.svg";
import SOhmImg from "src/assets/tokens/token_sOHM.svg";
import WsOhmImg from "src/assets/tokens/token_wsOHM.svg";
import token33tImg from "src/assets/tokens/token_33T.svg";

import { OHMToken } from "./Tokens";

const addTokenToWallet = async (tokenSymbol: OHMToken, tokenAddress: string, userAddress: string) => {
  if (!window.ethereum) return;

  const host = window.location.origin;
  const tokenDecimals = tokenSymbol === "wsOHM" ? 18 : TOKEN_DECIMALS; // 9;
  const tokenImagePath = {
    OHM: OhmImg,
    sOHM: SOhmImg,
    wsOHM: WsOhmImg,
    "33T": token33tImg,
  }[tokenSymbol];

  try {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: `${host}/${tokenImagePath}`,
        },
      },
    });
    segmentUA({
      address: userAddress,
      type: "Add Token",
      tokenName: tokenSymbol,
    });
  } catch (error) {
    console.log(error);
  }
};

export { addTokenToWallet };
