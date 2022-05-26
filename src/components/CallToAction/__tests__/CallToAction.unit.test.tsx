import { render, screen } from "../../../testUtils";
import CallToAction from "../CallToAction";

describe("<CallToAction/>", () => {
  it("should display CTA", () => {
    render(<CallToAction setMigrationModalOpen={() => console.log("setMigrationModalOpen")} />);
    expect(screen.getByText("You have assets ready to migrate to v2"));
  });
});
