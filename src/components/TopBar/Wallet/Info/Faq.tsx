import { Box, Fade } from "@mui/material";
import { InfoCard } from "@olympusdao/component-library";

/**
 * Component for Displaying Faq
 */
const Faq = () => {
  const faqContent = [
    {
      title: "Why do we need OlympusDAO in the first place?",
      content:
        "Dollar-pegged stablecoins have become an essential part of crypto due to their lack of volatility as compared to tokens such as Bitcoin and Ether.",
    },
    {
      title: "Is OHM a stable coin?",
      content:
        "No, OHM is not a stable coin. Rather, OHM aspires to become an algorithmic reserve currency backed by other decentralized assets. ",
    },
    {
      title: "How does it work?",
      content:
        "At a high level, OlympusDAO consists of its protocol managed treasury, protocol owned liquidity (POL), bond mechanism, and staking rewards that are designed to control supply expansion.",
    },
    {
      title: "What is bonding?",
      content:
        "Bonding is the secondary value accrual strategy of Olympus. It allows Olympus to acquire its own liquidity and other reserve assets such as LUSD by selling OHM at a discount in exchange for these assets. ",
    },
    {
      title: "What is Staking?",
      content:
        "Staking is the primary value accrual strategy of Olympus. Stakers stake their OHM on the Olympus website to earn rebase rewards. The rebase rewards come from the proceed from bond sales, and can vary based on the number of OHM staked in the protocol and the reward rate set by monetary policy.",
    },
  ];

  return (
    <Fade in={true}>
      <Box data-testid="faq">
        {faqContent.map((faq: { title: string | undefined; content: string | undefined }, index) => (
          <InfoCard key={index} title={faq.title} content={faq.content} />
        ))}
      </Box>
    </Fade>
  );
};

export default Faq;
