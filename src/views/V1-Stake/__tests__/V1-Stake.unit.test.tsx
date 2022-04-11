import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";

import { render } from "../../../testUtils";
import V1Stake from "../V1-Stake";

beforeEach(() => {
  const data = jest.spyOn(useWeb3Context, "useWeb3Context");
  data.mockReturnValue(mockWeb3Context);
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("<Stake/>", () => {
  it("should render component. not connected", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue({ ...mockWeb3Context, connected: false });
    const { container } = await render(
      <V1Stake oldAssetsDetected={false} setMigrationModalOpen={false} hasActiveV1Bonds={false} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("should render the stake input Area when connected", async () => {
    const { container } = await render(
      <V1Stake oldAssetsDetected={false} setMigrationModalOpen={false} hasActiveV1Bonds={false} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("should render the v1 migration modal", async () => {
    const { container } = await render(
      <V1Stake oldAssetsDetected={false} setMigrationModalOpen={true} hasActiveV1Bonds={false} />,
    );
    expect(container).toMatchSnapshot();
  });
  it("should render the v1 migration modal and banner", async () => {
    const { container } = await render(
      <V1Stake oldAssetsDetected={true} setMigrationModalOpen={true} hasActiveV1Bonds={false} />,
    );
    expect(container).toMatchSnapshot();
  });
});
