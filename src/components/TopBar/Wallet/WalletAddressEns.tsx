import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { shorten } from "src/helpers";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";

export default function WalletAddressEns() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address, enabled: !!address });
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: address, enabled: !!address });

  if (!address) return null;

  return (
    <div className="wallet-link">
      {ensAvatar && <img className="avatar" src={ensAvatar} alt={address} />}
      <Link to="/wallet" component={RouterLink}>
        {ensName || shorten(address)}
      </Link>
    </div>
  );
}
