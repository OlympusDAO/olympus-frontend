import { Link } from "@material-ui/core";
import { shorten } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useEns } from "src/hooks/useENS";

export default function WalletAddressEns() {
  const { data: ens } = useEns();
  const { address } = useWeb3Context();

  if (!address) return null;

  return (
    <div className="wallet-link">
      {ens?.avatar && <img className="avatar" src={ens.avatar} alt={address} />}

      <Link href={`https://etherscan.io/address/${address}`} target="_blank">
        {ens?.name || shorten(address)}
      </Link>
    </div>
  );
}
