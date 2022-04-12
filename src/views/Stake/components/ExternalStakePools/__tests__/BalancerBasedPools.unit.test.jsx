import { BigNumber } from "ethers";
import * as helpers from "src/helpers";
import { useStaticBalancerV2PoolContract, useStaticBalancerVaultContract } from "src/hooks/useContract";
import { useGohmPrice } from "src/hooks/usePrices";
import { render, screen } from "src/testUtils";

import Stake from "../../../Stake";
jest.mock("src/hooks/usePrices");
jest.mock("src/hooks/useContract");

describe("Balancer Based Farm Pool", () => {
  beforeEach(() => {
    useGohmPrice.mockReturnValue({ data: 3589.300830685976 });
    helpers.getTokenPrice = jest.fn().mockReturnValue(87.39);
    useStaticBalancerV2PoolContract.mockReturnValue({
      getPoolId: jest.fn().mockReturnValue("1"),
      balanceOf: jest.fn().mockReturnValue(BigNumber.from("0xed8d6e92f74006ad13")),
      totalSupply: jest.fn().mockReturnValue(BigNumber.from("0xede7f387412bcf2471")),
    });
    useStaticBalancerVaultContract.mockReturnValue({
      getPoolTokens: jest.fn().mockReturnValue({
        tokens: ["0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83", "0x91fa20244Fb509e8289CA630E5db3E9166233FDc"],
        balances: [BigNumber.from("0x535c4b8b7ddde388e446"), BigNumber.from("0x213ce748c5ea4514ed")],
      }),
    });
    render(<Stake />);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should display the correct TVL", () => {
    //This covers hook interactions and proper rounding on the presentation layer.
    expect(screen.getAllByText("$36,548,168")[0]).toBeInTheDocument();
  });
});
