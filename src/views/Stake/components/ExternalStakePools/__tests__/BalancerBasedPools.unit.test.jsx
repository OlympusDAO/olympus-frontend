import { BigNumber } from "ethers";
import * as helpers from "src/helpers";
import { useStaticBalancerV2PoolContract, useStaticBalancerVaultContract } from "src/hooks/useContract";
import { useGohmPrice } from "src/hooks/usePrices";
import { render, screen } from "src/testUtils";
import { ExternalStakePools } from "src/views/Stake/components/ExternalStakePools/ExternalStakePools";
import { beforeEach, describe, it, vi } from "vitest";
vi.mock("src/hooks/usePrices");
vi.mock("src/hooks/useContract");
vi.mock("src/helpers");

describe("Balancer Based Farm Pool", () => {
  beforeEach(() => {
    useGohmPrice.mockReturnValue({ data: 3589.300830685976 });
    useStaticBalancerV2PoolContract.mockReturnValue({
      getPoolId: vi.fn().mockReturnValue("1"),
      balanceOf: vi.fn().mockReturnValue(BigNumber.from("0xed8d6e92f74006ad13")),
      totalSupply: vi.fn().mockReturnValue(BigNumber.from("0xede7f387412bcf2471")),
    });
    useStaticBalancerVaultContract.mockReturnValue({
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
    //This covers hook interactions and proper rounding on the presentation layer.
    const waitforText = await screen.findAllByText("$36,548,168");
    expect(waitforText[0]);
  });
});
