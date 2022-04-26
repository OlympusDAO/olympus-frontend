import { Theme } from "@material-ui/core";
import { CSSProperties } from "react";
import { Edge, Node } from "react-flow-renderer";
import { getEdges } from "src/components/Transparency/ContractEdge";
import { getNodes } from "src/components/Transparency/ContractNode";
import { NetworkId } from "src/constants";
import {
  BOND_DEPOSITORY_ADDRESSES,
  DAO_TREASURY_ADDRESSES,
  GOHM_ADDRESSES,
  OHM_ADDRESSES,
  SOHM_ADDRESSES,
  STAKING_ADDRESSES,
} from "src/constants/addresses";

const STAKING_DISTRIBUTOR = "0xeeeb97A127a342656191E0313DF33D58D06B2E05";
const AUTHORITY = "0x1c21F8EA7e39E2BA00BC12d2968D63F4acb38b7A";
const TREASURY_EXTENDER = "0xb32Ad041f23eAfd682F57fCe31d3eA4fd92D17af";

export const initialNodes = (theme: Theme): Node[] => {
  const baseStyle: CSSProperties = {
    borderRadius: "39px",
    lineHeight: "23px",
    paddingTop: "20px",
    paddingBottom: "20px",
    paddingLeft: "30px",
    paddingRight: "30px",
  };
  const blueStyle: CSSProperties = {
    backgroundColor: "#798399",
    borderColor: "#798399",
    color: "#FAFAFB",
    ...baseStyle,
  };
  const darkStyle: CSSProperties = {
    backgroundColor: "#1B232F",
    borderColor: "#1B232F",
    color: "#FAFAFB",
    ...baseStyle,
  };
  // TODO fix styling of links
  const goldStyle: CSSProperties = {
    backgroundColor: theme.colors.primary[300],
    borderColor: theme.colors.primary[300],
    color: theme.colors.gray[700],
    ...baseStyle,
  };

  return getNodes(
    [
      {
        name: "Staking",
        address: STAKING_ADDRESSES[NetworkId.MAINNET],
        style: goldStyle,
        x: 100,
        y: -200,
        type: "input",
      },
      {
        name: "OHM Token",
        address: OHM_ADDRESSES[NetworkId.MAINNET],
        style: darkStyle,
        x: 0,
        y: 500,
        type: "output",
      },
      {
        name: "sOHM Token",
        address: SOHM_ADDRESSES[NetworkId.MAINNET],
        style: darkStyle,
        x: 300,
        y: 600,
        type: "output",
      },
      {
        name: "gOHM Token",
        address: GOHM_ADDRESSES[NetworkId.MAINNET],
        style: darkStyle,
        x: 500,
        y: 700,
        type: "output",
      },
      {
        name: "Staking Distributor",
        address: STAKING_DISTRIBUTOR,
        style: blueStyle,
        x: 700,
        y: 0,
      },
      {
        name: "Bond Depository",
        address: BOND_DEPOSITORY_ADDRESSES[NetworkId.MAINNET],
        style: blueStyle,
        x: 400,
        y: 75,
        type: "input",
      },
      {
        name: "Treasury",
        address: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
        style: blueStyle,
        x: 1000,
        y: 200,
      },
      {
        name: "Treasury Extender",
        address: TREASURY_EXTENDER,
        style: blueStyle,
        x: 1000,
        y: -200,
        type: "input",
      },
      {
        name: "Authority",
        address: AUTHORITY,
        x: 0,
        y: 800,
        style: blueStyle,
      },
    ],
    230,
    110,
  );
};

export const initialEdges = (theme: Theme): Edge[] => {
  const backgroundColor = theme.colors.gray[10];
  return getEdges([
    {
      source: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      target: OHM_ADDRESSES[NetworkId.MAINNET],
      label: "mint: mints new OHM",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      target: SOHM_ADDRESSES[NetworkId.MAINNET],
      label: "changeDebt: informs about use of incurDebt",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: TREASURY_EXTENDER,
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "requestFundsFromTreasury: withdraws tokens to send to allocator",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: TREASURY_EXTENDER,
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "returnFundsToTreasury: returns funds from allocator",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: TREASURY_EXTENDER,
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "returnRewardsToTreasury: returns rewards funds from allocator",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: OHM_ADDRESSES[NetworkId.MAINNET],
      label: "stake: exchanges OHM for sOHM",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: SOHM_ADDRESSES[NetworkId.MAINNET],
      label: "unstake: exchanges sOHM for OHM",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: OHM_ADDRESSES[NetworkId.MAINNET],
      label: "unstake: transfers OHM to the sender",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: GOHM_ADDRESSES[NetworkId.MAINNET],
      label: "wrap: Mints gOHM from sOHM",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: GOHM_ADDRESSES[NetworkId.MAINNET],
      label: "unwrap: burns gOHM for sOHM",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: SOHM_ADDRESSES[NetworkId.MAINNET],
      label: "rebase: Triggers rebase at the end of an epoch",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: STAKING_DISTRIBUTOR,
      label: "rebase: Mint OHM rewards",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: STAKING_DISTRIBUTOR,
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "distribute: Distributes OHM rewards to stakers",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: STAKING_DISTRIBUTOR,
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "retrieveBounty: Mints OHM rewards",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: BOND_DEPOSITORY_ADDRESSES[NetworkId.MAINNET],
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "deposit: Transfers bond quote token",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
  ]);
};
