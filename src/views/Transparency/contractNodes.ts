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

export const initialNodes = (theme: Theme): Node[] => {
  console.log("theme ", theme);
  const primaryStyle: CSSProperties = {
    backgroundColor: theme.palette.primary.main,
  };

  return getNodes([
    {
      name: "Staking",
      address: STAKING_ADDRESSES[NetworkId.MAINNET],
      x: 50,
      y: 200,
      style: primaryStyle,
    },
    {
      name: "Bond Depository",
      address: BOND_DEPOSITORY_ADDRESSES[NetworkId.MAINNET],
      x: 500,
      y: 100,
    },
    {
      name: "gOHM Token",
      address: GOHM_ADDRESSES[NetworkId.MAINNET],
      x: 250,
      y: 0,
    },
    {
      name: "sOHM Token",
      address: SOHM_ADDRESSES[NetworkId.MAINNET],
      x: 50,
      y: 300,
    },
    {
      name: "OHM Token",
      address: OHM_ADDRESSES[NetworkId.MAINNET],
    },
    {
      name: "DAO Treasury",
      address: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      x: 500,
      y: 0,
      style: primaryStyle,
    },
  ]);
};

export const initialEdges: Edge[] = getEdges([
  { source: STAKING_ADDRESSES[NetworkId.MAINNET], target: SOHM_ADDRESSES[NetworkId.MAINNET], label: "Mints new sOHM" },
  {
    source: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
    target: BOND_DEPOSITORY_ADDRESSES[NetworkId.MAINNET],
    label: "Foo",
  },
]);
