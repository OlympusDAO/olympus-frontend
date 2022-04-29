import { Theme } from "@material-ui/core";
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

const WIDTH = 230;
const HEIGHT = 110;

export const treasuryNodes = (theme: Theme): Node[] => {
  const baseNodeProps = {
    labelSpacing: 20,
  };

  return getNodes(
    [
      {
        name: "Staking",
        address: STAKING_ADDRESSES[NetworkId.MAINNET],
        className: "contract-node contract-node-gold",
        x: 0,
        y: 300,
        type: "bottomTwo",
        ...baseNodeProps,
      },
      {
        name: "OHM Token",
        address: OHM_ADDRESSES[NetworkId.MAINNET],
        className: "contract-node contract-node-dark",
        x: 400,
        y: 600,
        type: "output",
        ...baseNodeProps,
      },
      {
        name: "sOHM Token",
        address: SOHM_ADDRESSES[NetworkId.MAINNET],
        className: "contract-node contract-node-dark",
        x: 800,
        y: 600,
        type: "output",
        ...baseNodeProps,
      },
      {
        name: "gOHM Token",
        address: GOHM_ADDRESSES[NetworkId.MAINNET],
        className: "contract-node contract-node-dark",
        x: 0,
        y: 600,
        type: "output",
        ...baseNodeProps,
      },
      {
        name: "Staking Distributor",
        address: STAKING_DISTRIBUTOR,
        className: "contract-node contract-node-gold",
        x: 0,
        y: 0,
        type: "bottomTwo",
        ...baseNodeProps,
      },
      {
        name: "Bond Depository",
        address: BOND_DEPOSITORY_ADDRESSES[NetworkId.MAINNET],
        className: "contract-node contract-node-blue",
        x: 400,
        y: 0,
        type: "input",
        ...baseNodeProps,
      },
      {
        name: "Treasury",
        address: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
        className: "contract-node contract-node-blue",
        x: 400,
        y: 300,
        ...baseNodeProps,
      },
      {
        name: "Treasury Extender",
        address: TREASURY_EXTENDER,
        className: "contract-node contract-node-blue",
        x: 800,
        y: 0,
        type: "bottomThree",
        ...baseNodeProps,
      },
      {
        name: "Authority",
        address: AUTHORITY,
        x: 0,
        y: 800,
        className: "contract-node contract-node-blue",
        ...baseNodeProps,
      },
    ],
    WIDTH,
    HEIGHT,
  );
};

export const treasuryEdges = (theme: Theme): Edge[] => {
  const backgroundColor = theme.colors.gray[10];
  const secondaryColor = "#EAD8B8";
  const tertiaryColor = "#94B9A1";

  const baseProps = {
    animated: true,
    type: "smartBezier",
    labelBackgroundColor: backgroundColor,
  };

  return getEdges([
    {
      source: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      target: OHM_ADDRESSES[NetworkId.MAINNET],
      label: "mint: mints new OHM",
      labelOffsetY: "-50px",
      ...baseProps,
    },
    {
      source: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      target: SOHM_ADDRESSES[NetworkId.MAINNET],
      label: "changeDebt: informs about use of incurDebt",
      ...baseProps,
    },
    {
      source: TREASURY_EXTENDER,
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "requestFundsFromTreasury: withdraws tokens to send to allocator",
      sourceHandle: "1",
      labelOffsetY: "-60px",
      ...baseProps,
    },
    {
      source: TREASURY_EXTENDER,
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "returnFundsToTreasury: returns funds from allocator",
      sourceHandle: "2",
      ...baseProps,
      style: {
        stroke: secondaryColor,
      },
      labelBackgroundColor: secondaryColor,
    },
    {
      source: TREASURY_EXTENDER,
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "returnRewardsToTreasury: returns rewards funds from allocator",
      sourceHandle: "3",
      labelOffsetY: "-30px",
      ...baseProps,
      style: {
        stroke: tertiaryColor,
      },
      labelBackgroundColor: tertiaryColor,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: OHM_ADDRESSES[NetworkId.MAINNET],
      label: "stake: exchanges OHM for sOHM",
      sourceHandle: "1",
      labelOffsetY: "-40px",
      ...baseProps,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: OHM_ADDRESSES[NetworkId.MAINNET],
      label: "unstake: transfers OHM to the sender",
      sourceHandle: "2",
      ...baseProps,
      style: {
        stroke: secondaryColor,
      },
      labelBackgroundColor: secondaryColor,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: SOHM_ADDRESSES[NetworkId.MAINNET],
      label: "unstake: exchanges sOHM for OHM",
      ...baseProps,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: GOHM_ADDRESSES[NetworkId.MAINNET],
      label: "wrap: Mints gOHM from sOHM",
      ...baseProps,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: GOHM_ADDRESSES[NetworkId.MAINNET],
      label: "unwrap: burns gOHM for sOHM",
      sourceHandle: "2",
      labelOffsetY: "40px",
      ...baseProps,
      style: {
        stroke: secondaryColor,
      },
      labelBackgroundColor: secondaryColor,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: SOHM_ADDRESSES[NetworkId.MAINNET],
      label: "rebase: Triggers rebase at the end of an epoch",
      labelOffsetX: "20px",
      ...baseProps,
    },
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: STAKING_DISTRIBUTOR,
      label: "rebase: Mint OHM rewards",
      ...baseProps,
    },
    {
      source: STAKING_DISTRIBUTOR,
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "distribute: Distributes OHM rewards to stakers",
      sourceHandle: "1",
      labelOffsetY: "-20px",
      ...baseProps,
    },
    {
      source: STAKING_DISTRIBUTOR,
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "retrieveBounty: Mints OHM rewards",
      sourceHandle: "2",
      ...baseProps,
      style: {
        stroke: secondaryColor,
      },
      labelBackgroundColor: secondaryColor,
    },
    {
      source: BOND_DEPOSITORY_ADDRESSES[NetworkId.MAINNET],
      target: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      label: "deposit: Transfers bond quote token",
      ...baseProps,
    },
  ]);
};
