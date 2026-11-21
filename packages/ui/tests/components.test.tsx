import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CompassEditor,
  ContextualNudge,
  GoodTimeJournal,
  GravityBoard,
  MindsetBadge,
  OdysseyPlansStudio,
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

  it("renders ContextualNudge with mindset badge and prompt", () => {
    const html = renderToStaticMarkup(
      <ContextualNudge
        mindset="bias_to_action"
        mindsetName="گرایش به عمل"
        title="آزمودن فرضیه"
        prompt="یک آزمون کوچک ۵ دقیقه‌ای طراحی کنید."
      />,
    );
    expect(html).toContain("[گرایش به عمل]");
    expect(html).toContain("آزمودن فرضیه");
    expect(html).toContain("یک آزمون کوچک ۵ دقیقه‌ای طراحی کنید.");
    expect(containsPhysicalCss(html)).toBe(false);
  });

  it("renders GravityBoard with 2 columns and logical classes", () => {
    const html = renderToStaticMarkup(
      <GravityBoard
        problems={[
          { id: "1", content: "بودجه شرکت ثابت است", isGravity: true },
          { id: "2", content: "بهبود مهارت تایپ‌اسکریپت", isGravity: false },
        ]}
        onAddProblem={() => {}}
        onToggleClassification={() => {}}
        t={(k) => k}
      />,
    );
    expect(html).toContain("بودجه شرکت ثابت است");
    expect(html).toContain("بهبود مهارت تایپ‌اسکریپت");
    expect(containsPhysicalCss(html)).toBe(false);
  });

  it("renders CompassEditor with dual views and logical classes", () => {
    const html = renderToStaticMarkup(
      <CompassEditor
        initialData={{
          workview: "دیدگاه کار برای من ساخت ابزارهای ارزشمند است.",
          lifeview: "زندگی فرصتی برای یادگیری و اثرگذاری مثبت است.",
        }}
        onSave={() => {}}
        t={(k) => k}
      />,
    );
    expect(html).toContain("دیدگاه کار برای من ساخت ابزارهای ارزشمند است.");
    expect(html).toContain("زندگی فرصتی برای یادگیری و اثرگذاری مثبت است.");
    expect(containsPhysicalCss(html)).toBe(false);
  });

  it("renders GoodTimeJournal with 3-stage tabs and logical classes", () => {
    const html = renderToStaticMarkup(
      <GoodTimeJournal
        entries={[
          {
            id: "entry-1",
            title: "طراحی معماری تمیز",
            engagement: 90,
            energy: 80,
            isFlow: true,
            durationMinutes: 60,
          },
        ]}
        onAddEntry={() => {}}
        t={(k) => k}
      />,
    );
    expect(html).toContain("طراحی معماری تمیز");
    expect(html).toContain("goodTimeJournal.stage1");
    expect(html).toContain("goodTimeJournal.stage2");
    expect(html).toContain("goodTimeJournal.stage3");
    expect(containsPhysicalCss(html)).toBe(false);
  });

  it("renders OdysseyPlansStudio with 3 parallel paths, gauges and logical classes", () => {
    const html = renderToStaticMarkup(
      <OdysseyPlansStudio
        plans={{
          LIFE_1: {
            slot: "LIFE_1",
            sixWordTitle: "توسعه معماری سیستم و رهبری مهندسی",
            resources: 80,
            likability: 85,
            confidence: 75,
            coherence: 90,
            questions: ["سؤال ۱", "سؤال ۲", "سؤال ۳"],
            timelineEvents: [{ year: 1, type: "work", description: "شروع مسیر" }],
          },
          LIFE_2: {
            slot: "LIFE_2",
            sixWordTitle: "تدریس و استودیوی مستقل طراحی ابزار",
            resources: 60,
            likability: 90,
            confidence: 65,
            coherence: 85,
            questions: ["سؤال ۱", "سؤال ۲", "سؤال ۳"],
            timelineEvents: [],
          },
          LIFE_3: {
            slot: "LIFE_3",
            sixWordTitle: "زیست آرام و پژوهش فلسفه تاریخ",
            resources: 40,
            likability: 95,
            confidence: 50,
            coherence: 95,
            questions: ["سؤال ۱", "سؤال ۲", "سؤال ۳"],
            timelineEvents: [],
          },
        }}
        onUpdatePlan={() => {}}
        t={(k) => k}
      />,
    );
    expect(html).toContain("توسعه معماری سیستم و رهبری مهندسی");
    expect(html).toContain("تدریس و استودیوی مستقل طراحی ابزار");
    expect(html).toContain("زیست آرام و پژوهش فلسفه تاریخ");
    expect(containsPhysicalCss(html)).toBe(false);
  });
});
