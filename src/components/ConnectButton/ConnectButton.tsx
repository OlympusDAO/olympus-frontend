import { Box, Button, SvgIcon, useMediaQuery, useTheme } from "@mui/material";
import { Icon, OHMButtonProps, PrimaryButton } from "@olympusdao/component-library";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import WalletIcon from "src/assets/icons/wallet.svg?react";
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
  buttonText = "Connect Wallet",
}: {
  fullWidth?: boolean;
  size?: OHMButtonProps["size"];
  buttonText?: string;
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
                    {buttonText}
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
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

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
                return (
                  <>
                    {!mobile ? (
                      <PrimaryButton
                        onClick={() => {
                          fireAnalyticsEvent();
                          openConnectModal();
                        }}
                      >
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
                          background: theme.palette.mode === "dark" ? theme.colors.gray[500] : theme.colors.paper.card,
                          color: theme.colors.gray[10],
                          "&:hover": {
                            background:
                              theme.palette.mode === "dark" ? theme.colors.gray[90] : theme.colors.paper.cardHover,
                            color: theme.colors.gray[10],
                          },
                        }}
                        onClick={() => {
                          fireAnalyticsEvent();
                          openConnectModal();
                        }}
                      >
                        <SvgIcon component={WalletIcon} />
                      </Button>
                    )}
                  </>
                );
              } else {
                return (
                  <Box display="flex" alignItems={"center"}>
                    <Button
                      onClick={chain.unsupported ? openChainModal : openAccountModal}
                      sx={{ paddingLeft: "0px", paddingRight: "0px", minWidth: "initial" }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                          fontSize: "0.875rem",
                          height: "39px",
                          borderRadius: "6px",
                          padding: "9px 18px",
                          cursor: "pointer",
                          fontWeight: 500,
                          background: theme.palette.mode === "light" ? theme.colors.paper.card : theme.colors.gray[600],
                          "&:hover": {
                            background:
                              theme.palette.mode === "light" ? theme.colors.paper.cardHover : theme.colors.gray[500],
                          },
                        }}
                      >
                        <SvgIcon component={WalletIcon} style={{ marginRight: "9px" }} />
                        {chain.unsupported ? "Unsupported Network" : account.displayName}
                      </Box>
                    </Button>
                    <Button
                      onClick={openChainModal}
                      sx={{ paddingLeft: "15px", paddingRight: "0px", minWidth: "initial" }}
                    >
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
                    </Button>
                  </Box>
                );
              }
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

export default ConnectButton;
