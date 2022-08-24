import { t } from "@lingui/macro";
import { Avatar, Box, CircularProgress, Dialog, Link, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Icon, OHMTokenProps, Token } from "@olympusdao/component-library";
import { FC } from "react";
import { trim } from "src/helpers";
import { useZapTokenBalances } from "src/hooks/useZapTokenBalances";

type OHMTokenModalProps = {
  open: boolean;
  handleSelect: (name: string, imageUrl?: string, balance?: string) => void;
  handleClose: () => void;
  ohmBalance?: string;
  sOhmBalance?: string;
  gOhmBalance?: string;
  showZapAssets?: boolean;
};
/**
 * Component for Displaying TokenModal
 */
const TokenModal: FC<OHMTokenModalProps> = ({
  open,
  handleSelect,
  handleClose,
  ohmBalance = "0.00",
  sOhmBalance = "0.00",
  gOhmBalance = "0.00",
  showZapAssets = false,
}) => {
  const theme = useTheme();
  const { data: zapTokenBalances = { balances: {} }, isLoading } = useZapTokenBalances();
  const tokensBalance = zapTokenBalances.balances;

  const showZap = showZapAssets && tokensBalance;

  type TokenItem = {
    name: string;
    balance: string;
    icon?: string;
    usdValue?: string;
  };
  const TokenItem: FC<TokenItem> = ({ name, balance, icon, ...props }) => {
    return (
      <ListItem
        key={name}
        button
        onClick={() => {
          console.log(icon, "icon");
          handleSelect(name, icon);
          handleClose();
        }}
        sx={{ borderBottom: `1px solid ${theme.colors.gray[500]}` }}
        {...props}
      >
        {icon ? (
          <Avatar src={icon} sx={{ width: "15px", height: "15px" }} />
        ) : (
          <Token name={name as OHMTokenProps["name"]} sx={{ fontSize: "15px" }} />
        )}

        <ListItemText
          primaryTypographyProps={{
            sx: { marginLeft: "6px", fontWeight: 500, lineHeight: "24px", fontSize: "15px" },
          }}
          primary={name}
        />
        <Box flexGrow={10} />
        <ListItemText
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}
          secondaryTypographyProps={{ sx: { fontSize: "12px", lineHeight: "15px" } }}
          secondary={balance}
        />
      </ListItem>
    );
  };
  return (
    <Dialog open={open} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "9px" } }} onClose={handleClose}>
      <Box paddingX="15px" paddingTop="22.5px" paddingBottom="15px">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography id="migration-modal-title" variant="h6" component="h2">
            {t`Select a token`}
          </Typography>
          <Link>
            <Icon name="x" onClick={handleClose} sx={{ fontSize: "19px" }} />
          </Link>
        </Box>
        <List>
          {showZap ? (
            isLoading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TokenItem name="OHM" balance={ohmBalance} />
                {Object.entries(tokensBalance)
                  .filter(token => !token[1].hide)
                  .sort((tokenA, tokenB) => tokenB[1].balanceUSD - tokenA[1].balanceUSD)
                  .map(token => (
                    <TokenItem
                      icon={token[1].displayProps.images[0]}
                      name={token[1].symbol}
                      balance={trim(token[1].balance, 4)}
                      usdValue={`${trim(token[1].balanceUSD, 2)}`}
                    />
                  ))}
              </>
            )
          ) : (
            <>
              <TokenItem name="sOHM" balance={sOhmBalance} />
              <TokenItem name="gOHM" balance={gOhmBalance} data-testid="gOHM-select" />
            </>
          )}
        </List>
      </Box>
    </Dialog>
  );
};

export default TokenModal;
