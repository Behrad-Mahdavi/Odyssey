import { describe, expect, it } from "vitest";
import { Prototype } from "../src/index.js";

describe("Prototyping Lab Domain (F-010)", () => {
  describe("Prototype Conversation", () => {
    it("should create prototype conversation with story interview template", () => {
      const protoRes = Prototype.create({
        cycleId: "cycle-1",
        odysseyPlanId: "plan-1",
        questionIndex: 0,
        type: "CONVERSATION",
        title: "گفت‌وگو با معمار ارشد سیستم",
        hypothesis: "این نقش نیازمند ۵۰٪ مهارت‌های ارتباطی و رهبری در کنار دانش فنی است.",
        intervieweeRole: "Principal Systems Architect",
      });

      expect(protoRes.ok).toBe(true);
      if (!protoRes.ok) return;

      expect(protoRes.value.type).toBe("CONVERSATION");
      expect(protoRes.value.status).toBe("PLANNED");
      expect(protoRes.value.storyQuestions?.length).toBe(4);
      expect(protoRes.value.odysseyPlanId).toBe("plan-1");
      expect(protoRes.value.questionIndex).toBe(0);
    });

    it("should complete conversation with story notes and referral contact", () => {
      const proto = Prototype.create({
        cycleId: "cycle-1",
        type: "CONVERSATION",
        title: "گفت‌وگوی راهنما",
        hypothesis: "بررسی مدل درآمدی استودیو",
      });
      if (!proto.ok) return;

      const completed = proto.value.completeConversation(
        "نکته کلیدی: شروع با قراردادهای ساعتی و سپس انتقال به ارزش‌محور.",
        "دکتر علوی - هم‌بنیان‌گذار استودیوی دیزاین",
      );

      expect(completed.status).toBe("COMPLETED");
      expect(completed.conversationNotes).toContain("قراردادهای ساعتی");
      expect(completed.referralContact).toContain("دکتر علوی");
    });
  });

  describe("Prototype Experience", () => {
    it("should create prototype experience with cost and hypothesis", () => {
      const expRes = Prototype.create({
        cycleId: "cycle-1",
        type: "EXPERIENCE",
        title: "برگزاری کارگاه ۲ ساعته آزمایشی",
        hypothesis: "کاربران به تمپلیت‌های تعاملی بیش از آموزش ویدیویی علاقه‌مندند.",
        costEstimate: "۲ ساعت زمان + ابزار رایگان",
        duration: "۲ ساعت",
      });

      expect(expRes.ok).toBe(true);
      if (!expRes.ok) return;

      expect(expRes.value.type).toBe("EXPERIENCE");
      expect(expRes.value.costEstimate).toBe("۲ ساعت زمان + ابزار رایگان");

      const completed = expRes.value.completeExperience(
        "۸ نفر از ۱۰ شرکت‌کننده تمپلیت‌ها را بلافاصله استفاده کردند.",
        "PROCEED",
      );

      expect(completed.status).toBe("COMPLETED");
      expect(completed.nextStepVerdict).toBe("PROCEED");
    });

    it("should reject prototype with empty title or hypothesis", () => {
      const emptyTitle = Prototype.create({
        cycleId: "cycle-1",
        type: "EXPERIENCE",
        title: "   ",
        hypothesis: "فرضیه معتبر",
      });
      expect(emptyTitle.ok).toBe(false);

      const emptyHypothesis = Prototype.create({
        cycleId: "cycle-1",
        type: "EXPERIENCE",
        title: "عنوان معتبر",
        hypothesis: "   ",
      });
      expect(emptyHypothesis.ok).toBe(false);
    });
  });
});
