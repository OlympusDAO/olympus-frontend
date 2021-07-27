import { BigNumber, ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import apollo from "../lib/apolloClient";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Dispatch } from "redux";
import { IERC20, SOlympus } from "../typechain";

interface IAccountDetails {
  readonly balances: { [token: string]: string };
  readonly staking: { ohmStake: number | BigNumber; ohmUnstake: number | BigNumber };
  readonly migrate: { unstakeAllowance: BigNumber | undefined };
  readonly bonding: { daiAllowance: number | BigNumber };
}

export const fetchAccountSuccess = (payload: IAccountDetails) => ({
  type: Actions.FETCH_ACCOUNT_SUCCESS,
  payload,
});

export const loadAccountDetails =
  ({ networkID, provider, address }: { networkID: number; provider: StaticJsonRpcProvider; address: string }) =>
  async (dispatch: Dispatch) => {
    // console.log("networkID = ", networkID)
    // console.log("addresses = ",addresses)

    let ohmBalance: number | BigNumber = 0;
    let sohmBalance: number | BigNumber = 0;
    let oldsohmBalance: number | BigNumber = 0;
    let stakeAllowance: number | BigNumber = 0;
    let unstakeAllowance: number | BigNumber = 0;
    let daiBondAllowance: number | BigNumber = 0;
    let lpStaked = 0;
    let pendingRewards = 0;
    let lpBondAllowance = 0;
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
    let migrateContract;
    let unstakeAllowanceSohm;

    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20Abi, provider) as IERC20;
    const daiBalance = await daiContract.balanceOf(address);

    if (addresses[networkID].OHM_ADDRESS) {
      const ohmContract = new ethers.Contract(
        addresses[networkID].OHM_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      ohmBalance = await ohmContract.balanceOf(address);
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS as string);
    }

    if (addresses[networkID].DAI_BOND_ADDRESS) {
      daiBondAllowance = await daiContract.allowance(address, addresses[networkID].DAI_BOND_ADDRESS as string);
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      const sohmContract = new ethers.Contract(
        addresses[networkID].SOHM_ADDRESS as string,
        sOHMv2,
        provider,
      ) as SOlympus;
      sohmBalance = await sohmContract.balanceOf(address);
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS as string);
    }

    if (addresses[networkID].OLD_SOHM_ADDRESS) {
      const oldsohmContract = new ethers.Contract(
        addresses[networkID].OLD_SOHM_ADDRESS as string,
        sOHM,
        provider,
      ) as SOlympus;
      oldsohmBalance = await oldsohmContract.balanceOf(address);

      unstakeAllowanceSohm = await oldsohmContract.allowance(
        address,
        addresses[networkID].OLD_STAKING_ADDRESS as string,
      );
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
        migrate: {
          unstakeAllowance: unstakeAllowanceSohm,
        },
        bonding: {
          daiAllowance: daiBondAllowance,
        },
      }),
    );
  };
