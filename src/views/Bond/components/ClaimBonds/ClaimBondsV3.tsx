import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Paper, TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useScreenSize } from "src/hooks/useScreenSize";
import { BondDuration } from "src/views/Bond/components/BondDuration";
import { useClaimBondsV3 } from "src/views/Bond/components/ClaimBonds/hooks/useClaimBondsV3";
import { useGetBondTokenBalances } from "src/views/Bond/hooks/useBondTokens";

export const ClaimBondsV3 = () => {
  const isSmallScreen = useScreenSize("md");
  const claimBondsMutation = useClaimBondsV3();
  const { data: notes, isSuccess } = useGetBondTokenBalances();

  if (!notes || notes.length < 1 || !isSuccess) return null;

  const totalClaimableBalance = notes.reduce((res, note) => note.balance.add(res), new DecimalBigNumber("0", 0));

  //TODO: Fixed Term is not implemented
  return (
    <Paper headerText="Your V3 Bonds">
      <Box display="flex" justifyContent="center">
        <Box display="flex" flexDirection="column" alignItems="center" mt="24px" width={isSmallScreen ? "100%" : "50%"}>
          <Typography variant="h5" align="center" color="textSecondary" style={{ fontSize: "1.2rem" }}>
            Claimable Balance
          </Typography>

          <Box mt="4px" mb="8px">
            <Typography variant="h4" align="center">
              {totalClaimableBalance.toString({ decimals: 4, format: true })} OHM
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box mt="48px">
        {isSmallScreen ? (
          <>
            {notes.map(note => (
              <Box mt="32px">
                <Box display="flex" alignItems="center">
                  <TokenStack tokens={[note.underlyingTokenSymbol]} />

                  <Box ml="8px">
                    <Typography>{note.symbol}</Typography>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" mt="16px">
                  <Typography>Payout</Typography>

                  <Typography>{note.balance.toString({ decimals: 4, format: true })} OHM</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mt="8px">
                  <Typography>Remaining Duration</Typography>
                  <Typography>
                    {note.matured > Date.now() / 1000 ? (
                      <BondDuration duration={note.matured - Date.now() / 1000} />
                    ) : (
                      "Fully Vested"
                    )}
                  </Typography>
                </Box>

                <Box mt="16px">
                  <TertiaryButton
                    fullWidth
                    disabled={note.matured > Date.now() / 1000 || claimBondsMutation.isLoading}
                    onClick={() => claimBondsMutation.mutate({ token: note.token, amount: note.balance })}
                  >
                    {claimBondsMutation.isLoading && claimBondsMutation.variables?.token === note.token
                      ? `Claiming...`
                      : `Claim`}
                  </TertiaryButton>
                </Box>
              </Box>
            ))}
          </>
        ) : (
          <TableContainer>
            <Table aria-label="Available bonds" style={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "230px", padding: "8px 0" }}>Token</TableCell>

                  <TableCell style={{ padding: "8px 0" }}>Remaining</TableCell>

                  <TableCell style={{ padding: "8px 0" }}>Payout</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notes.map(note => (
                  <TableRow>
                    <TableCell style={{ padding: "8px 0" }}>
                      <Box display="flex" alignItems="center">
                        <TokenStack tokens={[note.underlyingTokenSymbol]} />
                        <Box display="flex" flexDirection="column" ml="16px">
                          <Typography>{note.symbol}</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell style={{ padding: "8px 0" }}>
                      <Typography>
                        {note.matured > Date.now() / 1000 ? (
                          <BondDuration duration={note.matured - Date.now() / 1000} />
                        ) : (
                          "Fully Vested"
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell style={{ padding: "8px 0" }}>
                      <Typography>{note.balance.toString({ decimals: 4, format: true })} OHM</Typography>
                    </TableCell>

                    <TableCell style={{ padding: "8px 0" }}>
                      <TertiaryButton
                        fullWidth
                        disabled={note.matured > Date.now() / 1000 || claimBondsMutation.isLoading}
                        onClick={() => claimBondsMutation.mutate({ token: note.token, amount: note.balance })}
                      >
                        {claimBondsMutation.isLoading && claimBondsMutation.variables?.token === note.token
                          ? `Claiming...`
                          : `Claim`}
                      </TertiaryButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Paper>
  );
};
