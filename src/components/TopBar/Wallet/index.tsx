import { Box, Link as MuiLink, SwipeableDrawer, withStyles } from "@material-ui/core";
import { Icon, TabBar } from "@olympusdao/component-library";
//import { InfoCard } from "@olympusdao/component-library";
import { useState } from "react";
import { Link } from "react-router-dom";

import Calculator from "./Calculator";
import InitialWalletView from "./InitialWalletView";
import { ActiveProposals } from "./queries";

const StyledSwipeableDrawer = withStyles(theme => ({
  root: {
    width: "460px",
    maxWidth: "100%",
  },
  paper: {
    maxWidth: "100%",
    background: theme.colors.paper.background,
  },
}))(SwipeableDrawer);

export function Wallet(props: { open?: boolean; component?: string; currentPath?: any }) {
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

  const RenderComponent = (props: { component?: string }) => {
    switch (props.component) {
      case "calculator":
        return <Calculator />;
      default:
        return <InitialWalletView onClose={closeWallet} />;
    }
  };
  const CloseButton = (props: any) => (
    <MuiLink {...props}>
      <Icon name="x" />
    </MuiLink>
  );
  return (
    <>
      <StyledSwipeableDrawer
        disableBackdropTransition={!isIOS}
        disableDiscovery={isIOS}
        anchor="right"
        open={props.open ? true : false}
        onOpen={openWallet}
        onClose={closeWallet}
      >
        <Box p="30px 15px">
          <Box display="flex" flexDirection="row" justifyContent="flex-end" mb={"18px"} textAlign="right">
            <Link to="/stake" component={CloseButton} />
          </Box>
          <TabBar
            items={[
              { label: "Wallet", to: "/wallet" },
              { label: "Get OHM", to: "/get" },
              { label: "Calculator", to: "/calculator" },
              { label: "Info", to: "info" },
            ]}
            mb={"18px"}
          />
          <RenderComponent component={props.component} />
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
