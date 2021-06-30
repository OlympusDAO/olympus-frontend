import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import apollo from "../lib/apolloClient";

export const fetchAccountSuccess = payload => ({
  type: Actions.FETCH_ACCOUNT_SUCCESS,
  payload,
});

export const loadAccountDetails =
  ({ networkID, provider, address }) =>
  async dispatch => {
    // console.log("networkID = ", networkID)
    // console.log("addresses = ",addresses)

    let ohmBalance = 0;
    let sohmBalance = 0;
    let oldsohmBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let lpStaked = 0;
    let pendingRewards = 0;
    let lpBondAllowance = 0;
    let daiBondAllowance = 0;
    let aOHMAbleToClaim = 0;

    // const accountQuery = `
    //   query($id: String) {
    //     ohmie(id: $id) {
    //       id
    //       lastBalance {
    //         ohmBalance
    //         sohmBalance
    //         bondBalance
    //       }
    //     }
    //   }
    // `;

    // const graphData = await apollo(accountQuery);

    // these work in playground but show up as null, maybe subgraph api not caught up? 
    // ohmBalance = graphData.data.ohmie.lastBalance.ohmBalance;
    // sohmBalance = graphData.data.ohmie.lastBalance.sohmBalance;


    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS, ierc20Abi, provider);
    const daiBalance = await daiContract.balanceOf(address);

    if (addresses[networkID].OHM_ADDRESS) {
      const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, provider);
      ohmBalance = await ohmContract.balanceOf(address);
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    }

    if (addresses[networkID].DAI_BOND_ADDRESS) {
      daiBondAllowance = await daiContract.allowance(address, addresses[networkID].DAI_BOND_ADDRESS);
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      const sohmContract = await new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOHMv2, provider);
      sohmBalance = await sohmContract.balanceOf(address);
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    }

    if (addresses[networkID].OLD_SOHM_ADDRESS) {
       const oldsohmContract = await new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, sOHM, provider);
       oldsohmBalance = await oldsohmContract.balanceOf(address);
     }

    return dispatch(
      fetchAccountSuccess({
        balances: {
          dai: ethers.utils.formatEther(daiBalance),
          ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
          sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
          oldsohm: ethers.utils.formatUnits(oldsohmBalance, "gwei"),
        },
        staking: {
          ohmStake: +stakeAllowance,
          ohmUnstake: +unstakeAllowance,
        },
        bonding: {
          daiAllowance: daiBondAllowance,
        },
      }),
    );
  };
