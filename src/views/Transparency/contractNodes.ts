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

export const initialNodes = (backgroundColor: string): Node[] => {
  const primaryStyle: CSSProperties = {
    backgroundColor: backgroundColor,
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
      y: 350,
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
  {
    source: STAKING_ADDRESSES[NetworkId.MAINNET],
    target: SOHM_ADDRESSES[NetworkId.MAINNET],
    label: "Mints new sOHM",
    animated: true,
  },
  {
    source: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
    target: BOND_DEPOSITORY_ADDRESSES[NetworkId.MAINNET],
    label: "Foo",
    animated: true,
  },
]);
