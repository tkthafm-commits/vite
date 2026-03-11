import { useState } from "react";
import useSEO from "../useSEO.js";

// zidly.ai/vs/podium — Comparison page targeting "Podium alternative" searches
// Also works as template for /vs/birdeye, /vs/thryv, /vs/broadly, /vs/nicejob

const T = "#0D9488", TD = "#0F766E", TL = "#14B8A6";

const COMPETITOR = {
  name: "Podium",
  tagline: "messaging platform",
  priceRange: "$249–$599/mo",
  contract: "12-month minimum",
  cancellation: "Must call sales, difficult to cancel, auto-renews",
  g2Rating: "4.6",
  complaints: [
    "12-month contract locks you in even if the product doesn't work",
    "Price hikes at renewal without warning — some report 30%+ increases",
    "Basic plan ($249/mo) is messaging only — no SEO, no content, no competitor tracking",
    "Hidden fees: setup fees, per-location charges, text overage costs",
    "Cancellation requires calling sales and navigating retention offers",
    "No transparent pricing on their website — forces a sales call",
    "Support quality drops significantly after the initial sale",
  ],
  missingFeatures: [
    "No SEO tools (schema, rank tracking, site health)",
    "No social content generation",
    "No blog writer or content engine",
    "No competitor tracking or intelligence",
    "No BizScorer-style free audit",
    "No transparent pricing page",
    "No month-to-month option",
  ],
};

const COMPARISON = [
  { feature: "AI Chatbot (trained on your business)", zidly: true, them: false, note: "Podium has basic webchat, not AI-trained" },
  { feature: "Review Management", zidly: true, them: true, note: "" },
  { feature: "Review Request Automation", zidly: true, them: true, note: "" },
  { feature: "SEO Site Audit (15+ checks)", zidly: true, them: false, note: "" },
  { feature: "Schema Markup Generator", zidly: true, them: false, note: "" },
  { feature: "Google Maps Rank Tracker", zidly: true, them: false, note: "" },
  { feature: "Social Content Generator", zidly: true, them: false, note: "" },
  { feature: "Blog & Article Writer", zidly: true, them: false, note: "" },
  { feature: "Ad Campaign Builder", zidly: true, them: false, note: "" },
  { feature: "Email Campaign Studio", zidly: true, them: false, note: "" },
  { feature: "Competitor Deep Analysis", zidly: true, them: false, note: "" },
  { feature: "Competitor Activity Tracking", zidly: true, them: false, note: "" },
  { feature: "Revenue Radar (lost revenue calculator)", zidly: true, them: false, note: "" },
  { feature: "Free Business Audit Tool", zidly: true, them: false, note: "" },
  { feature: "QR Code Review Kit", zidly: true, them: true, note: "" },
  { feature: "Lead Inbox (unified)", zidly: true, them: true, note: "" },
  { feature: "Monthly ROI Reports", zidly: true, them: false, note: "Podium has basic analytics" },
  { feature: "No Contract Required", zidly: true, them: false, note: "Podium requires 12-month minimum" },
  { feature: "Transparent Pricing", zidly: true, them: false, note: "Podium hides pricing behind sales calls" },
  { feature: "Cancel From Dashboard", zidly: true, them: false, note: "Podium requires calling sales to cancel" },
  { feature: "Data Export Available", zidly: true, them: false, note: "" },
  { feature: "Starting Price", zidly: "$97/mo", them: "$249/mo", note: "" },
];

const REAL_COMPLAINTS = [
  { text: "Locked into a 12-month contract. Tried to cancel after month 3 when we realized it wasn't working. They wouldn't let us out.", source: "G2 Review", stars: 2 },
  { text: "Started at $249/mo. At renewal they bumped it to $350 with zero notice. When I pushed back, the 'discount' was still more than I originally paid.", source: "Capterra Review", stars: 1 },
  { text: "The webchat is basic. It's not trained on my business. When someone asks about insurance, it just says 'contact us'. That's not helpful.", source: "G2 Review", stars: 3 },
  { text: "Support was great during the sales process. After I signed the contract, response time went from hours to days.", source: "Trustpilot Review", stars: 2 },
];

export default function VsPodium() {
  useSEO({ title: "Zidly vs Podium — Best Podium Alternative for Dentists", description: "Compare Zidly vs Podium side-by-side. AI chatbot, review management, SEO, competitor tracking — all for $97/mo vs Podium's $249-599/mo. No contracts.", canonical: "/vs/podium" });
  const [openFaq, setOpenFaq] = useState(null);
  const zCount = COMPARISON.filter(c => c.zidly === true).length;
  const tCount = COMPARISON.filter(c => c.them === true).length;

  return <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: "#0F172A", background: "#fff" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .vs-btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${TD}, ${TL}); color: #fff; border: none; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; text-decoration: none; transition: transform 0.15s, box-shadow 0.15s; }
      .vs-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,148,136,0.3); }
      @media (max-width: 768px) { .vs-grid { grid-template-columns: 1fr !important; } }
    `}</style>

    {/* Hero */}
    <section style={{ padding: "100px 24px 60px", textAlign: "center", background: "linear-gradient(180deg, #FEF2F2 0%, #fff 100%)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "inline-block", padding: "6px 16px", background: "#FEE2E2", borderRadius: 20, fontSize: 13, color: "#DC2626", fontWeight: 600, marginBottom: 20 }}>Switching from {COMPETITOR.name}?</div>
        <h1 style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.12, letterSpacing: -1.5, marginBottom: 18 }}>
          Zidly vs {COMPETITOR.name}:<br /><span style={{ color: T }}>3x the features. 1/3 the price. No contract.</span>
        </h1>
        <p style={{ fontSize: 18, color: "#64748B", lineHeight: 1.6, marginBottom: 32 }}>
          {COMPETITOR.name} charges {COMPETITOR.priceRange} with a {COMPETITOR.contract}. Zidly starts at $97/mo with no contract and more features. Here's the full comparison.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="vs-btn">Try Zidly Free →</button>
          <a href="#comparison" style={{ display: "inline-block", padding: "14px 32px", background: "transparent", color: T, border: `2px solid ${T}`, borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", textDecoration: "none" }}>See Full Comparison ↓</a>
        </div>
      </div>
    </section>

    {/* Score Cards */}
    <section style={{ padding: "40px 24px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="vs-grid">
        <div style={{ background: `${T}08`, border: `2px solid ${T}`, borderRadius: 16, padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T, marginBottom: 8 }}>ZIDLY</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: T }}>{zCount}</div>
          <div style={{ fontSize: 14, color: "#64748B" }}>features included</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginTop: 12 }}>$97<span style={{ fontSize: 14, fontWeight: 500, color: "#64748B" }}>/mo</span></div>
          <div style={{ fontSize: 12, color: "#64748B" }}>No contract</div>
        </div>
        <div style={{ background: "#FEF2F2", border: "2px solid #FECACA", borderRadius: 16, padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginBottom: 8 }}>{COMPETITOR.name.toUpperCase()}</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#DC2626" }}>{tCount}</div>
          <div style={{ fontSize: 14, color: "#64748B" }}>features included</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginTop: 12 }}>{COMPETITOR.priceRange.split("–")[0]}<span style={{ fontSize: 14, fontWeight: 500, color: "#64748B" }}>/mo</span></div>
          <div style={{ fontSize: 12, color: "#DC2626" }}>{COMPETITOR.contract}</div>
        </div>
      </div>
    </section>

    {/* Comparison Table */}
    <section id="comparison" style={{ padding: "60px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, textAlign: "center", marginBottom: 32 }}>Feature-by-feature comparison</h2>
        <div style={{ borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", padding: "14px 20px", background: "#F8FAFC", fontWeight: 700, fontSize: 13 }}>
            <div>Feature</div><div style={{ textAlign: "center", color: T }}>Zidly</div><div style={{ textAlign: "center", color: "#94A3B8" }}>{COMPETITOR.name}</div>
          </div>
          {COMPARISON.map((c, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px", padding: "12px 20px", borderTop: "1px solid #E2E8F0", fontSize: 13, alignItems: "center" }}>
            <div>
              <span style={{ fontWeight: 500 }}>{c.feature}</span>
              {c.note && <span style={{ display: "block", fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{c.note}</span>}
            </div>
            <div style={{ textAlign: "center", fontSize: typeof c.zidly === "string" ? 13 : 16, fontWeight: typeof c.zidly === "string" ? 800 : 400, color: c.zidly === true ? "#22C55E" : typeof c.zidly === "string" ? T : "#EF4444" }}>
              {c.zidly === true ? "✓" : c.zidly === false ? "✕" : c.zidly}
            </div>
            <div style={{ textAlign: "center", fontSize: typeof c.them === "string" ? 13 : 16, color: c.them === true ? "#22C55E" : typeof c.them === "string" ? "#64748B" : "#EF4444" }}>
              {c.them === true ? "✓" : c.them === false ? "✕" : c.them}
            </div>
          </div>)}
        </div>
      </div>
    </section>

    {/* What Podium Users Say */}
    <section style={{ padding: "60px 24px", background: "#FAFBFC" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 8 }}>What {COMPETITOR.name} users actually say</h2>
        <p style={{ textAlign: "center", fontSize: 14, color: "#64748B", marginBottom: 32 }}>From G2, Capterra, and Trustpilot reviews</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {REAL_COMPLAINTS.map((c, i) => <div key={i} style={{ padding: 20, background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", borderLeft: "4px solid #EF4444" }}>
            <div style={{ fontSize: 14, color: "#DC2626", marginBottom: 6 }}>{"★".repeat(c.stars)}<span style={{ opacity: 0.2 }}>{"★".repeat(5 - c.stars)}</span></div>
            <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, fontStyle: "italic" }}>"{c.text}"</p>
            <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 8 }}>— {c.source}</p>
          </div>)}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Zidly: No contracts. Cancel from your dashboard. Transparent pricing.</p>
          <button className="vs-btn">Switch to Zidly →</button>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: "60px 24px", textAlign: "center", background: `linear-gradient(135deg, ${TD}08, ${TL}05)` }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 12 }}>Ready to switch?</h2>
        <p style={{ fontSize: 16, color: "#64748B", marginBottom: 24 }}>14-day free trial. No credit card. Import your data. Live in 5 minutes.</p>
        <button className="vs-btn" style={{ fontSize: 16, padding: "16px 40px" }}>Start Free Trial →</button>
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 16 }}>Currently paying for {COMPETITOR.name}? We'll help you migrate. No data lost.</p>
      </div>
    </section>
  </div>;
}
