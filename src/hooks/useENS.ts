import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3Context } from "./web3Context";

const useENS = (address: string) => {
  const { provider } = useWeb3Context();
  const [ensName, setENSName] = useState<string | null>(null);
  const [ensAvatar, setENSAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resolveENS = async () => {
      setLoading(true);
      if (ethers.utils.isAddress(address)) {
        try {
          let ensName = await provider.lookupAddress(address);
          let avatar = ensName ? await provider.getAvatar(ensName) : null;
          setENSName(ensName);
          setENSAvatar(avatar);
        } finally {
          setLoading(false);
        }
      }
    };
    resolveENS();
  }, [address]);

  return { ensName, ensAvatar, ensLoading: loading };
};

export default useENS;
