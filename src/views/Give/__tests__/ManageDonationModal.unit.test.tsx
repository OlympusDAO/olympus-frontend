import { BigNumber } from "ethers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as useBalance from "src/hooks/useBalance";
import * as useContractAllowance from "src/hooks/useContractAllowance";
import * as useWeb3Context from "src/hooks/web3Context";
import { NetworkId } from "src/networkDetails";
import { ChangeAssetType } from "src/slices/interfaces";
import { mockContractAllowance, mockGohmBalance, mockSohmBalance, mockWeb3Context } from "src/testHelpers";
import { fireEvent, render, screen } from "src/testUtils";

import { CancelCallback, SubmitEditCallback, WithdrawSubmitCallback } from "../Interfaces";
import { ManageDonationModal } from "../ManageDonationModal";

beforeEach(() => {
  jest.spyOn(useWeb3Context, "useWeb3Context").mockReturnValue(mockWeb3Context);
});

describe("ManageDonationModal", () => {
  let submitFunc: SubmitEditCallback;
  let cancelFunc: CancelCallback;
  let withdrawFunc: WithdrawSubmitCallback;
  let changeAssetType: ChangeAssetType;

  beforeEach(() => {
    // Has a contract allowance
    jest
      .spyOn(useContractAllowance, "useContractAllowance")
      .mockReturnValue(mockContractAllowance(BigNumber.from(1000000)));

    jest.spyOn(useBalance, "useSohmBalance").mockReturnValue(
      mockSohmBalance({
        [NetworkId.MAINNET]: new DecimalBigNumber("10"),
        [NetworkId.TESTNET_RINKEBY]: new DecimalBigNumber("0"),
      }),
    );

    jest.spyOn(useBalance, "useGohmBalance").mockReturnValue(
      mockGohmBalance({
        [NetworkId.MAINNET]: new DecimalBigNumber("10"),
        [NetworkId.TESTNET_RINKEBY]: new DecimalBigNumber("0"),
        [NetworkId.ARBITRUM]: new DecimalBigNumber("0"),
        [NetworkId.ARBITRUM_TESTNET]: new DecimalBigNumber("0"),
        [NetworkId.AVALANCHE]: new DecimalBigNumber("0"),
        [NetworkId.AVALANCHE_TESTNET]: new DecimalBigNumber("0"),
        [NetworkId.POLYGON]: new DecimalBigNumber("0"),
        [NetworkId.FANTOM]: new DecimalBigNumber("0"),
        [NetworkId.OPTIMISM]: new DecimalBigNumber("0"),
      }),
    );

    submitFunc = async () => {
      return;
    };
    cancelFunc = async () => {
      return;
    };
    withdrawFunc = async () => {
      return;
    };
    changeAssetType = (checked: boolean) => {
      return;
    };
  });

  it("Should accept integer amount", async () => {
    render(
      <ManageDonationModal
        isModalOpen={true}
        isMutationLoading={false}
        eventSource="View Details Button"
        submitEdit={submitFunc}
        submitWithdraw={withdrawFunc}
        cancelFunc={cancelFunc}
        currentWalletAddress={""}
        currentDepositId={"0"}
        currentDepositAmount={"1.0"}
        depositDate={""}
        giveAssetType="sOHM"
        yieldSent={"0"}
        changeAssetType={changeAssetType}
      />,
    );

    fireEvent.click(screen.getByTestId("edit-donation"));
    fireEvent.input(screen.getByTestId("amount-input"), { target: { value: "2" } });
    expect(screen.getByTestId("amount-input")).toHaveDisplayValue("2");
  });

  it("Should accept integer amount with zero padding", async () => {
    render(
      <ManageDonationModal
        isModalOpen={true}
        isMutationLoading={false}
        eventSource="View Details Button"
        submitEdit={submitFunc}
        submitWithdraw={withdrawFunc}
        cancelFunc={cancelFunc}
        currentWalletAddress={""}
        currentDepositId={"0"}
        currentDepositAmount={"1.0"}
        depositDate={""}
        giveAssetType="sOHM"
        yieldSent={"0"}
        changeAssetType={changeAssetType}
      />,
    );

    fireEvent.click(screen.getByTestId("edit-donation"));

    fireEvent.input(screen.getByTestId("amount-input"), { target: { value: "2.0" } });
    expect(screen.getByTestId("amount-input")).toHaveDisplayValue("2.0");
  });

  it("Should accept decimal amount", async () => {
    render(
      <ManageDonationModal
        isModalOpen={true}
        isMutationLoading={false}
        eventSource="View Details Button"
        submitEdit={submitFunc}
        submitWithdraw={withdrawFunc}
        cancelFunc={cancelFunc}
        currentWalletAddress={""}
        currentDepositId={"0"}
        currentDepositAmount={"1.0"}
        depositDate={""}
        giveAssetType="sOHM"
        yieldSent={"0"}
        changeAssetType={changeAssetType}
      />,
    );

    fireEvent.click(screen.getByTestId("edit-donation"));

    fireEvent.input(screen.getByTestId("amount-input"), { target: { value: "2.1" } });
    expect(screen.getByTestId("amount-input")).toHaveDisplayValue("2.1");
  });
});
