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

export const initialNodes: Node[] = getNodes([
  {
    name: "Staking",
    address: STAKING_ADDRESSES[NetworkId.MAINNET],
  },
  {
    name: "Bond Depository",
    address: BOND_DEPOSITORY_ADDRESSES[NetworkId.MAINNET],
  },
  {
    name: "gOHM Token",
    address: GOHM_ADDRESSES[NetworkId.MAINNET],
  },
  {
    name: "sOHM Token",
    address: SOHM_ADDRESSES[NetworkId.MAINNET],
  },
  {
    name: "OHM Token",
    address: OHM_ADDRESSES[NetworkId.MAINNET],
  },
  {
    name: "DAO Treasury",
    address: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
  },
]);

export const initialEdges: Edge[] = getEdges([
  { source: STAKING_ADDRESSES[NetworkId.MAINNET], target: SOHM_ADDRESSES[NetworkId.MAINNET], label: "Mints new sOHM" },
  {
    source: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
    target: BOND_DEPOSITORY_ADDRESSES[NetworkId.MAINNET],
    label: "Foo",
  },
]);
