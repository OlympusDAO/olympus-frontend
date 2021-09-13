import { ethers } from "ethers";

/**
 * hook for listening to events from ethers / contracts
 * @param {*} provider from web3Context
 * @param {*} topicString from the contract, i.e. `"RandomNumberRequested(uint32,address)"`.
 * NO SPACES AFTER COMMAS IN PARAMS
 * @param {*} contractAddress that you took the topicString from
 * @param {*} handlerFunc what to do when event fires, i.e. `setTimeout(() => window.location.reload(), 1);`
 * @returns {object} `{ base: topicBaseName, full: topicString }` where topicBaseName is the topicString before `(`
 */
export function addEthersEventListener(provider, topicString, contractAddress, handlerFunc) {
  console.log("addEventListener");
  let filter = buildFilter(topicString, contractAddress);

  provider.once(filter, result => {
    console.log("hook result", result, topicString);
    const topicBaseName = topicString.split("(")[0];
    handlerFunc();
  });
  return () => {
    // remove eventListener per: https://github.com/ethers-io/ethers.js/issues/175
    // provider.removeListener(filter, result => {
    //   null;
    // });
    provider.off(filter);
  };
}

export function removeEthersEventListener(provider, topicString, contractAddress) {
  let filter = buildFilter(topicString, contractAddress);
  provider.off(filter);
}

const buildFilter = (topicString, contractAddress) => {
  let topic = ethers.utils.id(topicString);

  let filter = {
    address: contractAddress,
    topics: [topic],
  };

  return filter;
};
