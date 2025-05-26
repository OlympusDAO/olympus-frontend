import { ethers } from "ethers";
import { IMonoCooler } from "src/typechain/CoolerV2Migrator";
import { useSignTypedData } from "wagmi";

export async function getAuthorizationSignature({
  userAddress,
  authorizedAddress,
  verifyingContract,
  chainId,
  deadline = Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
  nonce,
  signTypedDataAsync,
}: {
  userAddress: string;
  authorizedAddress: string;
  verifyingContract: `0x${string}`;
  chainId: number;
  deadline?: number;
  nonce: string | number;
  signTypedDataAsync: ReturnType<typeof useSignTypedData>["signTypedDataAsync"];
}) {
  const auth: IMonoCooler.AuthorizationStruct = {
    account: userAddress,
    authorized: authorizedAddress,
    authorizationDeadline: deadline,
    nonce: nonce.toString(),
    signatureDeadline: deadline,
  };

  const domain = {
    chainId,
    verifyingContract,
  };

  const types = {
    Authorization: [
      { name: "account", type: "address" },
      { name: "authorized", type: "address" },
      { name: "authorizationDeadline", type: "uint96" },
      { name: "nonce", type: "uint256" },
      { name: "signatureDeadline", type: "uint256" },
    ],
  };

  const signature = await signTypedDataAsync({ domain, types, value: auth });
  const { v, r, s } = ethers.utils.splitSignature(signature);

  return { auth, signature: { v, r, s } };
}
