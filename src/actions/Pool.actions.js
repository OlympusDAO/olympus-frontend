import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as PrizePool } from "../abi/33-together/PrizePoolAbi.json";
import { abi as Award } from "../abi/33-together/AwardAbi.json";
import { abi as sOHMv2 } from "../abi/sOHMv2.json";

export const fetchPoolSuccess = payload => ({
  type: Actions.FETCH_POOL_SUCCESS,
  payload,
});

export const changeApproval =
  ({ token, provider, address, networkID }) =>
  async dispatch => {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }

    const signer = provider.getSigner();
    const sohmContract = await new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, signer);
    const poolContract = await new ethers.Contract(addresses[networkID].POOL_TOGETHER.POOL_ADDRESS, PrizePool, signer);

    let approveTx;
    try {
      if (token === "sohm") {
        approveTx = await ohmContract.approve(
          addresses[networkID].POOL_TOGETHER.POOL_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else {
        console.log("token not sohm");
        // approveTx = await sohmContract.approve(
        //   addresses[networkID].STAKING_ADDRESS,
        //   ethers.utils.parseUnits("1000000000", "gwei").toString(),
        // );
      }

      await approveTx.wait();
    } catch (error) {
      alert(error.message);
      return;
    }

    const depositAllowance = await sohmContract.allowance(address, addresses[networkID].POOL_TOGETHER.POOL_ADDRESS);
    const withdrawAllowance = await poolContract.allowance(address, addresses[networkID].POOL_TOGETHER.POOL_ADDRESS);
    return dispatch(
      fetchPoolSuccess({
        pool: {
          sohmDeposit: +depositAllowance,
          sohmWithdraw: +withdrawAllowance,
        },
      }),
    );
  };

// export const changeDeposit =
//   ({ action, value, provider, address, networkID }) =>
//   async dispatch => {
//     if (!provider) {
//       alert("Please connect your wallet!");
//       return;
//     }

//     const signer = provider.getSigner();
//     const pool = await new ethers.Contract(addresses[networkID].POOL_TOGETHER.POOL_ADDRESS, PrizePool, signer);

//     let poolTx;

//     try {
//       if (action === "deposit") {
//         poolTx = await pool.depositTo(ethers.utils.parseUnits(value, "gwei"));
//         await poolTx.wait();
//       } else if (action === "withdraw") {
//         poolTx = await pool.withdrawInstantlyFrom(address, ethers.utils.parseUnits(value, "gwei"), , );
//         await stakeTx.wait();
//       } else {
//         console.log('unrecognized action: ', action);
//       }
//     } catch (error) {
//       if (error.code === -32603 && error.message.indexOf("ds-math-sub-underflow") >= 0) {
//         alert("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow");
//       } else {
//         alert(error.message);
//       }
//       return;
//     }

//     const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, provider);
//     const ohmBalance = await ohmContract.balanceOf(address);
//     const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, provider);
//     const sohmBalance = await sohmContract.balanceOf(address);

//     return dispatch(
//       fetchStakeSuccess({
//         ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
//         sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
//       }),
//     );
//   };
