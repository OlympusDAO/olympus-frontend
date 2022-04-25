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
        x: 50,
        y: 200,
        style: goldStyle,
      },
      {
        name: "Bond Depository",
        address: BOND_DEPOSITORY_ADDRESSES[NetworkId.MAINNET],
        x: 400,
        y: 200,
        style: blueStyle,
      },
      {
        name: "gOHM Token",
        address: GOHM_ADDRESSES[NetworkId.MAINNET],
        x: 200,
        y: 0,
        style: darkStyle,
      },
      {
        name: "sOHM Token",
        address: SOHM_ADDRESSES[NetworkId.MAINNET],
        x: 100,
        y: 350,
        style: blueStyle,
      },
      {
        name: "OHM Token",
        address: OHM_ADDRESSES[NetworkId.MAINNET],
        style: blueStyle,
      },
      {
        name: "DAO Treasury",
        address: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
        x: 400,
        y: 0,
        style: blueStyle,
      },
    ],
    230,
    110,
  );
};

export const initialEdges = (theme: Theme): Edge[] => {
  const backgroundColor = theme.colors.gray[40];
  return getEdges([
    {
      source: STAKING_ADDRESSES[NetworkId.MAINNET],
      target: SOHM_ADDRESSES[NetworkId.MAINNET],
      label: "Mints new sOHM",
      animated: true,
      type: "smoothstep",
      labelBackgroundColor: backgroundColor,
    },
    {
      source: DAO_TREASURY_ADDRESSES[NetworkId.MAINNET],
      target: BOND_DEPOSITORY_ADDRESSES[NetworkId.MAINNET],
      label: "Foo",
      animated: true,
      labelBackgroundColor: backgroundColor,
    },
  ]);
};
