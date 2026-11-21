import { describe, expect, it } from "vitest";
import { App } from "../src/App.js";

describe("Web App Sanity", () => {
  it("should export App functional component", () => {
    expect(typeof App).toBe("function");
  });
});
