import "./YieldRecipients.scss";

import { Trans } from "@lingui/macro";
import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { TertiaryButton } from "@olympusdao/component-library";
import { useSelector } from "react-redux";
import { GiveBox as Box } from "src/components/GiveProject/GiveBox";
import { useDonationInfo } from "src/hooks/useGiveInfo";
import { DonationInfoState, IButtonChangeView } from "src/views/Give/Interfaces";

import { DepositTableRow } from "./DepositRow";

type RecipientModalProps = {
  changeView: IButtonChangeView;
};

export default function YieldRecipients({ changeView }: RecipientModalProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const isAppLoading = useSelector((state: DonationInfoState) => state.app.loading);
  const rawDonationInfo = useDonationInfo().data;
  const donationInfo = rawDonationInfo ? rawDonationInfo : [];

  const isDonationInfoLoading = useSelector((state: DonationInfoState) => state.account.loading);
  const isLoading = isAppLoading || isDonationInfoLoading;

  if (isLoading) {
    return <Skeleton />;
  }

  if (!donationInfo || donationInfo.length == 0) {
    return (
      <Box>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} container justifyContent="center">
            <Typography variant="body1">
              <Trans>Looks like you haven’t made any donations yet</Trans>
            </Typography>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <TertiaryButton onClick={() => changeView(0)}>
              <Trans>Donate to a cause</Trans>
            </TertiaryButton>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // TODO extract the table and styles into a common component
  return (
    <TableContainer>
      <Table className="donation-table">
        <TableHead>
          <TableRow>
            {!isSmallScreen && (
              <TableCell align="left">
                <Typography variant="body1">
                  <Trans>DATE</Trans>
                </Typography>
              </TableCell>
            )}
            <TableCell align="left">
              <Typography variant="body1">
                <Trans>RECIPIENT</Trans>
              </Typography>
            </TableCell>
            {!isSmallScreen && (
              <TableCell align="right">
                <Typography variant="body1">
                  <Trans>DEPOSITED</Trans>
                </Typography>
              </TableCell>
            )}
            <TableCell align="right">
              <Typography variant="body1">
                <Trans>YIELD SENT</Trans>
              </Typography>
            </TableCell>
            <TableCell align="right" className="manage-cell"></TableCell>
          </TableRow>
        </TableHead>
        <Divider className="table-head-divider" />
        <TableBody>
          {isLoading ? (
            <Skeleton />
          ) : (
            donationInfo.map(donation => {
              return <DepositTableRow depositObject={donation} key={donation.recipient} />;
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
