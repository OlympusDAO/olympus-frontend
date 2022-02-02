import { BigNumber, ethers } from "ethers";

import { abi as OlympusGiving } from "../abi/OlympusGiving.json";
import { addresses } from "../constants";
import { IBaseAddressAsyncThunk } from "../slices/interfaces";

export const getTotalDonated = async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
  if (addresses[networkID] && addresses[networkID].GIVING_ADDRESS) {
    const zeroPadAddress = ethers.utils.hexZeroPad(address.toLowerCase(), 32);

    const filter = {
      address: addresses[networkID].GIVING_ADDRESS,
      fromBlock: 1,
      toBlock: "latest",
      topics: [ethers.utils.id("Redeemed(address,uint256)"), zeroPadAddress], // hash identifying Redeemed event
    };

    const events = await provider.getLogs(filter);

    let totalRedeemed = BigNumber.from("0");

    for (let i = 0; i < events.length; i++) {
      totalRedeemed = totalRedeemed.add(events[i].data);
    }

    const givingContract = new ethers.Contract(addresses[networkID].GIVING_ADDRESS as string, OlympusGiving, provider);
    const redeemableBalance = await givingContract.redeemableBalance(address);

    const totalDonated = totalRedeemed.add(redeemableBalance);

    return ethers.utils.formatUnits(totalDonated, "gwei");
  } else {
    console.log("No giving contract on chain ID " + networkID);
    return "0";
  }
};
