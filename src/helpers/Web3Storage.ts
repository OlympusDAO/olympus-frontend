import { Environment } from "src/helpers/environment/Environment/Environment";
import { IProposalContent } from "src/hooks/useProposals";
import { Filelike, Web3Storage } from "web3.storage";
import { CIDString } from "web3.storage/dist/src/lib/interface";

export interface IPFSFileData {
  path: string;
  cid: CIDString;
  fileName: string;
}

/**
 * uploads a given file to Web3.Storage with the API Key
 */
export const uploadToIPFS = async (file: Filelike) => {
  const accessToken = Environment.getWeb3StorageKey();
  if (accessToken) {
    // NOTE(appleseed): the below endpoint is required in typescript, it is simply the default from: https://github.com/web3-storage/web3.storage/blob/main/packages/client/src/lib.js#L92
    const client = new Web3Storage({ token: accessToken, endpoint: new URL("https://api.web3.storage") });
    // NOTE(appleseed): web3Storage client expects an array of files.
    const cid = await client.put([file]);
    console.log("stored files with cid:", cid);
    return {
      path: `${cid}/${file.name}`,
      cid,
      fileName: file.name,
    };
  }
};

/**
 * adhering to ERC-721 metadata standards & mimicking Lens.Protocol:
 * @link https://docs.lens.xyz/docs/metadata-standards#metadata-structure
 * @example
 * ```
 * {
 *   name: "My Proposal",
 *   description: "really long text",
 *   content: "same as description",
 *   external_url: "https://forum.wherever.com"
 * }
 * ```
 */
export interface IProposalJson extends IProposalContent {
  content: string;
}

/**
 * expects a js object, turns it into a json file
 * @returns an Filelike
 */
export const makeJsonFile = (object: IProposalJson, fileName: string): Filelike => {
  // You can create File objects from a Blob of binary data
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
  // Here we're just storing a JSON object, but you can store images,
  // audio, or whatever you want!
  const blob = new Blob([JSON.stringify(object)], { type: "application/json" });

  const file = new File([blob], fileName);
  return file;
};
