import { t } from "@lingui/macro";
import { Button, SvgIcon, Typography, useTheme } from "@mui/material";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";

export const ConnectButton = () => {
  const location = useLocation();
  const theme = useTheme();
  console.log(location, "location");

  const walletDrawerOpen =
    location.pathname === "/wallet" || location.pathname === "/utility" || location.pathname === "/info" ? true : false;

  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                if (walletDrawerOpen) {
                  return (
                    <Button variant="contained" color="secondary" onClick={openConnectModal}>
                      <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
                      <Typography>{t`Connect`}</Typography>
                    </Button>
                  );
                } else {
                  return (
                    <Link to={"/wallet"} state={{ prevPath: location.pathname }} style={{ marginRight: "0px" }}>
                      <Button variant="contained" color="secondary">
                        <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
                        <Typography>{t`Connect`}</Typography>
                      </Button>
                    </Link>
                  );
                }
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    style={{ fontSize: "0.875rem" }}
                    variant="contained"
                    color="secondary"
                  >
                    <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
                    Unsupported Network
                  </Button>
                );
              }

              return (
                <div style={{ display: "flex" }}>
                  <Button
                    style={{ fontSize: "0.875rem" }}
                    variant="contained"
                    color="secondary"
                    onClick={openChainModal}
                    sx={{ background: walletDrawerOpen ? theme.colors.paper.card : theme.colors.paper.background }}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 24,
                          height: 24,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        {chain.iconUrl && (
                          <img alt={chain.name ?? "Chain icon"} src={chain.iconUrl} style={{ width: 24, height: 24 }} />
                        )}
                      </div>
                    )}
                  </Button>
                  {walletDrawerOpen ? (
                    <Button
                      style={{ fontSize: "0.875rem" }}
                      variant="contained"
                      color="secondary"
                      sx={{ background: theme.colors.paper.card }}
                      onClick={openAccountModal}
                    >
                      <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
                      {account.displayName}
                    </Button>
                  ) : (
                    <Link to={"/wallet"} state={{ prevPath: location.pathname }} style={{ marginRight: "0px" }}>
                      <Button style={{ fontSize: "0.875rem" }} variant="contained" color="secondary">
                        <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
                        {account.displayName}
                      </Button>
                    </Link>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

export default ConnectButton;
