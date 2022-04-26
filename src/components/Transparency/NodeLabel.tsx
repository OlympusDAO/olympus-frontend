import { Link, Typography } from "@material-ui/core";
import { shorten } from "src/helpers";

type NodeLabelProps = {
  label: string;
  address: string;
  labelSpacing: number | undefined;
};

export const NodeLabel = ({ label, address, labelSpacing = 0 }: NodeLabelProps) => {
  return (
    <>
      <Typography variant="h6" style={{ paddingBottom: `${labelSpacing}px` }}>
        {label}
      </Typography>
      <Link href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener" underline="none">
        {shorten(address)}
      </Link>
    </>
  );
};
