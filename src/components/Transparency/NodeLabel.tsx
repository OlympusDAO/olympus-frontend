import { Link, Typography } from "@material-ui/core";
import { shorten } from "src/helpers";

type NodeLabelProps = {
  label: string;
  address: string;
};

export const NodeLabel = ({ label, address }: NodeLabelProps) => {
  return (
    <>
      <Typography variant="h6">{label}</Typography>
      <Link href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener" underline="none">
        {shorten(address)}
      </Link>
    </>
  );
};
