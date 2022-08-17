import { t } from "@lingui/macro";
import { Box, Button, Dialog, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { OHMTokenProps, Token } from "@olympusdao/component-library";
import { FC, SetStateAction } from "react";

type OHMTokenModalProps = {
  open: boolean;
  handleSelect: (name: SetStateAction<"sOHM" | "gOHM">) => void;
  handleClose: () => void;
};
/**
 * Component for Displaying TokenModal
 */
const TokenModal: FC<OHMTokenModalProps> = ({ open, handleSelect, handleClose }) => {
  const theme = useTheme();

  type TokenItem = {
    name: "sOHM" | "gOHM";
    balance: string;
  };
  const TokenItem: FC<TokenItem> = ({ name, balance }) => (
    <ListItem
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
    <Dialog open={open} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "9px" } }}>
      <Box paddingX="15px" paddingTop="22.5px" paddingBottom="15px">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography id="migration-modal-title" variant="h6" component="h2">
            {t`Select a token`}
          </Typography>
          <Button onClick={handleClose}>{/* <SvgIcon component={XIcon} color="primary" /> */}</Button>
        </Box>
        <List>
          <TokenItem name="sOHM" balance="0.00" />
          <TokenItem name="gOHM" balance="0.00" />
        </List>
      </Box>
    </Dialog>
  );
};

export default TokenModal;
