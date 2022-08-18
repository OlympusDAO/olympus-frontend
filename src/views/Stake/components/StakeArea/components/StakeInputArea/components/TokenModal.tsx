import { t } from "@lingui/macro";
import { Box, Dialog, Link, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Icon, OHMTokenProps, Token } from "@olympusdao/component-library";
import { FC, SetStateAction } from "react";

type OHMTokenModalProps = {
  open: boolean;
  handleSelect: (name: SetStateAction<"sOHM" | "gOHM">) => void;
  handleClose: () => void;
  sOhmBalance?: string;
  gOhmBalance?: string;
};
/**
 * Component for Displaying TokenModal
 */
const TokenModal: FC<OHMTokenModalProps> = ({
  open,
  handleSelect,
  handleClose,
  sOhmBalance = "0.00",
  gOhmBalance = "0.00",
}) => {
  const theme = useTheme();

  type TokenItem = {
    name: "sOHM" | "gOHM";
    balance: string;
  };
  const TokenItem: FC<TokenItem> = ({ name, balance }) => (
    <ListItem
      key={name}
      button
      onClick={() => {
        handleSelect(name);
        handleClose();
      }}
      sx={{ borderBottom: `1px solid ${theme.colors.gray[500]}` }}
    >
      <Token name={name as OHMTokenProps["name"]} sx={{ fontSize: "15px" }} />
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
          <TokenItem name="sOHM" balance={sOhmBalance} />
          <TokenItem data-test-id="gOHM-select" name="gOHM" balance={gOhmBalance} />
        </List>
      </Box>
    </Dialog>
  );
};

export default TokenModal;
