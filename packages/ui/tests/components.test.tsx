import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  MindsetBadge,
  TactileGauge,
  containsPhysicalCss,
} from "../src/index.js";

describe("Odyssey UI Component Suite", () => {
  it("renders Button with primary variant and logical classes", () => {
    const html = renderToStaticMarkup(<Button variant="primary">اقدام</Button>);
    expect(html).toContain("اقدام");
    expect(html).toContain("ps-4");
    expect(html).toContain("pe-4");
    expect(containsPhysicalCss(html)).toBe(false);
  });

  it("renders Badge with positive signal", () => {
    const html = renderToStaticMarkup(<Badge variant="positive">رشد</Badge>);
    expect(html).toContain("رشد");
    expect(containsPhysicalCss(html)).toBe(false);
  });

  it("renders MindsetBadge with tooltip trigger", () => {
    const html = renderToStaticMarkup(
      <MindsetBadge
        type="curiosity"
        name="کنجکاوی"
        description="پرسشگری دقیق و جستجوی امکانات تازه"
      />,
    );
    expect(html).toContain("[کنجکاوی]");
    expect(containsPhysicalCss(html)).toBe(false);
  });

  it("renders TactileGauge with calibrated ticks and accessibility attributes", () => {
    const html = renderToStaticMarkup(<TactileGauge label="سلامت" value={75} />);
    expect(html).toContain('role="slider"');
    expect(html).toContain('aria-valuenow="75"');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax="100"');
    expect(html).toContain("75%");
    expect(html).toContain("سلامت");
    expect(containsPhysicalCss(html)).toBe(false);
  });

  it("renders Card container with clean 1px borders", () => {
    const html = renderToStaticMarkup(
      <Card>
        <CardHeader>
          <CardTitle>عنوان کارت</CardTitle>
        </CardHeader>
      </Card>,
    );
    expect(html).toContain("عنوان کارت");
    expect(html).toContain("border");
    expect(containsPhysicalCss(html)).toBe(false);
  });
});
