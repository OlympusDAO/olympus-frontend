import useENS from "src/hooks/useENS";
import { useWeb3Context } from "src/hooks/web3Context";
import { shorten } from "src/helpers";
import { Link } from "@material-ui/core";
export default function WalletAddressEns() {
  const { address } = useWeb3Context();
  const { ensName, ensAvatar } = useENS(address);

  return (
    <div>
      {address && (
        <div className="wallet-link">
          {ensAvatar && <img className="avatar" src={ensAvatar} alt={address} />}
          <Link href={`https://etherscan.io/address/${address}`} target="_blank">
            {ensName || shorten(address)}
          </Link>
        </div>
      )}
    </div>
  );
}
