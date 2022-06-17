import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { shorten } from "src/helpers";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";

export default function WalletAddressEns() {
  const { data: account } = useAccount();
  const { data: ensName } = useEnsName({ address: account?.address });
  const { data: ensAvatar } = useEnsAvatar({ addressOrName: account?.address });

  if (!account?.address) return null;

  return (
    <div className="wallet-link">
      {ensAvatar && <img className="avatar" src={ensAvatar} alt={account.address} />}
      <Link to="/wallet" component={RouterLink}>
        {ensName || shorten(account.address)}
      </Link>
    </div>
  );
}
