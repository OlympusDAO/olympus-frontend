import { connectWallet } from "src/testHelpers";
import { render } from "src/testUtils";
import V1Stake from "src/views/V1-Stake/V1-Stake";
import { afterEach, describe, expect, it, test, vi } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("<Stake/>", () => {
  test("should render component. not connected", () => {
    it("should render component. not connected", async () => {
      const { container } = render(<V1Stake setMigrationModalOpen={false} />);
      expect(container).toMatchSnapshot();
    });
  });
  test("should render the stake input Area when connected", () => {
    it("should render the stake input Area when connected", async () => {
      connectWallet();
      const { container } = render(<V1Stake setMigrationModalOpen={false} />);
      expect(container).toMatchSnapshot();
    });
  });
  test("should render the stake input Area when connected", () => {
    it("should render the v1 migration modal", async () => {
      connectWallet();
      const { container } = render(<V1Stake setMigrationModalOpen={true} />);
      expect(container).toMatchSnapshot();
    });
  });
  test("should render the v1 migration modal and banner", () => {
    it("should render the v1 migration modal and banner", async () => {
      connectWallet();
      const { container } = render(<V1Stake setMigrationModalOpen={true} />);
      expect(container).toMatchSnapshot();
    });
  });
});
