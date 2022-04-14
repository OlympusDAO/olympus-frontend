import { t, Trans } from "@lingui/macro";
import {
  Box,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@material-ui/core";
import { Paper, PrimaryButton, TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { trim } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useAppSelector, useBonds, useWeb3Context } from "src/hooks";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useScreenSize } from "src/hooks/useScreenSize";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { redeemBond } from "src/slices/BondSlice";
import { isPendingTxn } from "src/slices/PendingTxnsSlice";

import { BondDuration } from "../BondDuration";
import { useBondNotes } from "./hooks/useBondNotes";
import { useClaimBonds } from "./hooks/useClaimBonds";

export const ClaimBonds = () => {
  const notes = useBondNotes().data;
  const isSmallScreen = useScreenSize("md");
  const claimBondsMutation = useClaimBonds();
  const currentIndex = useCurrentIndex().data;
  const [isPayoutGohm, setIsPayoutGohm] = useState(false);

  const v1 = useAppSelector(state => Object.entries(state.account.bonds).filter(([_, bond]) => bond.interestDue > 0));

  if (!notes || notes.length < 1) return null;

  const totalClaimableBalance = notes.reduce((res, note) => note.payout.add(res), new DecimalBigNumber("0", 0));

  return (
    <Paper headerText="Your Bonds">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h4" align="center" color="textSecondary">
          Payout Options
        </Typography>

        <Tabs
          centered
          textColor="primary"
          indicatorColor="primary"
          value={isPayoutGohm ? 1 : 0}
          aria-label="Payout token tabs"
          onChange={(_, view) => setIsPayoutGohm(view === 1)}
        >
          <Tab aria-label="payout-sohm-button" label="sOHM" style={{ fontSize: "1rem" }} />
          <Tab aria-label="payout-sohm-button" label="gOHM" style={{ fontSize: "1rem" }} />
        </Tabs>
      </Box>

      <Box display="flex" justifyContent="center">
        <Box display="flex" flexDirection="column" alignItems="center" mt="24px" width={isSmallScreen ? "100%" : "50%"}>
          <Typography variant="h5" align="center" color="textSecondary" style={{ fontSize: "1.2rem" }}>
            <Trans>Claimable Balance</Trans>
          </Typography>

          <Box mt="4px" mb="8px">
            <Typography variant="h4" align="center">
              {isPayoutGohm
                ? `${totalClaimableBalance.toString({ decimals: 4, format: true })} gOHM`
                : `${currentIndex?.mul(totalClaimableBalance).toString({ decimals: 4, format: true })} sOHM`}
            </Typography>
          </Box>

          <PrimaryButton
            fullWidth
            className=""
            disabled={claimBondsMutation.isLoading}
            onClick={() => claimBondsMutation.mutate({ isPayoutGohm })}
          >
            {claimBondsMutation.isLoading && !claimBondsMutation.variables?.hasOwnProperty("id")
              ? t`Claiming all...`
              : t`Claim All`}
          </PrimaryButton>
        </Box>
      </Box>

      <Box mt="48px">
        {isSmallScreen ? (
          <>
            {notes.map(note => (
              <Box mt="32px">
                <Box display="flex" alignItems="center">
                  <TokenStack tokens={note.bond.quoteToken.icons} />

                  <Box ml="8px">
                    <Typography>{note.bond.quoteToken.name}</Typography>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" mt="16px">
                  <Typography>Payout</Typography>

                  <Typography>
                    {isPayoutGohm
                      ? `${note.payout.toString({ decimals: 4, format: true })} gOHM`
                      : `${currentIndex?.mul(note.payout).toString({ decimals: 4, format: true })} sOHM`}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mt="8px">
                  <Typography>Remaining Duration</Typography>
                  <Typography>
                    {Date.now() > note.matured ? (
                      "Fully Vested"
                    ) : (
                      <BondDuration duration={(note.matured - Date.now()) / 1000} />
                    )}
                  </Typography>
                </Box>

                <Box mt="16px">
                  <TertiaryButton
                    fullWidth
                    disabled={Date.now() < note.matured || claimBondsMutation.isLoading}
                    onClick={() => claimBondsMutation.mutate({ id: note.id, isPayoutGohm })}
                  >
                    {claimBondsMutation.isLoading && claimBondsMutation.variables?.id === note.id
                      ? t`Claiming...`
                      : t`Claim`}
                  </TertiaryButton>
                </Box>
              </Box>
            ))}

            {v1.map(([id, bond]) => (
              <V1BondCard key={id} bond={bond} />
            ))}
          </>
        ) : (
          <TableContainer>
            <Table aria-label="Available bonds" style={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "230px", padding: "8px 0" }}>
                    <Trans>Token</Trans>
                  </TableCell>
                  <TableCell style={{ padding: "8px 0" }}>
                    <Trans>Duration</Trans>
                  </TableCell>
                  <TableCell style={{ padding: "8px 0" }}>
                    <Trans>Remaining</Trans>
                  </TableCell>
                  <TableCell style={{ padding: "8px 0" }}>
                    <Trans>Payout</Trans>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notes.map(note => (
                  <TableRow>
                    <TableCell style={{ padding: "8px 0" }}>
                      <Box display="flex" alignItems="center">
                        <TokenStack tokens={note.bond.quoteToken.icons} />

                        <Box display="flex" flexDirection="column" ml="16px">
                          <Typography>{note.bond.quoteToken.name}</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell style={{ padding: "8px 0" }}>
                      <Typography>
                        <BondDuration duration={note.bond.duration} />
                      </Typography>
                    </TableCell>

                    <TableCell style={{ padding: "8px 0" }}>
                      <Typography>
                        {Date.now() > note.matured ? (
                          "Fully Vested"
                        ) : (
                          <BondDuration duration={(note.matured - Date.now()) / 1000} />
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell style={{ padding: "8px 0" }}>
                      <Typography>
                        {isPayoutGohm
                          ? `${note.payout.toString({ decimals: 4, format: true })} gOHM`
                          : `${currentIndex?.mul(note.payout).toString({ decimals: 4, format: true })} sOHM`}
                      </Typography>
                    </TableCell>

                    <TableCell style={{ padding: "8px 0" }}>
                      <TertiaryButton
                        fullWidth
                        disabled={Date.now() < note.matured || claimBondsMutation.isLoading}
                        onClick={() => claimBondsMutation.mutate({ id: note.id, isPayoutGohm })}
                      >
                        {claimBondsMutation.isLoading && claimBondsMutation.variables?.id === note.id
                          ? t`Claiming...`
                          : t`Claim`}
                      </TertiaryButton>
                    </TableCell>
                  </TableRow>
                ))}

                {v1.map(([id, bond]) => (
                  <V1BondRow key={id} bond={bond} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Paper>
  );
};

const V1BondRow: React.VFC<{ bond: IUserBondDetails }> = ({ bond }) => {
  const dispatch = useDispatch();
  const { address, networkId, provider } = useWeb3Context();
  const { bonds, expiredBonds } = useBonds(networkId);
  const pendingTransactions = useAppSelector(state => state.pendingTransactions);

  const isLoading =
    isPendingTxn(pendingTransactions, "redeem_bond_" + bond.displayName) ||
    isPendingTxn(pendingTransactions, "redeem_all_bonds") ||
    isPendingTxn(pendingTransactions, "redeem_all_bonds_autostake");

  const onRedeem = () => {
    const currentBond = [...bonds, ...expiredBonds].find(_bond => _bond.name === bond.bond);

    if (!currentBond) return;

    dispatch(
      redeemBond({
        address,
        provider,
        autostake: false,
        bond: currentBond,
        networkID: networkId,
      }),
    );
  };

  return (
    <TableRow>
      <TableCell style={{ padding: "8px 0" }}>
        <Box display="flex" alignItems="center">
          <TokenStack tokens={bond.bondIconSvg} />

          <Box display="flex" flexDirection="column" ml="16px">
            <Typography>{bond.displayName}</Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }} />

      <TableCell style={{ padding: "8px 0" }}>
        <Typography>Fully Vested</Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <Typography>{trim(bond.interestDue, 4)}</Typography>
      </TableCell>

      <TableCell style={{ padding: "8px 0" }}>
        <TertiaryButton fullWidth onClick={onRedeem} disabled={isLoading}>
          {isLoading ? t`Claiming...` : t`Claim`}
        </TertiaryButton>
      </TableCell>
    </TableRow>
  );
};

const V1BondCard: React.VFC<{ bond: IUserBondDetails }> = ({ bond }) => {
  const dispatch = useDispatch();
  const { address, networkId, provider } = useWeb3Context();
  const { bonds, expiredBonds } = useBonds(networkId);
  const pendingTransactions = useAppSelector(state => state.pendingTransactions);

  const isLoading =
    isPendingTxn(pendingTransactions, "redeem_bond_" + bond.displayName) ||
    isPendingTxn(pendingTransactions, "redeem_all_bonds") ||
    isPendingTxn(pendingTransactions, "redeem_all_bonds_autostake");

  const onRedeem = () => {
    const currentBond = [...bonds, ...expiredBonds].find(_bond => _bond.name === bond.bond);

    if (!currentBond) return;

    dispatch(
      redeemBond({
        address,
        provider,
        autostake: false,
        bond: currentBond,
        networkID: networkId,
      }),
    );
  };

  return (
    <Box mt="32px">
      <Box display="flex" alignItems="center">
        <TokenStack tokens={bond.bondIconSvg} />

        <Box ml="8px">
          <Typography>{bond.displayName}</Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="16px">
        <Typography>Payout</Typography>

        <Typography>{trim(bond.interestDue, 4)}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mt="8px">
        <Typography>Remaining Duration</Typography>

        <Typography>
          <Trans>Fully Vested</Trans>
        </Typography>
      </Box>

      <Box mt="16px">
        <TertiaryButton fullWidth disabled={isLoading} onClick={onRedeem}>
          {isLoading ? t`Claiming...` : t`Claim`}
        </TertiaryButton>
      </Box>
    </Box>
  );
};
