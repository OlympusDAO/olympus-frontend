import { render, screen } from "src/testUtils";
import { ExternalStakePools } from "src/views/Liquidity/ExternalStakePools/ExternalStakePools";
import { describe, expect, it } from "vitest";

describe("ExternalStakePools", () => {
  it("renders all pool chips", () => {
    render(<ExternalStakePools />);

    const allPoolChip = screen.getByText("All");
    const stablePoolChip = screen.getByText("Stable");
    const volatilePoolChip = screen.getByText("Volatile");
    const gohmPoolChip = screen.getByText("gOHM");

    expect(allPoolChip).not.toBeNull();
    expect(stablePoolChip).not.toBeNull();
    expect(volatilePoolChip).not.toBeNull();
    expect(gohmPoolChip).not.toBeNull();
  });
});
