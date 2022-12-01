import { Box, Button, Link, SvgIcon, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Icon, OHMButtonProps, PrimaryButton } from "@olympusdao/component-library";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { trackGAEvent } from "src/helpers/analytics/trackGAEvent";

const fireAnalyticsEvent = () => {
  trackGAEvent({
    category: "App",
    action: "connect",
  });
};

export const InPageConnectButton = ({
  fullWidth = false,
  size = "medium",
}: {
  fullWidth?: boolean;
  size?: OHMButtonProps["size"];
}) => {
  return (
    <RainbowConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
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
                return (
                  <PrimaryButton
                    fullWidth={fullWidth}
                    onClick={() => {
                      fireAnalyticsEvent();
                      openConnectModal();
                    }}
                    size={size}
                  >
                    <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
                    Connect Wallet
                  </PrimaryButton>
                );
              }
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};
export const ConnectButton = () => {
  const location = useLocation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

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
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      sx={{
                        height: "39px",
                        borderRadius: "6px",
                        padding: "9px 18px",
                        cursor: "pointer",
                        background: theme.colors.paper.card,
                        "&:hover": { background: theme.colors.paper.cardHover },
                      }}
                      onClick={() => {
                        fireAnalyticsEvent();
                        openConnectModal();
                      }}
                    >
                      <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
                      <Typography>{`Connect`}</Typography>
                    </Box>
                  );
                } else {
                  return (
                    <Link
                      component={RouterLink}
                      to={"/wallet"}
                      state={{ prevPath: location.pathname }}
                      style={{ marginRight: "0px" }}
                      sx={{ zIndex: 18 }}
                    >
                      {!mobile ? (
                        <PrimaryButton>
                          <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
                          {`Connect Wallet`}
                        </PrimaryButton>
                      ) : (
                        <Button
                          sx={{
                            fontSize: "0.875rem",
                            height: "39px",
                            minWidth: "39px",
                            borderRadius: "6px",
                            background:
                              theme.palette.mode === "dark" ? theme.colors.gray[500] : theme.colors.paper.card,
                            color: theme.colors.gray[10],
                            "&:hover": {
                              background:
                                theme.palette.mode === "dark" ? theme.colors.gray[90] : theme.colors.paper.cardHover,
                              color: theme.colors.gray[10],
                            },
                          }}
                        >
                          <SvgIcon component={WalletIcon} />
                        </Button>
                      )}
                    </Link>
                  );
                }
              }
              return (
                <Box display="flex" alignItems="center">
                  {walletDrawerOpen ? (
                    <>
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                          marginRight: "9px",
                          fontSize: "0.875rem",
                          height: "39px",
                          borderRadius: "6px",
                          padding: "9px 18px",
                          cursor: "pointer",
                          fontWeight: 500,
                          background: theme.palette.mode === "light" ? theme.colors.paper.card : theme.colors.gray[600],
                        }}
                        onClick={chain.unsupported ? openChainModal : openAccountModal}
                      >
                        <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
                        {chain.unsupported ? "Unsupported Network" : account.displayName}
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                          height: "39px",
                          borderRadius: "6px",
                          padding: "9px 18px",
                          cursor: "pointer",
                          background: theme.palette.mode === "light" ? theme.colors.paper.card : theme.colors.gray[600],
                          "&:hover": {
                            background:
                              theme.palette.mode === "light" ? theme.colors.paper.cardHover : theme.colors.gray[500],
                          },
                        }}
                        onClick={openChainModal}
                      >
                        {chain.unsupported && (
                          <Icon name="alert-circle" style={{ fill: theme.colors.feedback.error }} />
                        )}
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
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 24, height: 24 }}
                              />
                            )}
                          </div>
                        )}
                      </Box>
                    </>
                  ) : (
                    <Link
                      component={RouterLink}
                      to={"/wallet"}
                      state={{ prevPath: location.pathname }}
                      style={{ marginRight: "0px" }}
                    >
                      {mobile ? (
                        <Button
                          sx={{
                            fontSize: "0.875rem",
                            height: "39px",
                            minWidth: "39px",
                            borderRadius: "6px",
                            background:
                              theme.palette.mode === "dark" ? theme.colors.gray[500] : theme.colors.paper.card,
                            color: theme.colors.gray[10],
                            "&:hover": {
                              background:
                                theme.palette.mode === "dark" ? theme.colors.gray[90] : theme.colors.paper.cardHover,
                              color: theme.colors.gray[10],
                            },
                          }}
                        >
                          <SvgIcon component={WalletIcon} />
                        </Button>
                      ) : (
                        <Button
                          sx={{
                            borderRadius: "6px",
                            padding: "9px 18px",
                            marginLeft: "9px",
                            fontSize: "0.875rem",
                            height: "39px",
                            background: theme.colors.gray[500],
                            color: theme.colors.gray[10],
                            "&:hover": { background: theme.colors.gray[90], color: theme.colors.gray[10] },
                          }}
                        >
                          <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
                          {chain.unsupported ? "Unsupported Network" : account.displayName}
                        </Button>
                      )}
                    </Link>
                  )}
                </Box>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

export default ConnectButton;
