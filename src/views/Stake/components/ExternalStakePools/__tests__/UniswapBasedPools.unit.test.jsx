import { BigNumber } from "ethers";
import * as helpers from "src/helpers";
import { useStaticPairContract } from "src/hooks/useContract";
import { useGohmPrice } from "src/hooks/usePrices";
import { render, screen } from "src/testUtils";

import Stake from "../../../Stake";
jest.mock("src/hooks/usePrices");
jest.mock("src/hooks/useContract");

describe("Uniswap Based Farm Pool", () => {
  beforeEach(() => {
    useGohmPrice.mockReturnValue({ data: 3589.300830685976 });
    useStaticPairContract.mockReturnValue({
      getReserves: jest
        .fn()
        .mockReturnValue([
          BigNumber.from("0x418a6fc5f3aa03a075a4"),
          BigNumber.from("0x06a1eddb3676dcfe94"),
          1649248663,
        ]),
      token0: jest.fn().mockReturnValue("0x321E7092a180BB43555132ec53AaA65a5bF84251"),
      totalSupply: jest.fn().mockReturnValue(BigNumber.from("0xc01546fee31784e03e")),
      balanceOf: jest.fn().mockReturnValue(BigNumber.from("0xb76e0e83cbaa98e9ed")),
    });
    helpers.getTokenPrice = jest.fn().mockReturnValue(87.39);
    render(<Stake />);
  });
  it("should display the correct TVL", () => {
    expect(screen.getAllByText("$26,248,739")[0]).toBeInTheDocument();
  });
});
