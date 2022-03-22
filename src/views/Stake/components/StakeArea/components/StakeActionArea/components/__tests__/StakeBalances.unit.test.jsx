import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import {
  useFuseBalance,
  useGohmBalance,
  useGohmTokemakBalance,
  useOhmBalance,
  useSohmBalance,
  useV1SohmBalance,
  useWsohmBalance,
} from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { NetworkId } from "src/networkDetails";
import { act, render, screen } from "src/testUtils";

import { StakeBalances } from "../StakeBalances";

jest.mock("src/hooks/useBalance");
jest.mock("src/hooks/useCurrentIndex");

describe("<StakeBalances/>", () => {
  it("should render balances and rebase info", async () => {
    useCurrentIndex.mockReturnValue({ data: new DecimalBigNumber("100", 9) });
    // preload user account with staking tokens across networks
    useFuseBalance.mockImplementation(function () {
      const bals = {};
      bals[NetworkId.MAINNET] = { data: new DecimalBigNumber("11", 18) };
      return bals;
    });
    useSohmBalance.mockImplementation(function () {
      const bals = {};
      bals[NetworkId.MAINNET] = { data: new DecimalBigNumber("12", 18) };
      return bals;
    });
    useGohmBalance.mockImplementation(function () {
      const bals = {};
      bals[NetworkId.MAINNET] = { data: new DecimalBigNumber("131", 18) };
      bals[NetworkId.ARBITRUM] = { data: new DecimalBigNumber("132", 18) };
      bals[NetworkId.AVALANCHE] = { data: new DecimalBigNumber("133", 18) };
      bals[NetworkId.POLYGON] = { data: new DecimalBigNumber("134", 18) };
      bals[NetworkId.FANTOM] = { data: new DecimalBigNumber("135", 18) };
      bals[NetworkId.OPTIMISM] = { data: new DecimalBigNumber("136", 18) };
      return bals;
    });
    useGohmTokemakBalance.mockImplementation(function () {
      const bals = {};
      bals[NetworkId.MAINNET] = { data: new DecimalBigNumber("14", 18) };
      return bals;
    });
    useOhmBalance.mockImplementation(function () {
      const bals = {};
      bals[NetworkId.MAINNET] = { data: new DecimalBigNumber("15", 18) };
      return bals;
    });
    useV1SohmBalance.mockImplementation(function () {
      const bals = {};
      bals[NetworkId.MAINNET] = { data: new DecimalBigNumber("16", 18) };
      return bals;
    });
    useWsohmBalance.mockImplementation(function () {
      const bals = {};
      bals[NetworkId.MAINNET] = { data: new DecimalBigNumber("171", 18) };
      bals[NetworkId.ARBITRUM] = { data: new DecimalBigNumber("172", 18) };
      bals[NetworkId.AVALANCHE] = { data: new DecimalBigNumber("173", 18) };
      return bals;
    });

    const stakeBalances = <StakeBalances />;
    var container;
    await act(async () => {
      ({ container } = render(stakeBalances));
    });
    expect(container).toMatchSnapshot();
    expect(await screen.getByText("Unstaked Balance")).toBeInTheDocument();
    expect(await screen.getByText("Total Staked Balance")).toBeInTheDocument();
    // expect to find the correct token balances on the staking screen
    var bals = {
      "Unstaked Balance": "15.0000 OHM",
      "Total Staked Balance": "134,228.0000 sOHM",
      sOHM: "12.0000 sOHM",
      gOHM: "131.0000 gOHM",
      "gOHM (Arbitrum)": "132.0000 gOHM",
      "gOHM (Avalanche)": "133.0000 gOHM",
      "gOHM (Polygon)": "134.0000 gOHM",
      "gOHM (Fantom)": "135.0000 gOHM",
      "gOHM (Optimism)": "136.0000 gOHM",
      "gOHM (Tokemak)": "14.0000 gOHM",
      "gOHM (Fuse)": "11.0000 gOHM",
      "sOHM (v1)": "16.0000 sOHM",
      wsOHM: "171.0000 wsOHM",
      "wsOHM (Arbitrum)": "172.0000 wsOHM",
      "wsOHM (Avalanche)": "173.0000 wsOHM",
    };
    // screen.debug(undefined, 100000);
    for (const [key, value] of Object.entries(bals)) {
      const section = await screen.getByText(key);
      expect(section).toBeInTheDocument();
      const bal = await screen.getByText(value);
      expect(bal).toBeInTheDocument();
    }
  });
});
