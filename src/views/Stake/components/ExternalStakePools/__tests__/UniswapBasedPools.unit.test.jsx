import { BigNumber } from "ethers";
import * as helpers from "src/helpers";
import { useStaticPairContract } from "src/hooks/useContract";
import { useGohmPrice } from "src/hooks/usePrices";
import { render, screen } from "src/testUtils";
import Stake from "src/views/Stake/Stake";
import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("src/hooks/usePrices");
vi.mock("src/hooks/useContract");

describe("Uniswap Based Farm Pool", () => {
  beforeEach(() => {
    useGohmPrice.mockReturnValue({ data: 3589.300830685976 });
    useStaticPairContract.mockReturnValue({
      getReserves: vi
        .fn()
        .mockReturnValue([
          BigNumber.from("0x418a6fc5f3aa03a075a4"),
          BigNumber.from("0x06a1eddb3676dcfe94"),
          1649248663,
        ]),
      token0: vi.fn().mockReturnValue("0x321E7092a180BB43555132ec53AaA65a5bF84251"),
      totalSupply: vi.fn().mockReturnValue(BigNumber.from("0xc01546fee31784e03e")),
      balanceOf: vi.fn().mockReturnValue(BigNumber.from("0xb76e0e83cbaa98e9ed")),
    });
    const getTokenPrice = vi.spyOn(helpers, "getTokenPrice");
    getTokenPrice.mockReturnValue(87.39);
  });
  it("should display the correct TVL", async () => {
    render(<Stake />);
    expect(await screen.findByText("$26,248,739"));
  });
});
