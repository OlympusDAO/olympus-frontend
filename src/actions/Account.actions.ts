import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { Dispatch } from "redux";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { IERC20 } from "src/typechain";

interface IAccountDetails {
  readonly balances: { [token: string]: string };
  readonly bonding: { daiAllowance: BigNumberish };
  readonly migrate: { unstakeAllowance: BigNumber | undefined };
  readonly staking: { ohmStake: BigNumberish; ohmUnstake: BigNumberish };
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

    let ohmBalance: BigNumberish = 0;
    let sohmBalance: BigNumberish = 0;
    let oldsohmBalance: BigNumberish = 0;
    let stakeAllowance: BigNumberish = 0;
    let unstakeAllowance: BigNumberish = 0;
    let daiBondAllowance: BigNumberish = 0;
    let lpStaked = 0;
    let pendingRewards = 0;
    let lpBondAllowance = 0;
    let aOHMAbleToClaim = 0;
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
      const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider);
      sohmBalance = await sohmContract.balanceOf(address);
      unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    }

    if (addresses[networkID].OLD_SOHM_ADDRESS) {
      const oldsohmContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS as string, sOHM, provider);
      oldsohmBalance = await oldsohmContract.balanceOf(address);

      unstakeAllowanceSohm = await oldsohmContract.allowance(address, addresses[networkID].OLD_STAKING_ADDRESS);
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
          ohmStake: stakeAllowance,
          ohmUnstake: unstakeAllowance,
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
