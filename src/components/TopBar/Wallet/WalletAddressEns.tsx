import { shorten } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useEns } from "src/hooks/useENS";

export default function WalletAddressEns() {
  const { data: ens } = useEns();
  const { address } = useWeb3Context();

  if (!address) return null;

  return <>{ens || shorten(address)}</>;
}
