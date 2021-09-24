import { ethers } from "ethers";

/**
 * hook for listening to events from ethers / contracts
 * @param {*} provider from web3Context
 * @param {*} topicString from the contract, i.e. `"RandomNumberRequested(uint32,address)"`.
 * NO SPACES AFTER COMMAS IN PARAMS
 * @param {*} contractAddress that you took the topicString from
 * @param {*} handlerFunc what to do when event fires, i.e. `setTimeout(() => window.location.reload(), 1);`
 * @param {*} networkID
 * @returns {object} `{ base: topicBaseName, full: topicString }` where topicBaseName is the topicString before `(`
 */
export function addEthersEventListener(contract, filter, contractAddress, handlerFunc) {
  // let filter = buildFilter(topicString, contractAddress);
  // let filter = topicString;
  console.log("addEventListener", filter);

  contract.on(filter, result => {
    console.log("hook result", result, topicString);
    handlerFunc();
  });
  console.log("after");
  return () => {
    // remove eventListener per: https://github.com/ethers-io/ethers.js/issues/175
    // provider.removeListener(filter, result => {
    //   null;
    // });
    poolReader.off(filter);
  };
}

// todo check this
export function removeEthersEventListener(contract, topicString, contractAddress) {
  let filter = buildFilter(topicString, contractAddress);
  contract.off(filter);
}

const buildFilter = (topicString, contractAddress) => {
  let topic = ethers.utils.id(topicString);

  let filter = {
    address: contractAddress,
    topics: [topic],
  };

  return filter;
};
