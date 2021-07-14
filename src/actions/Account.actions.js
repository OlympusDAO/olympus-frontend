import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import apollo from "../lib/apolloClient";
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const APIRUL = "https://api.thegraph.com/subgraphs/id/QmPkygj4BhudwpNWREYCz3uNkHXDRL1XKCt4SJYwMDcSoS";

const client = new ApolloClient({
  uri: APIRUL,
  cache: new InMemoryCache()
});
    
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
<<<<<<< HEAD
=======
>>>>>>> imported new icons and got them working with theme colors
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph

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

<<<<<<< HEAD
    // const graphData = await apollo(accountQuery);

    // these work in playground but show up as null, maybe subgraph api not caught up?
<<<<<<< HEAD
    // ohmBalance = graphData.data.ohmie.lastBalance.ohmBalance;
    // sohmBalance = graphData.data.ohmie.lastBalance.sohmBalance;
    let migrateContract;
    let unstakeAllowanceSohm;
=======
    // const graphData = await client.query({
    //   query: gql(accountQuery),
    //   variables: { id: address }
    // })
    // .then(data => {
    //   console.log('subgraph account data: ', data);
    //   return data;
    // })
    // .catch(err => console.log('qraph ql error: ', err));

    // these work in playground but show up as null, maybe subgraph api not caught up? 
    // ohmBalance = graphData.data.ohmie.lastBalance.ohmBalance;
    // sohmBalance = graphData.data.ohmie.lastBalance.sohmBalance;
=======
    // const graphData = await client.query({
    //   query: gql(accountQuery),
    //   variables: { id: address }
    // })
    // .then(data => {
    //   console.log('subgraph account data: ', data);
    //   return data;
    // })
    // .catch(err => console.log('qraph ql error: ', err));

    // these work in playground but show up as null, maybe subgraph api not caught up? 
    // ohmBalance = graphData.data.ohmie.lastBalance.ohmBalance;
    // sohmBalance = graphData.data.ohmie.lastBalance.sohmBalance;

>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph

>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph

=======
    // ohmBalance = graphData.data.ohmie.lastBalance.ohmBalance;
    // sohmBalance = graphData.data.ohmie.lastBalance.sohmBalance;

>>>>>>> formatting
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
<<<<<<< HEAD

      const signer = provider.getSigner();
      unstakeAllowanceSohm = await oldsohmContract.allowance(address, addresses[networkID].OLD_STAKING_ADDRESS);
=======
>>>>>>> formatting
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
