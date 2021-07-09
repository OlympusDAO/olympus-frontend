<<<<<<< HEAD
import { ReactComponent as ForumIcon } from "../../assets/icons/v1.2/forum.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/v1.2/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/v1.2/docs.svg";
import { SvgIcon } from "@material-ui/core";
=======
import React from "react";
import { ReactComponent as ForumIcon } from "../../assets/icons/forum-icon.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/governance-icon.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs-icon.svg";
>>>>>>> Linting fixes

const externalUrls = [
  {
    title: "Forum",
    url: "https://forum.olympusdao.finance/",
<<<<<<< HEAD
    icon: <SvgIcon color="primary" component={ForumIcon} />,
=======
    icon: <ForumIcon />,
>>>>>>> Linting fixes
  },
  {
    title: "Governance",
    url: "https://vote.olympusdao.finance/",
<<<<<<< HEAD
    icon: <SvgIcon color="primary" component={GovIcon} />,
=======
    icon: <GovIcon />,
>>>>>>> Linting fixes
  },
  {
    title: "Docs",
    url: "https://docs.olympusdao.finance/",
<<<<<<< HEAD
    icon: <SvgIcon color="primary" component={DocsIcon} />,
=======
    icon: <DocsIcon />,
>>>>>>> Linting fixes
  },
];

export default externalUrls;
