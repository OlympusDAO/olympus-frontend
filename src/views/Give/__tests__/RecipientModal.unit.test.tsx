import { BigNumber } from "ethers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as useBalance from "src/hooks/useBalance";
import * as useContractAllowance from "src/hooks/useContractAllowance";
import { NetworkId } from "src/networkDetails";
import { ChangeAssetType } from "src/slices/interfaces";
import { mockContractAllowance, mockGohmBalance, mockSohmBalance } from "src/testHelpers";
import { fireEvent, render, screen } from "src/testUtils";
import { CancelCallback, SubmitCallback } from "src/views/Give/Interfaces";
import { RecipientModal } from "src/views/Give/RecipientModal";
import { expect } from "vitest";

describe("RecipientModal", () => {
  let callbackFunc: SubmitCallback;
  let cancelFunc: CancelCallback;
  let changeAssetType: ChangeAssetType;

  beforeEach(() => {
    // Has a contract allowance
    vi.spyOn(useContractAllowance, "useContractAllowance").mockReturnValue(
      mockContractAllowance(BigNumber.from(1000000)),
    );

    vi.spyOn(useBalance, "useSohmBalance").mockReturnValue(
      mockSohmBalance({
        [NetworkId.MAINNET]: new DecimalBigNumber("10"),
        [NetworkId.TESTNET_GOERLI]: new DecimalBigNumber("0"),
      }),
    );

    vi.spyOn(useBalance, "useGohmBalance").mockReturnValue(
      mockGohmBalance({
        [NetworkId.MAINNET]: new DecimalBigNumber("10"),
        [NetworkId.TESTNET_GOERLI]: new DecimalBigNumber("0"),
        [NetworkId.ARBITRUM]: new DecimalBigNumber("0"),
        [NetworkId.ARBITRUM_TESTNET]: new DecimalBigNumber("0"),
        [NetworkId.AVALANCHE]: new DecimalBigNumber("0"),
        [NetworkId.AVALANCHE_TESTNET]: new DecimalBigNumber("0"),
        [NetworkId.POLYGON]: new DecimalBigNumber("0"),
        [NetworkId.FANTOM]: new DecimalBigNumber("0"),
        [NetworkId.OPTIMISM]: new DecimalBigNumber("0"),
      }),
    );

    callbackFunc = async () => {
      return;
    };
    cancelFunc = async () => {
      return;
    };
    changeAssetType = (checked: boolean) => {
      return;
    };
  });

  it("input should accept integer amount", async () => {
    render(
      <RecipientModal
        isModalOpen={true}
        isMutationLoading={false}
        eventSource="View Details Button"
        callbackFunc={callbackFunc}
        cancelFunc={cancelFunc}
        giveAssetType="sOHM"
        changeAssetType={changeAssetType}
      />,
    );

    fireEvent.input(screen.getByTestId("amount-input"), { target: { value: "2" } });
    expect(screen.getByTestId("amount-input"));
  });

  it("input should accept integer amount with zero padding", async () => {
    render(
      <RecipientModal
        isModalOpen={true}
        isMutationLoading={false}
        eventSource="View Details Button"
        callbackFunc={callbackFunc}
        cancelFunc={cancelFunc}
        giveAssetType="sOHM"
        changeAssetType={changeAssetType}
      />,
    );

    fireEvent.input(screen.getByTestId("amount-input"), { target: { value: "2.0" } });
    expect(screen.getByTestId("amount-input"));
  });

  it("input should accept decimal amount", async () => {
    render(
      <RecipientModal
        isModalOpen={true}
        isMutationLoading={false}
        eventSource="View Details Button"
        callbackFunc={callbackFunc}
        cancelFunc={cancelFunc}
        giveAssetType="sOHM"
        changeAssetType={changeAssetType}
      />,
    );

    fireEvent.input(screen.getByTestId("amount-input"), { target: { value: "2.1" } });
    expect(screen.getByTestId("amount-input"));
  });

  it("input should truncate to 9 decimals", async () => {
    render(
      <RecipientModal
        isModalOpen={true}
        isMutationLoading={false}
        eventSource="View Details Button"
        callbackFunc={callbackFunc}
        cancelFunc={cancelFunc}
        giveAssetType="sOHM"
        changeAssetType={changeAssetType}
      />,
    );

    fireEvent.input(screen.getByTestId("amount-input"), { target: { value: "2.1234567891" } });
    expect(screen.getByTestId("amount-input"));
  });
});
