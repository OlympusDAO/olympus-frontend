import { Avatar, Box, CircularProgress, Dialog, Link, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Icon, OHMTokenProps, Token } from "@olympusdao/component-library";
import { FC } from "react";
import { trim } from "src/helpers";
import { useZapTokenBalances } from "src/hooks/useZapTokenBalances";

export interface ModalHandleSelectProps {
  name: string;
  icon?: string;
  address?: string;
  balance?: string;
  price?: number;
  decimals?: number;
}
type TokenItem = {
  name: string;
  balance: string;
  icon?: string;
  usdValue?: string;
  address?: string;
  price?: number;
  decimals?: number;
};

type OHMTokenModalProps = {
  open: boolean;
  handleSelect: (data: ModalHandleSelectProps) => void;
  handleClose: () => void;
  ohmBalance?: string;
  sOhmBalance?: string;
  gOhmBalance?: string;
  showZapAssets?: boolean;
  alwaysShowTokens?: { name: OHMTokenProps["name"]; balance: string; address: string; price: number }[];
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
  alwaysShowTokens,
}) => {
  const theme = useTheme();
  const { data: zapTokenBalances = { balances: {} }, isLoading } = useZapTokenBalances();
  const tokensBalance = zapTokenBalances.balances;
  console.log(tokensBalance, "tokensBalance");
  const showZap = showZapAssets && tokensBalance;

  const TokenItem: FC<TokenItem> = ({ name, balance = "0", icon, address = "", price, decimals, ...props }) => {
    return (
      <ListItem
        key={name}
        button
        onClick={() => {
          handleSelect({ name, balance, icon, address, price, decimals });
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
            {`Select a token`}
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
                {alwaysShowTokens && (
                  <>
                    {alwaysShowTokens.map(token => (
                      <TokenItem
                        name={token.name}
                        balance={token.balance}
                        address={token.address}
                        price={token.price}
                      />
                    ))}
                  </>
                )}
                <TokenItem name="OHM" balance={ohmBalance} />
                {parseInt(sOhmBalance) > 0 && <TokenItem name="sOHM" balance={sOhmBalance} />}
                {Object.entries(tokensBalance)
                  .filter(token => !token[1].hide)
                  .sort((tokenA, tokenB) => tokenB[1].balanceUSD - tokenA[1].balanceUSD)
                  .map(token => (
                    <TokenItem
                      key={token[1].symbol}
                      icon={token[1].displayProps.images[0]}
                      name={token[1].symbol}
                      balance={trim(token[1].balance, 4)}
                      usdValue={`${trim(token[1].balanceUSD, 2)}`}
                      address={token[1].address}
                      price={token[1].price}
                      decimals={token[1].decimals}
                    />
                  ))}
              </>
            )
          ) : (
            <>
              {parseInt(sOhmBalance) > 0 && <TokenItem name="sOHM" balance={sOhmBalance} />}
              <TokenItem name="gOHM" balance={gOhmBalance} data-testid="gOHM-select" />
            </>
          )}
        </List>
      </Box>
    </Dialog>
  );
};

export default TokenModal;
