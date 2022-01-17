import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3Context } from "./web3Context";
import { NetworkId } from "../constants";

const useENS = (address: string) => {
  const { provider, networkId, providerInitialized } = useWeb3Context();
  const [ensName, setENSName] = useState<string | null>(null);
  const [ensAvatar, setENSAvatar] = useState<string | null>(null);
  const ensSupport: boolean = networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY;

  useEffect(() => {
    const resolveENS = async () => {
      if (providerInitialized && ensSupport && ethers.utils.isAddress(address)) {
        try {
          let ensName = await provider.lookupAddress(address);
          let avatar = ensName ? await provider.getAvatar(ensName) : null;
          setENSName(ensName);
          setENSAvatar(avatar);
        } catch (e) {
          console.log("e", e);
        }
      }
    };
    resolveENS();
  }, [address]);

  return { ensName, ensAvatar };
};

export default useENS;
