import { t } from "@lingui/macro";
import { Box, Fade } from "@mui/material";
import { InfoCard } from "@olympusdao/component-library";
import { FC, Key } from "react";

import { ActiveProposals } from "../queries";

/**
 * Component for displaying proposals
 */
export const Proposals: FC = () => {
  const { data, isFetched } = ActiveProposals();

  const truncate = (str: string) => {
    return str.length > 200 ? str.substring(0, 197) + "..." : str;
  };
  return (
    <Fade in={true}>
      <Box data-testid="proposals">
        {isFetched &&
          data.proposals.map(
            (
              proposal: {
                title: string | undefined;
                body: string;
                state: string;
                scores: number[];
                link: string | undefined;
                end: number;
                choices: { [x: string]: string | undefined };
              },
              index: Key | null | undefined,
            ) => {
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
                  key={index}
                />
              );
            },
          )}
      </Box>
    </Fade>
  );
};
