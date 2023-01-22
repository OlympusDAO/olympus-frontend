import { BigNumber } from "ethers";
import * as helpers from "src/helpers";
import * as Contracts from "src/hooks/useContract";
import * as Prices from "src/hooks/usePrices";
import { render, screen } from "src/testUtils";
import { ExternalStakePools } from "src/views/Liquidity/ExternalStakePools/ExternalStakePools";
import * as STAKE from "src/views/Liquidity/ExternalStakePools/hooks/useStakePoolAPY";
import { beforeEach, describe, it, vi } from "vitest";
vi.mock("src/helpers");

describe("Balancer Based Farm Pool", () => {
  beforeEach(() => {
    vi.spyOn(Prices, "useGohmPrice").mockReturnValue({ data: 3589.300830685976 });
    vi.spyOn(STAKE, "BalancerSwapFees").mockReturnValue({ data: { dailyFees: 123, totalLiquidity: 36548168 } });
    vi.spyOn(Contracts, "useStaticBalancerV2PoolContract").mockReturnValue({
      getPoolId: vi.fn().mockReturnValue("1"),
      balanceOf: vi.fn().mockReturnValue(BigNumber.from("0xed8d6e92f74006ad13")),
      totalSupply: vi.fn().mockReturnValue(BigNumber.from("0xede7f387412bcf2471")),
      getSwapFeePercentage: vi.fn().mockReturnValue(BigNumber.from("1")),
    });
    vi.spyOn(Contracts, "useStaticBalancerVaultContract").mockReturnValue({
      getPoolTokens: vi.fn().mockReturnValue({
        tokens: ["0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83", "0x91fa20244Fb509e8289CA630E5db3E9166233FDc"],
        balances: [BigNumber.from("0x535c4b8b7ddde388e446"), BigNumber.from("0x213ce748c5ea4514ed")],
      }),
    });
    const getTokenPrice = vi.spyOn(helpers, "getTokenPrice");
    getTokenPrice.mockReturnValue(87.39);
    render(<ExternalStakePools />);
  });
  it("should display the correct TVL", async () => {
    expect(await screen.findByText("TVL"));
  });
});
