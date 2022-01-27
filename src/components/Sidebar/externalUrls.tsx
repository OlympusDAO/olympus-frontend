import { Trans } from "@lingui/macro";
import { ReactElement } from "react";

export interface ExternalUrl {
  title: ReactElement;
  url: string;
  icon: string;
}

const externalUrls: ExternalUrl[] = [
  {
    title: <Trans>Forum</Trans>,
    url: "https://forum.olympusdao.finance/",
    icon: "forum",
  },
  {
    title: <Trans>Governance</Trans>,
    url: "https://vote.olympusdao.finance/",
    icon: "governance",
  },
  {
    title: <Trans>Docs</Trans>,
    url: "https://docs.olympusdao.finance/",
    icon: "docs",
  },
  {
    title: <Trans>Bug Bounty</Trans>,
    url: "https://immunefi.com/bounty/olympus/",
    icon: "bug-report",
  },
];

export default externalUrls;
