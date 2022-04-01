import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import Web3Modal from "web3modal";

import { render, screen } from "../../../testUtils";
import Stake from "../Stake";

jest.mock("web3modal");
jest.mock("@ethersproject/contracts");

describe("<Stake/>", () => {
  it("should render component", async () => {
    const { container } = render(<Stake />);
    expect(container).toMatchSnapshot();
  });

  it("should render correct staking headers", () => {
    const { container } = render(<Stake />);
    // there should be a header inviting user to Stake
    expect(screen.getByText("Single Stake (3, 3)")).toBeInTheDocument();
    //  there should be a Farm Pool table
    expect(screen.getByText("Farm Pool")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("should render all supported multi chain staking contracts", async () => {
    render(<Stake />);
    expect(await screen.getByText("gOHM-AVAX")).toBeInTheDocument();
    expect(await screen.getByText("Stake on Trader Joe").closest("a")).toHaveAttribute(
      "href",
      "https://traderjoexyz.com/farm/0xB674f93952F02F2538214D4572Aa47F262e990Ff-0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
    );
    // there should be two sushi contracts, one on Arbitrum and the other on Polygon
    const sushiContracts = await screen.findAllByText("gOHM-wETH");
    expect(sushiContracts).toHaveLength(3);
    expect(await screen.getByText("gOHM-FTM")).toBeInTheDocument();
    expect(await screen.getByText("Stake on Spirit").closest("a")).toHaveAttribute(
      "href",
      "https://app.spiritswap.finance/#/farms/allfarms",
    );
  });

  it("approve button should change to stake once contract is approved", async () => {
    Web3Modal.prototype.connect = async () => {
      return (method: string) => {
        return new Promise(resolve => {
          if (method === "eth_accounts") {
            resolve(["0x0000000000000000000000000000000000000000"]);
          } else if (method === "eth_chainId") {
            resolve(1);
          }
        });
      };
    };

    let allowance = BigNumber.from(0);

    // Force cast to "any" because contract functions derived from ABI are read only
    (Contract.prototype as any).approve = () =>
      new Promise(resolve =>
        resolve({
          wait: () => {
            allowance = BigNumber.from(1);
            return new Promise(resolve => resolve(""));
          },
        }),
      );
    (Contract.prototype as any).allowance = () => new Promise(resolve => resolve(allowance));

    render(<Stake />);

    const connectWalletButton = screen.getByText("Connect Wallet");
    connectWalletButton.click();

    const approveButton = await screen.findByText("Approve");
    approveButton.click();

    const stakeButton = await screen.findByText("Stake to sOHM");
    expect(stakeButton).toBeInTheDocument();
  });
});
