import { t } from "@lingui/macro";
import { Box, Button, SvgIcon, SwipeableDrawer, Typography, useTheme, withStyles } from "@material-ui/core";
//import { InfoCard } from "@olympusdao/component-library";
import { useState } from "react";
import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { useWeb3Context } from "src/hooks/web3Context";

import Calculator from "./Calculator";
import { ActiveProposals } from "./queries";

//mport InitialWalletView from "./InitialWalletView";

const WalletButton = ({ openWallet }: { openWallet: () => void }) => {
  const { connect, connected } = useWeb3Context();
  const onClick = connected ? openWallet : connect;
  const label = connected ? t`Wallet` : t`Connect Wallet`;
  const theme = useTheme();
  return (
    <Button id="ohm-menu-button" variant="contained" color="secondary" onClick={onClick}>
      <SvgIcon component={WalletIcon} style={{ marginRight: theme.spacing(1) }} />
      <Typography>{label}</Typography>
    </Button>
  );
};

const StyledSwipeableDrawer = withStyles(theme => ({
  root: {
    width: "460px",
    maxWidth: "100%",
  },
  paper: {
    maxWidth: "100%",
    background: theme.colors.paper,
  },
}))(SwipeableDrawer);

export function Wallet() {
  const { data, isLoading, isFetched } = ActiveProposals();
  //const { data: mediumArticles, isFetched: mediumIsFetched } = MediumArticles();
  const [isWalletOpen, setWalletOpen] = useState(false);
  const closeWallet = () => setWalletOpen(false);
  const openWallet = () => setWalletOpen(true);

  // only enable backdrop transition on ios devices,
  // because we can assume IOS is hosted on hight-end devices and will not drop frames
  // also disable discovery on IOS, because of it's 'swipe to go back' feat
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const truncate = (str: string) => {
    return str.length > 200 ? str.substring(0, 197) + "..." : str;
  };
  return (
    <>
      <WalletButton openWallet={openWallet} />
      <StyledSwipeableDrawer
        disableBackdropTransition={!isIOS}
        disableDiscovery={isIOS}
        anchor="right"
        open={isWalletOpen}
        onOpen={openWallet}
        onClose={closeWallet}
      >
        {/* <InitialWalletView onClose={closeWallet} /> */}
        <Box p="30px 15px">
          <Calculator />
          {/* {isFetched &&
            data.proposals.map((proposal: any) => {
              const max = Math.max(...proposal.scores);
              const indexOf = proposal.scores.indexOf(max);
              return (
                <InfoCard
                  title={proposal.title}
                  content={truncate(proposal.body)}
                  status={proposal.state === "active" ? "active" : "passed"}
                  href={proposal.link}
                  statusLabel={proposal.state === "active" ? t`Active` : t`Closed`}
                  timeRemaining={
                    proposal.state === "active" ? new Date(proposal.end * 1000).toString() : proposal.choices[indexOf]
                  }
                />
              );
            })} */}
          {/* {mediumIsFetched &&
            mediumArticles.items.map((article: any) => {
              return (
                <ArticleCard
                  title={article.title}
                  imageSrc={article.thumbnail}
                  content={<div dangerouslySetInnerHTML={{ __html: article.content }} />}
                />
              );
            })} */}
        </Box>
      </StyledSwipeableDrawer>
    </>
  );
}

export default Wallet;
