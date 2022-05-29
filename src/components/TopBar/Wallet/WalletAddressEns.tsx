import { Link } from "@mui/material";
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
      <Link href={`https://etherscan.io/address/${account.address}`} target="_blank">
        {ensName || shorten(account.address)}
      </Link>
    </div>
  );
}
