import { useState } from "react";
import useSEO from "../useSEO.js";

// zidly.ai/switch — Migration page for businesses switching from competitors
const T = "#0D9488", TD = "#0F766E", TL = "#14B8A6";

const COMPETITORS = [
  { name: "Podium", savings: "$150-500/mo", contract: "12-month lock-in", cancel: "Must call sales" },
  { name: "Birdeye", savings: "$200-350/mo", contract: "Annual + 90-day notice", cancel: "Written notice required" },
  { name: "Broadly", savings: "$150-400/mo", contract: "12-month + $350 build-out", cancel: "Must call sales" },
  { name: "Thryv", savings: "$100-400/mo", contract: "6-12 month", cancel: "Notoriously difficult" },
  { name: "Other", savings: "Varies", contract: "Varies", cancel: "—" },
];

const TIMELINE = [
  { time: "Minute 0-5", task: "Run your free BizScore audit", detail: "See exactly where you stand before switching. Keep this as your baseline." },
  { time: "Minute 5-10", task: "Complete onboarding wizard", detail: "Enter your business info, competitors, and keywords. All tools activate automatically." },
  { time: "Hour 1", task: "AI chatbot is live", detail: "We scan your website and deploy your chatbot. Paste one line of code on your site." },
  { time: "Day 1-2", task: "Review systems active", detail: "Auto review requests configured. Review funnel live. Existing reviews imported." },
  { time: "Day 3", task: "Cancel your old provider", detail: "We'll guide you through the cancellation process for your specific provider." },
  { time: "Day 7", task: "First weekly report", detail: "See your chatbot conversations, new reviews, and ranking changes. Compare to your baseline." },
];

const TRANSFERS = [
  { item: "Your Google reviews", status: "auto", note: "We scan and import your existing reviews. Nothing is lost — reviews live on Google, not on Podium." },
  { item: "Your review response history", status: "auto", note: "We pull your review data directly from Google. Your old responses stay on Google permanently." },
  { item: "Your chatbot conversations", status: "fresh", note: "New chatbot trained on YOUR website data. Smarter than generic chat — knows your services, insurance, team." },
  { item: "Your customer contacts", status: "manual", note: "Export your contact list from your current provider (CSV). Import into Zidly or your CRM." },
  { item: "Your website chat widget", status: "swap", note: "Remove old provider's script tag, paste Zidly's. Under 2 minutes." },
  { item: "Your review request automation", status: "auto", note: "Set up fresh in Zidly. Same concept, better execution — smart routing, follow-ups, QR kit included." },
  { item: "Your rankings and SEO data", status: "fresh", note: "Zidly scans fresh. You get a new baseline and weekly tracking from day one." },
];

export default function SwitchPage() {
  useSEO({ title: "Switch to Zidly — Migration Guide from Podium, Birdeye, Thryv", description: "Step-by-step guide to switching from Podium, Birdeye, Broadly, or Thryv. Save $150-500/mo. No contracts. Live in 5 minutes.", canonical: "/switch" });
  const [selected, setSelected] = useState(null);

  return <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: "#0F172A", background: "#fff" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .sw-btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${TD}, ${TL}); color: #fff; border: none; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; text-decoration: none; transition: transform 0.15s; }
      .sw-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,148,136,0.3); }
      @media (max-width: 768px) { .sw-grid { grid-template-columns: 1fr !important; } }
    `}</style>

    {/* Hero */}
    <section style={{ padding: "100px 24px 60px", textAlign: "center", background: "linear-gradient(180deg, #F0FDFA 0%, #fff 100%)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.12, letterSpacing: -1.5, marginBottom: 16 }}>
          Switch to Zidly.<br /><span style={{ color: T }}>Keep everything. Save hundreds.</span>
        </h1>
        <p style={{ fontSize: 18, color: "#64748B", lineHeight: 1.6, marginBottom: 32 }}>
          Your reviews stay on Google. Your data exports cleanly. Your new chatbot is smarter. And you save $150-500/month. Here's exactly how it works.
        </p>
        <button className="sw-btn" style={{ fontSize: 16, padding: "16px 40px" }}>Start Free Trial →</button>
      </div>
    </section>

    {/* Who are you switching from? */}
    <section style={{ padding: "60px 24px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 24 }}>Who are you switching from?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }} className="sw-grid">
          {COMPETITORS.map(c => <div key={c.name} onClick={() => setSelected(c)} style={{ padding: 16, borderRadius: 12, border: `2px solid ${selected?.name === c.name ? T : "#E2E8F0"}`, background: selected?.name === c.name ? `${T}08` : "#fff", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: selected?.name === c.name ? T : "#0F172A" }}>{c.name}</div>
          </div>)}
        </div>
        {selected && <div style={{ marginTop: 20, padding: 24, background: "#FEF2F2", borderRadius: 14, border: "1px solid #FECACA" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="sw-grid">
            <div><div style={{ fontSize: 11, color: "#991B1B", fontWeight: 600, marginBottom: 4 }}>YOU'LL SAVE</div><div style={{ fontSize: 24, fontWeight: 900, color: "#DC2626" }}>{selected.savings}</div></div>
            <div><div style={{ fontSize: 11, color: "#991B1B", fontWeight: 600, marginBottom: 4 }}>THEIR CONTRACT</div><div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{selected.contract}</div></div>
            <div><div style={{ fontSize: 11, color: "#991B1B", fontWeight: 600, marginBottom: 4 }}>CANCELLATION</div><div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{selected.cancel}</div></div>
          </div>
        </div>}
      </div>
    </section>

    {/* What transfers */}
    <section style={{ padding: "60px 24px", background: "#FAFBFC" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 8 }}>Nothing gets lost</h2>
        <p style={{ textAlign: "center", fontSize: 14, color: "#64748B", marginBottom: 32 }}>Here's exactly what happens to each piece of your data</p>
        {TRANSFERS.map((t, i) => <div key={i} style={{ display: "flex", gap: 14, padding: 18, background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: t.status === "auto" ? "#F0FDF4" : t.status === "fresh" ? `${T}10` : "#FEF9C3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
            {t.status === "auto" ? "✅" : t.status === "fresh" ? "🔄" : t.status === "swap" ? "🔀" : "📋"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{t.item}</span>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600, background: t.status === "auto" ? "#DCFCE7" : t.status === "fresh" ? `${T}15` : "#FEF9C3", color: t.status === "auto" ? "#166534" : t.status === "fresh" ? TD : "#854D0E" }}>
                {t.status === "auto" ? "Automatic" : t.status === "fresh" ? "Fresh Start" : t.status === "swap" ? "Quick Swap" : "Manual Export"}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{t.note}</p>
          </div>
        </div>)}
      </div>
    </section>

    {/* Timeline */}
    <section style={{ padding: "60px 24px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 32 }}>Your switch timeline</h2>
        {TIMELINE.map((t, i) => <div key={i} style={{ display: "flex", gap: 20, marginBottom: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: i === 0 ? T : "#E2E8F0", border: `2px solid ${i === 0 ? T : "#CBD5E1"}`, flexShrink: 0 }} />
            {i < TIMELINE.length - 1 && <div style={{ width: 2, flex: 1, background: "#E2E8F0" }} />}
          </div>
          <div style={{ paddingBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T, marginBottom: 4 }}>{t.time}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{t.task}</div>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{t.detail}</p>
          </div>
        </div>)}
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: "60px 24px", textAlign: "center", background: `linear-gradient(135deg, ${TD}08, ${TL}05)` }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 12 }}>Start your free trial today</h2>
        <p style={{ fontSize: 15, color: "#64748B", marginBottom: 24 }}>14 days free. No credit card. Run both platforms side by side — cancel your old one when you're ready.</p>
        <button className="sw-btn" style={{ fontSize: 16, padding: "16px 40px" }}>Switch to Zidly →</button>
      </div>
    </section>
  </div>;
}
