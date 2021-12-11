import { useEffect, useState } from "react";
import { useWeb3Context } from "./web3Context";

const useENS = (address: string) => {
  const { provider } = useWeb3Context();
  const [ensName, setENSName] = useState<string | null>(null);
  const [ensAvatar, setENSAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resolevENSName = async () => {
      setLoading(true);
      if (address) {
        let ensName = await provider.lookupAddress(address);
        let avatar = ensName ? await provider.getAvatar(ensName) : null;
        setENSName(ensName);
        setENSAvatar(avatar);
        setLoading(false);
      }
    };
    resolevENSName();
  }, [address]);

  return [ensName, ensAvatar, loading];
};

export default useENS;
