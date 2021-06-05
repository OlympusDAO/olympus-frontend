import React from 'react';
import { ReactComponent as ForumIcon } from "../../assets/icons/forum-icon.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/governance-icon.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs-icon.svg";

const externalUrls = [
    {
      title: "Forum", 
      url: "https://forum.olympusdao.finance/",
      icon: <ForumIcon />
    },
    {
      title: "Governance", 
      url: "https://vote.olympusdao.finance/",
      icon: <GovIcon />
    },
    {
      title: "Docs", 
      url: "https://docs.olympusdao.finance/",
      icon: <DocsIcon />
    }
]

export default externalUrls;