import { render } from "@testing-library/react";
import { SafariFooter } from "src/components/SafariFooter";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("SafariFooter", () => {
  let userAgent: string;

  beforeAll(() => {
    userAgent = navigator.userAgent;
    Object.defineProperty(window, "navigator", {
      value: { userAgent: "iPhone Safari" },
      writable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(window, "navigator", {
      value: { userAgent },
      writable: true,
    });
  });

  it("renders the Safari iPhone footer", () => {
    const { container } = render(<SafariFooter />);

    expect(container.querySelector("#safari-iphone-footer")).not.toBeNull();
  });

  it("does not render the Safari iPhone footer on other browsers", () => {
    Object.defineProperty(window, "navigator", {
      value: { userAgent: "Chrome" },
      writable: true,
    });

    const { container } = render(<SafariFooter />);

    expect(container.querySelector("#safari-iphone-footer")).toBeNull();
  });
});
