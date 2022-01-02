import { useENS } from "src/hooks/useENS";
import { shorten } from "src/helpers";
import { Link } from "@material-ui/core";
import { useAddress } from "src/hooks/useAddress";

export default function WalletAddressEns() {
  const { data: ens } = useENS();
  const { data: address } = useAddress();

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
