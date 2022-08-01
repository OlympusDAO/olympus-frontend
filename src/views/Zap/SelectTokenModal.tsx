import { t, Trans } from "@lingui/macro";
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
} from "@mui/material";
import { Token } from "@olympusdao/component-library";
import { ReactComponent as XIcon } from "src/assets/icons/x.svg";
import { trim } from "src/helpers";
import { ZapperToken } from "src/hooks/useZapTokenBalances";

function SelectTokenModal(
  handleClose: () => void,
  modalOpen: boolean,
  isTokensLoading: boolean,

  handleSelectToken: { (token: string): void },
  tokens: {
    regularTokens?: { [key: string]: ZapperToken };
    output?: boolean;
  },
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
          <Box />
          <Box paddingLeft={6}>
            <Typography id="migration-modal-title" variant="h6" component="h2">
              {t`Select Token`}
            </Typography>
          </Box>
          <Button onClick={handleClose}>
            <SvgIcon component={XIcon} color="primary" />
          </Button>
        </Box>
      </DialogTitle>
      <Box paddingX="36px" paddingBottom="16px" paddingTop="12px">
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
              {tokens.regularTokens &&
                Object.entries(tokens.regularTokens)
                  .filter(token => !token[1].hide)
                  .sort((tokenA, tokenB) => tokenB[1].balanceUSD - tokenA[1].balanceUSD)
                  .map(token => (
                    <ListItem button onClick={() => handleSelectToken(token[0])} key={token[1].symbol}>
                      <ListItemAvatar>
                        <Avatar src={token[1].displayProps.images[0]} />
                      </ListItemAvatar>
                      <ListItemText primary={token[1].symbol} />
                      <Box flexGrow={10} />
                      <ListItemText
                        style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}
                        primary={`$${trim(token[1].balanceUSD, 2)}`}
                        secondary={trim(token[1].balance, 4)}
                      />
                    </ListItem>
                  ))}
              {tokens.output && (
                <>
                  <ListItem button onClick={() => handleSelectToken("sOHM")} key={"sOHM"}>
                    <ListItemAvatar>
                      <Token name={"sOHM"} />
                    </ListItemAvatar>
                    <ListItemText primary={"sOHM"} />
                  </ListItem>
                  <ListItem button onClick={() => handleSelectToken("gOHM")} key={"gOHM"}>
                    <ListItemAvatar>
                      <Token name={"wsOHM"} />
                    </ListItemAvatar>
                    <ListItemText primary={"gOHM"} />
                  </ListItem>
                </>
              )}
            </List>
          </Paper>
        )}
      </Box>
    </Dialog>
  );
}

export default SelectTokenModal;
