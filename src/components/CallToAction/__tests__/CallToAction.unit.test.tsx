import { LearnMoreButton, MigrateButton } from "src/components/CallToAction/CallToAction";
import CallToAction from "src/components/CallToAction/CallToAction";
import { fireEvent, render } from "src/testUtils";
import { describe, expect, it, test, vi } from "vitest";

describe("<CallToAction/>", () => {
  test("should render component", () => {
    it("should render component", () => {
      const container = render(<CallToAction setMigrationModalOpen={() => console.log("setMigrationModalOpen")} />);
      expect(container).toMatchSnapshot();
    });
  });
});

describe("LearnMoreButton", () => {
  it("renders a link to the Olympus DAO migration docs", () => {
    const container = render(<LearnMoreButton />);
    const link = container.getByRole("link", { name: /learn more/i });
    expect(link).toHaveProperty("href", "https://docs.olympusdao.finance/main/basics/migration");
  });
});

describe("MigrateButton", () => {
  it("renders button with correct text", () => {
    const { getByText } = render(<MigrateButton setMigrationModalOpen={vi.fn()} btnText="Migrate Now" />);
    expect(getByText("Migrate Now")).not.toBeNull();
  });

  it("calls setMigrationModalOpen when clicked", () => {
    const setMigrationModalOpen = vi.fn();
    const { getByRole } = render(<MigrateButton setMigrationModalOpen={setMigrationModalOpen} btnText="Migrate Now" />);
    const button = getByRole("button");
    fireEvent.click(button);
    expect(setMigrationModalOpen).toHaveBeenCalledTimes(1);
    expect(setMigrationModalOpen).toHaveBeenCalledWith(true);
  });
});
