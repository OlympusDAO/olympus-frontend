import { Link, Stack } from "@mui/material";
import { shorten } from "src/helpers";
import { useWeb3Context } from "src/hooks";
import { useEns } from "src/hooks/useENS";

export const WalletAddressEns: React.FC<{ noAvatar?: boolean }> = ({ noAvatar = false }) => {
  const { data: ens } = useEns();
  const { address } = useWeb3Context();

  if (!address) return null;

  return (
    <Stack direction="row" spacing="12px" alignItems="center">
      {ens?.avatar && !noAvatar && <img src={ens.avatar} alt={address} style={{ height: 20, borderRadius: "100%" }} />}

      <Link href={`https://etherscan.io/address/${address}`} target="_blank">
        {ens?.name || shorten(address)}
      </Link>
    </Stack>
  );
};
