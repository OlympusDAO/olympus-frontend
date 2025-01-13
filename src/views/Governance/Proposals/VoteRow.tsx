import { Box, Link, TableCell, Tooltip, Typography } from "@mui/material";
import { abbreviatedNumber } from "src/helpers";
import { truncateEthereumAddress } from "src/helpers/truncateAddress";
import { useEnsName } from "wagmi";

export const VoteRow = ({
  voter,
  reason,
  votes,
  tx,
}: {
  voter: { address: string };
  reason?: string;
  votes: string;
  tx: string;
}) => {
  const { data: ensName } = useEnsName({ address: voter.address as `0x${string}` });
  return (
    <>
      <TableCell>
        <Link href={`https://etherscan.io/tx/${tx}`} target="_blank" rel="noopener noreferrer">
          <Tooltip title={voter.address}>
            <Box>{ensName || truncateEthereumAddress(voter.address)}</Box>
          </Tooltip>
        </Link>
        {/* Render the reason if provided, and style it as a comment */}
        {reason && (
          <Typography variant="body2" sx={{ color: "gray", fontStyle: "italic", mt: 1 }}>
            "{reason}"
          </Typography>
        )}
      </TableCell>
      <TableCell align="right">{abbreviatedNumber.format(Number(votes || 0))} gOHM</TableCell>
    </>
  );
};
