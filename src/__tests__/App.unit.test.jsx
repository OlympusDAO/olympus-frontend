// import "src/helpers/index";

// import * as EthersContract from "@ethersproject/contracts";
// import { BigNumber } from "ethers";
// import App from "src/App";
// import { connectWallet, createMatchMedia, disconnectedWallet } from "src/testHelpers";
// import { act, render, renderRoute, screen } from "src/testUtils";
// import * as Contract from "src/typechain";
// import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock("src/helpers/index", () => ({
//   //...vi.importActual("src/helpers/index"),
//   // prevent safety check message from blocking wallet connect error message
//   shouldTriggerSafetyCheck: vi.fn().mockReturnValue(false),
// }));

// beforeEach(() => {
//   vi.useFakeTimers();
// });

// afterEach(() => {
//   vi.resetAllMocks();
//   vi.useRealTimers();
// });

// describe("<App/>", () => {
//   it("should render component", () => {
//     disconnectedWallet();
//     renderRoute("/");
//     expect(screen.getByText("Connect your wallet to stake OHM"));
//   });
//   it("should not render an error message when user wallet is connected and cached but not locked", async () => {
//     connectWallet();

//     await act(async () => {
//       renderRoute("/");
//     });
//     const errorMessage = await screen.queryByText("Please check your Wallet UI for connection errors");
//     expect(errorMessage).toBeNull(); // expect its not found
//   });
//   it("should not render a connection error message when user wallet is not cached, i.e. user has not connected wallet yet", async () => {
//     connectWallet();
//     await act(async () => {
//       renderRoute("/");
//     });
//     const errorMessage = await screen.queryByText("Please check your Wallet UI for connection errors");
//     expect(errorMessage).toBeNull(); // expect its not found
//   });
// });

// describe("Account Balances Slice", () => {
//   beforeEach(() => {
//     vi.mock("@ethersproject/contracts");
//   });
//   it("should load Account Balances with no error", async () => {
//     connectWallet();
//     Contract.GOHM__factory.connect = vi.fn().mockReturnValue({
//       balanceOf: vi.fn().mockReturnValue(BigNumber.from(10)),
//       allowance: vi.fn().mockReturnValue(BigNumber.from(10)),
//       balanceFrom: vi.fn().mockReturnValue(BigNumber.from(10)),
//     });
//     Contract.IERC20__factory.connect = vi.fn().mockReturnValue({
//       balanceOf: vi.fn().mockReturnValue(BigNumber.from(10)),
//       allowance: vi.fn().mockReturnValue(BigNumber.from(10)),
//     });
//     EthersContract.Contract = vi.fn().mockReturnValue({
//       allowance: vi.fn().mockReturnValue(BigNumber.from(10)),
//       callStatic: vi.fn().mockReturnValue({
//         balanceOfUnderlying: vi.fn().mockReturnValue(BigNumber.from(10)),
//         underlying: vi.fn().mockReturnValue(BigNumber.from(10)),
//       }),
//     });

//     expect(() => render(<App />)).not.toThrowError();
//   });

//   it("should load Account Balances and throw error", async () => {
//     connectWallet();
//     Contract.GOHM__factory.connect = vi.fn().mockReturnValue({
//       balanceOf: vi.fn().mockImplementation(() => {
//         throw Error("An Error!");
//       }),
//       allowance: vi.fn().mockReturnValue(BigNumber.from(10)),
//       balanceFrom: vi.fn().mockReturnValue(BigNumber.from(10)),
//     });
//     Contract.IERC20__factory.connect = vi.fn().mockReturnValue({
//       balanceOf: vi.fn().mockReturnValue(BigNumber.from(10)),
//       allowance: vi.fn().mockReturnValue(BigNumber.from(10)),
//     });
//     EthersContract.Contract = vi.fn().mockReturnValue({
//       allowance: vi.fn().mockImplementation(() => {
//         throw Error("An Error!");
//       }),
//       callStatic: vi.fn().mockReturnValue({
//         balanceOfUnderlying: vi.fn().mockReturnValue(BigNumber.from(10)),
//         underlying: vi.fn().mockReturnValue(BigNumber.from(10)),
//       }),
//     });

//     //we should handle the error and not throw
//     expect(() => render(<App />)).not.toThrowError();
//   });
// });

// describe("Staging Notification Checks", () => {
//   beforeEach(() => {
//     process.env.REACT_APP_STAGING_ENV = true;
//   });
//   it("Should display a notification banner when hostname = staging.olympusdao.finance", async () => {
//     connectWallet();
//     render(<App />);
//     expect(screen.getByTestId("staging-notification")).toHaveStyle({ marginLeft: "312px" });
//     expect(screen.getByText("You are on the staging site. Any interaction could result in loss of assets."));
//   });
//   it("Should display no left Margin on Mobile", async () => {
//     connectWallet();
//     window.matchMedia = createMatchMedia("300px");
//     render(<App />);
//     expect(screen.getByTestId("staging-notification")).toHaveStyle({ marginLeft: "0px" });
//     expect(screen.getByText("You are on the staging site. Any interaction could result in loss of assets."));
//   });
// });
// describe("Production Notification Check", () => {
//   beforeEach(() => {
//     process.env.REACT_APP_STAGING_ENV = false;
//   });
//   it("Should not display a notification when hostname not staging.olympusdao.finance", async () => {
//     connectWallet();
//     render(<App />);
//     expect(screen.queryByText("You are on the staging site. Any interaction could result in loss of assets.")).not;
//   });
// });
