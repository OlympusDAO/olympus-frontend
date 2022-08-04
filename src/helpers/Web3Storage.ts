import { IProposalContent } from "src/hooks/useProposals";
import { Filelike, Web3Storage } from "web3.storage";

import { Environment } from "./environment/Environment/Environment";

/**
 * uploads a given file to Web3.Storage with the API Key
 */
const uploadToIPFS = async (files: Iterable<Filelike>) => {
  const accessToken = Environment.getWeb3StorageKey();
  if (accessToken) {
    // NOTE(appleseed): the below endpoint is required in typescript, it is simply the default from: https://github.com/web3-storage/web3.storage/blob/main/packages/client/src/lib.js#L92
    const client = new Web3Storage({ token: accessToken, endpoint: new URL("https://api.web3.storage") });
    const cid = await client.put(files);
    console.log("stored files with cid:", cid);
    return cid;
  }
};

/**
 * expects a js object, turns it into a json file
 * @returns an Iterable<Filelike>
 */
const makeJsonFile = (object: IProposalContent): Iterable<Filelike> => {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const blob = new Blob([JSON.stringify(object)], { type: "application/json" });

  const files = [new File([blob], "proposal.json")];
  return files;
};
