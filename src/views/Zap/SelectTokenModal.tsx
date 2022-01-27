import { Trans } from "@lingui/macro";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  SvgIcon,
  Typography,
} from "@material-ui/core";
import { trim } from "src/helpers";
import { ZapperToken } from "src/helpers/ZapHelper";

import { ReactComponent as XIcon } from "../../assets/icons/x.svg";

function SelectTokenModal(
  handleClose: () => void,
  modalOpen: boolean,
  isTokensLoading: boolean,
  tokens: { [key: string]: ZapperToken },
  handleSelectZapToken: { (token: string): void; (arg0: string): void },
  zapperCredit: JSX.Element,
) {
  return (
    <Dialog
      onClose={handleClose}
      open={modalOpen}
      keepMounted
      fullWidth
      maxWidth="xs"
      id="zap-select-token-modal"
      className="zap-card"
    >
      <DialogTitle>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Button onClick={handleClose}>
            <SvgIcon component={XIcon} color="primary" />
          </Button>
          <Box paddingRight={6}>
            <Typography id="migration-modal-title" variant="h6" component="h2">
              <Trans>Select Zap Token</Trans>
            </Typography>
          </Box>
          <Box />
        </Box>
      </DialogTitle>
      <Box paddingX="36px" paddingBottom="36px" paddingTop="12px">
        {isTokensLoading ? (
          <Box display="flex" justifyItems="center" flexDirection="column" alignItems="center">
            <CircularProgress />
            <Box height={24} />
            <Typography>
              <Trans>Dialing Zapper...</Trans>
            </Typography>
          </Box>
        ) : Object.entries(tokens).length == 0 ? (
          <Box display="flex" justifyContent="center">
            <Typography>
              <Trans>Ser, you have no assets...</Trans>
            </Typography>
          </Box>
        ) : (
          <Paper style={{ maxHeight: 300, overflow: "auto", borderRadius: 10 }}>
            <List>
              {Object.entries(tokens)
                .filter(token => !token[1].hide)
                .sort((tokenA, tokenB) => tokenB[1].balanceUSD - tokenA[1].balanceUSD)
                .map(token => (
                  <ListItem button onClick={() => handleSelectZapToken(token[0])} key={token[1].symbol}>
                    <ListItemAvatar>
                      <Avatar src={token[1].tokenImageUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={token[1].symbol} />
                    <Box flexGrow={10} />
                    <ListItemText
                      // style={{ primary: { justify: "center" } }}
                      primary={`$${trim(token[1].balanceUSD, 2)}`}
                      secondary={trim(token[1].balance, 4)}
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        )}
        {zapperCredit}
      </Box>
    </Dialog>
  );
}

export default SelectTokenModal;
