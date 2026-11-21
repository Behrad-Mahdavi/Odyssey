import { ODYSSEY_COLORS } from "@odyssey/ui";
import type React from "react";

export function App(): React.JSX.Element {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center">
      <header className="text-center max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-6 bg-slate-100 border border-slate-200 text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local Vault · Offline</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">
          Odyssey — استودیوی طراحی زندگی
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-8">
          یک استودیوی بصری، لمسی و محلی برای تفکر طراحی مسیر شغلی و زندگی بر پایه متدولوژی Designing
          Your Life.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        <div
          className="p-5 rounded-lg border border-slate-200 bg-white shadow-xs"
          style={{ borderTopColor: ODYSSEY_COLORS.odysseyPlans.life1, borderTopWidth: 4 }}
        >
          <h2 className="font-semibold text-slate-800 text-sm mb-1">مسیر اول (Life 1)</h2>
          <p className="text-xs text-slate-500">تکامل و ادامه مسیر فعلی شما</p>
        </div>
        <div
          className="p-5 rounded-lg border border-slate-200 bg-white shadow-xs"
          style={{ borderTopColor: ODYSSEY_COLORS.odysseyPlans.life2, borderTopWidth: 4 }}
        >
          <h2 className="font-semibold text-slate-800 text-sm mb-1">مسیر دوم (Life 2)</h2>
          <p className="text-xs text-slate-500">سناریوی جایگزین در صورت تغییر بازار</p>
        </div>
        <div
          className="p-5 rounded-lg border border-slate-200 bg-white shadow-xs"
          style={{ borderTopColor: ODYSSEY_COLORS.odysseyPlans.life3, borderTopWidth: 4 }}
        >
          <h2 className="font-semibold text-slate-800 text-sm mb-1">مسیر سوم (Wild Card)</h2>
          <p className="text-xs text-slate-500">طرح رویایی بدون قید پول و پرستیژ</p>
        </div>
      </section>
    </main>
  );
}
