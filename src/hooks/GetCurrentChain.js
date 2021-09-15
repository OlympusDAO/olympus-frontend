import { useWeb3Context } from "./web3Context";
import { useEffect, useState } from "react";

export default function GetCurrentChain() {
  const { chainName } = useWeb3Context();
  const [name, setName] = useState("");

  useEffect(() => {
    setName(chainName);
  }, [chainName]);

  return name;
}
