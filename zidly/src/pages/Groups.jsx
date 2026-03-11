import { useState } from "react";
import useSEO from "../useSEO.js";

// zidly.ai/groups — DSO & Multi-Location Dental Group landing page
// Target: mid-market dental groups (5-50 locations)
// Positioning: "One platform, all locations, 1/5 the cost"
const T = "#0D9488", TD = "#0F766E", TL = "#14B8A6";

const PRICING_CALC = (locs, tier) => {
  const tiers = {
    core:  { base: 97,  add: 67,  label: "Core" },
    plus:  { base: 197, add: 147, label: "Plus" },
    pro:   { base: 347, add: 247, label: "Pro" },
    elite: { base: 697, add: 497, label: "Elite" },
  };
  const t = tiers[tier];
  const zidly = t.base + (Math.max(0, locs - 1)) * t.add;
  const podium = locs * 249;
  const birdeye = locs * 299;
  return { zidly, podium, birdeye, savings: podium - zidly, savingsAnnual: (podium - zidly) * 12, perLoc: Math.round(zidly / locs), t };
};

const GROUP_FEATURES = [
  { icon: "📊", title: "One Dashboard, All Locations", desc: "See every location's reviews, chatbot activity, leads, BizScorer score, and production impact from a single view. Filter by location, region, or provider. No more logging into 15 different accounts." },
  { icon: "🚀", title: "Deploy Across All Locations in One Day", desc: "Onboard your first location in 5 minutes. Clone the setup to every other location with one click — chatbot, review automation, SEO monitoring, and content engine activate simultaneously." },
  { icon: "⭐", title: "Consolidated Review Command Center", desc: "Every Google review across every location in one feed. AI-drafted responses in each location's brand voice. Priority alerts for negative reviews. Monthly review growth comparison by location." },
  { icon: "🤖", title: "Location-Specific AI Patient Assistants", desc: "Each location gets its own chatbot trained on THAT location's services, insurance, hours, and providers. A patient asking about insurance at your Phoenix location gets Phoenix answers, not Dallas." },
  { icon: "📈", title: "Production Impact by Location", desc: "See which locations are capturing the most after-hours patients, collecting the most reviews, and recovering the most lapsed patients. Identify underperformers and replicate what works." },
  { icon: "🏆", title: "Internal Location Rankings", desc: "Gamify performance. Rank your locations by BizScorer, review count, chatbot activity, and reactivation rate. Regional managers see their locations vs the group average. Creates healthy internal competition." },
  { icon: "👥", title: "Role-Based Access", desc: "Group owner sees everything. Regional manager sees their locations. Office manager sees their single location. Front desk sees their lead inbox. Everyone gets exactly the view they need." },
  { icon: "💰", title: "Single Invoice, All Locations", desc: "One monthly charge covering every location. Add or remove locations from your dashboard — billing adjusts automatically. No per-location contracts or setup calls." },
];

const COMPETITOR_TABLE = [
  ["Centralized multi-location dashboard", true, false, false],
  ["AI chatbot per location (trained on each)", true, false, false],
  ["Review management (all locations)", true, true, true],
  ["Location-specific SEO monitoring", true, false, true],
  ["AI Visibility scoring (Gemini)", true, false, false],
  ["Social content per location", true, false, false],
  ["Competitor tracking per market", true, false, true],
  ["Patient reactivation automation", true, false, false],
  ["Case acceptance follow-up", true, false, false],
  ["Internal location ranking", true, false, false],
  ["Production impact dashboard", true, false, false],
  ["BizScorer audit per location", true, false, false],
  ["No contracts required", true, false, false],
  ["Transparent per-location pricing", true, false, false],
  ["One-day deployment (all locations)", true, false, false],
  ["Pricing (15 locations)", "$1,035/mo", "$3,735/mo", "$4,485/mo"],
];

const TESTIMONIAL_QUOTES = [
  { text: "We were paying Podium $249/location across 8 practices. That's $2,000/month for webchat and reviews. Zidly gives us everything Podium did plus SEO, content, competitor tracking, and a chatbot that actually knows each practice. For $566/month total.", role: "COO, 8-location dental group", stars: 5 },
  { text: "The consolidated dashboard is what sold us. Before Zidly, our regional managers were logging into 4 different tools per location. Now it's one login, one view, one monthly report for the board.", role: "VP Operations, 22-location DSO", stars: 5 },
  { text: "We deployed Zidly across 12 locations in two days. The chatbots were live, review automation was running, and we had our first consolidated report by Friday. With our previous vendor, onboarding took 6 weeks per location.", role: "Director of Marketing, 12-location group", stars: 5 },
];

export default function GroupsLanding() {
  useSEO({ title: "AI for Dental Groups & DSOs — One Platform, All Locations", description: "Manage AI chatbots, reviews, and SEO across 5-500+ dental locations. Consolidated reporting. 1/5 the cost of Podium. Volume pricing from $67/location.", canonical: "/groups" });
  const [locs, setLocs] = useState(10);
  const [tier, setTier] = useState("plus");
  const calc = PRICING_CALC(locs, tier);

  return <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: "#0F172A", background: "#fff", minHeight: "100vh" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .gp-btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${TD}, ${TL}); color: #fff; border: none; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; transition: transform 0.15s; }
      .gp-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,148,136,0.3); }
      @media (max-width: 768px) { .gp-grid { grid-template-columns: 1fr !important; } .gp-hero { font-size: 30px !important; } }
    `}</style>

    {/* Nav */}
    <nav style={{ padding: "14px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg,${T},${TL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 13 }}>Z</div>
        <span style={{ fontWeight: 800, fontSize: 16 }}>Zidly</span>
        <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>for Dental Groups & DSOs</span>
      </div>
      <button className="gp-btn" style={{ padding: "8px 20px", fontSize: 13 }}>Request Demo →</button>
    </nav>

    <div style={{ maxWidth: 840, margin: "0 auto", padding: "0 24px" }}>

      {/* Hero */}
      <section style={{ padding: "56px 0 36px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "5px 14px", background: `${T}10`, borderRadius: 16, fontSize: 12, color: T, fontWeight: 600, marginBottom: 16 }}>For dental groups with 5-500+ locations</div>
        <h1 className="gp-hero" style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.12, letterSpacing: -1.5, marginBottom: 16 }}>
          One platform. All locations.<br /><span style={{ color: T }}>1/5 the cost of Podium.</span>
        </h1>
        <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.65, maxWidth: 600, margin: "0 auto 28px" }}>
          You're managing reviews, chatbots, SEO, and content across {locs} locations using 4-5 different tools. Each tool charges per location. Each has its own login. Nobody has a consolidated view. Zidly replaces all of them — deployed across every location in one day.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="gp-btn" style={{ fontSize: 16, padding: "16px 36px" }}>Request Group Demo →</button>
          <a href="#calculator" style={{ display: "inline-flex", alignItems: "center", padding: "14px 28px", color: T, border: `2px solid ${T}`, borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", fontFamily: "inherit" }}>See Your Savings ↓</a>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: "#0F172A", borderRadius: 14, padding: "28px 24px", marginBottom: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, textAlign: "center" }} className="gp-grid">
          {[
            { stat: "1 day", label: "to deploy across all locations" },
            { stat: "1 dashboard", label: "for every location's performance" },
            { stat: "1 invoice", label: "covering all locations monthly" },
            { stat: `$${calc.perLoc}`, label: `per location/month (${calc.t.label} plan)` },
          ].map(s => <div key={s.label}><div style={{ fontSize: 26, fontWeight: 900, color: TL }}>{s.stat}</div><div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{s.label}</div></div>)}
        </div>
      </section>

      {/* The Problem */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, textAlign: "center", marginBottom: 20, letterSpacing: -0.5 }}>The multi-location marketing mess.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="gp-grid">
          {[
            { icon: "🔐", title: "15 logins for 15 locations", desc: "Your team logs into Podium, BrightLocal, Hootsuite, and Google Business Profile separately for each location. That's 60+ logins. Nobody has a complete picture." },
            { icon: "💸", title: "Per-location pricing that scales painfully", desc: "Podium at $249/location × 15 = $3,735/month. Birdeye at $299/location × 15 = $4,485/month. For reviews and webchat. That's it." },
            { icon: "📊", title: "No consolidated performance view", desc: "Which location has the best reviews? Which is losing the most after-hours patients? Which needs intervention? Nobody knows without manually pulling reports from 5 systems." },
            { icon: "🐌", title: "6-week onboarding per location", desc: "Adding a new location to your current vendor means setup calls, configuration, training, and billing changes. With Zidly, clone an existing location's setup in one click." },
          ].map(p => <div key={p.title} style={{ padding: 22, background: "#FEF2F2", borderRadius: 14, border: "1px solid #FECACA" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{p.title}</h3>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{p.desc}</p>
          </div>)}
        </div>
      </section>

      {/* Features */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, textAlign: "center", marginBottom: 20, letterSpacing: -0.5 }}>Built for groups. Not bolted on.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="gp-grid">
          {GROUP_FEATURES.map(f => <div key={f.title} style={{ padding: 20, background: "#FAFBFC", borderRadius: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{f.title}</h3>
            <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{f.desc}</p>
          </div>)}
        </div>
      </section>

      {/* Pricing Calculator */}
      <section id="calculator" style={{ background: "#0F172A", borderRadius: 16, padding: 32, marginBottom: 36 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 6 }}>Calculate your savings</h2>
        <p style={{ fontSize: 14, color: "#94A3B8", textAlign: "center", marginBottom: 24 }}>Adjust locations and plan to see real-time comparison</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 500, margin: "0 auto 24px" }} className="gp-grid">
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", display: "block", marginBottom: 6 }}>Number of Locations</label>
            <input type="range" min={2} max={50} value={locs} onChange={e => setLocs(parseInt(e.target.value))} style={{ width: "100%", accentColor: T }} />
            <div style={{ textAlign: "center", fontSize: 28, fontWeight: 900, color: TL, marginTop: 4 }}>{locs}</div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", display: "block", marginBottom: 6 }}>Plan Tier</label>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {["core","plus","pro","elite"].map(t =>
                <button key={t} onClick={() => setTier(t)} style={{ padding: "6px 12px", background: tier === t ? T : "#1E293B", color: tier === t ? "#fff" : "#94A3B8", border: `1px solid ${tier === t ? T : "#334155"}`, borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>{t}</button>
              )}
            </div>
          </div>
        </div>

        {/* Comparison Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }} className="gp-grid">
          <div style={{ background: `${T}15`, border: `2px solid ${T}`, borderRadius: 12, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T, marginBottom: 6 }}>ZIDLY ({calc.t.label})</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>${calc.zidly.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>/month · {locs} locations</div>
            <div style={{ fontSize: 11, color: TL, marginTop: 4 }}>${calc.perLoc}/location</div>
          </div>
          <div style={{ background: "#1E293B", borderRadius: 12, padding: 20, textAlign: "center", border: "1px solid #334155" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>PODIUM</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>${calc.podium.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>/month · {locs} locations</div>
            <div style={{ fontSize: 11, color: "#EF4444", marginTop: 4 }}>$249/location · 12-month contract</div>
          </div>
          <div style={{ background: "#1E293B", borderRadius: 12, padding: 20, textAlign: "center", border: "1px solid #334155" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", marginBottom: 6 }}>BIRDEYE</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>${calc.birdeye.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>/month · {locs} locations</div>
            <div style={{ fontSize: 11, color: "#EF4444", marginTop: 4 }}>$299/location · Annual + 90-day cancel</div>
          </div>
        </div>

        {/* Savings Highlight */}
        <div style={{ marginTop: 16, padding: 18, background: `${T}12`, borderRadius: 12, textAlign: "center", border: `1px solid ${T}40` }}>
          <div style={{ fontSize: 14, color: "#94A3B8" }}>Your annual savings vs Podium:</div>
          <div style={{ fontSize: 40, fontWeight: 900, color: TL, lineHeight: 1.2 }}>${calc.savingsAnnual.toLocaleString()}</div>
          <div style={{ fontSize: 13, color: "#94A3B8" }}>${calc.savings.toLocaleString()}/month · No contracts · All locations on one dashboard</div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button className="gp-btn" style={{ fontSize: 16, padding: "16px 40px" }}>Request Group Demo →</button>
          <p style={{ fontSize: 11, color: "#64748B", marginTop: 8 }}>50+ locations? Contact us for enterprise pricing.</p>
        </div>
      </section>

      {/* Comparison Table */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 20 }}>Feature comparison for dental groups</h2>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", padding: "12px 16px", background: "#F8FAFC", fontWeight: 700, fontSize: 11, color: "#64748B" }}>
            <div>Feature</div><div style={{ textAlign: "center", color: T }}>Zidly</div><div style={{ textAlign: "center" }}>Podium</div><div style={{ textAlign: "center" }}>Birdeye</div>
          </div>
          {COMPETITOR_TABLE.map((row, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", padding: "10px 16px", borderTop: "1px solid #E2E8F0", fontSize: 12, alignItems: "center" }}>
            <div style={{ fontWeight: 500 }}>{row[0]}</div>
            {[1,2,3].map(j => <div key={j} style={{ textAlign: "center", fontSize: typeof row[j] === "string" ? 11 : 14, fontWeight: typeof row[j] === "string" ? 700 : 400, color: row[j] === true ? "#22C55E" : row[j] === false ? "#EF4444" : j === 1 ? T : "#64748B" }}>
              {row[j] === true ? "✓" : row[j] === false ? "✕" : row[j]}
            </div>)}
          </div>)}
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 20 }}>What dental group operators say</h2>
        {TESTIMONIAL_QUOTES.map((q, i) => <div key={i} style={{ padding: 22, background: "#FAFBFC", borderRadius: 12, border: "1px solid #E2E8F0", marginBottom: 10, borderLeft: `4px solid ${T}` }}>
          <div style={{ fontSize: 14, color: TL, marginBottom: 6 }}>{"★".repeat(q.stars)}</div>
          <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, fontStyle: "italic", margin: "0 0 8px" }}>"{q.text}"</p>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0, fontWeight: 600 }}>— {q.role}</p>
        </div>)}
      </section>

      {/* How Deployment Works */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 20 }}>Deploy across all locations in one day</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }} className="gp-grid">
          {[
            { step: "1", time: "30 min", title: "Configure your first location", desc: "Run BizScorer, complete onboarding wizard, customize chatbot and review automation for location #1." },
            { step: "2", time: "5 min each", title: "Clone to all locations", desc: "One click copies the setup. Adjust location-specific details (address, hours, providers, insurance list) per site." },
            { step: "3", time: "Instant", title: "Activate everything", desc: "Chatbots go live, review automation starts, SEO monitoring begins. All locations, simultaneously." },
            { step: "4", time: "Day 7", title: "First consolidated report", desc: "See chatbot conversations, new reviews, and leads across every location in one dashboard. Share with your board." },
          ].map(s => <div key={s.step} style={{ padding: 18, background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", textAlign: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${T}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontWeight: 800, color: T, fontSize: 14 }}>{s.step}</div>
            <div style={{ fontSize: 10, color: T, fontWeight: 600, marginBottom: 4 }}>{s.time}</div>
            <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{s.title}</h3>
            <p style={{ fontSize: 11, color: "#64748B", lineHeight: 1.5 }}>{s.desc}</p>
          </div>)}
        </div>
      </section>

      {/* Enterprise Tier */}
      <section style={{ padding: 28, background: "#F8FAFC", borderRadius: 16, border: "1px solid #E2E8F0", marginBottom: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }} className="gp-grid">
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T, marginBottom: 8 }}>ENTERPRISE (50+ LOCATIONS)</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Need something custom?</h3>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, marginBottom: 16 }}>For groups with 50+ locations, we offer custom pricing, dedicated account management, custom PMS integrations (Dentrix, Open Dental, Eaglesoft), white-labeled dashboards, and priority support with guaranteed response times.</p>
            <button className="gp-btn">Contact Enterprise Sales →</button>
          </div>
          <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.8 }}>
            <div style={{ fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Enterprise includes:</div>
            {["Custom per-location pricing", "Dedicated account manager", "Custom onboarding for each location", "PMS integration (Dentrix, Open Dental, Eaglesoft)", "White-labeled dashboard option", "API access for data export", "Investor-ready reporting", "Priority support (4-hour response SLA)", "Custom chatbot training per specialty"].map(f =>
              <div key={f} style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ color: T }}>✓</span> {f}</div>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: 36, background: `linear-gradient(135deg, ${TD}08, ${TL}05)`, borderRadius: 16, textAlign: "center", marginBottom: 40 }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>Stop overpaying for per-location tools.</h2>
        <p style={{ fontSize: 15, color: "#64748B", marginBottom: 20 }}>One platform. One dashboard. One invoice. All locations. Deployed in one day.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="gp-btn" style={{ fontSize: 16, padding: "16px 36px" }}>Request Group Demo →</button>
          <a href="#calculator" style={{ display: "inline-flex", alignItems: "center", padding: "14px 28px", color: T, border: `2px solid ${T}`, borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", fontFamily: "inherit" }}>Calculate Savings ↑</a>
        </div>
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 14 }}>No contracts. No per-location setup fees. No 90-day cancellation windows. Cancel from your dashboard.</p>
      </section>
    </div>

    <footer style={{ padding: "20px 24px", borderTop: "1px solid #E2E8F0", textAlign: "center", fontSize: 12, color: "#94A3B8" }}>
      <a href="https://zidly.ai" style={{ color: T, textDecoration: "none", fontWeight: 600 }}>Zidly</a> — AI-powered growth for dental practices ·
      <a href="/dentists" style={{ color: "#94A3B8", textDecoration: "none" }}> Solo Practices</a> ·
      <a href="/groups" style={{ color: "#94A3B8", textDecoration: "none" }}> Groups & DSOs</a> ·
      <a href="/vs/podium" style={{ color: "#94A3B8", textDecoration: "none" }}> vs Podium</a> ·
      <a href="/pricing" style={{ color: "#94A3B8", textDecoration: "none" }}> Pricing</a>
    </footer>
  </div>;
}
