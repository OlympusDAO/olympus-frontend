import { Link } from "@material-ui/core";
import { shorten } from "src/helpers";
import { useAddress } from "src/hooks/useAddress";
import { useEns } from "src/hooks/useENS";

export default function WalletAddressEns() {
  const { data: ens } = useEns();
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
