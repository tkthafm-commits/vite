import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useSEO from "./useSEO.js";
const T = "#0D9488", TD = "#0F766E", TL = "#14B8A6";
const SOLUTIONS = [
  { label: "Dental Practices", href: "/dentists", desc: "Solo practices, 1-4 locations" },
  { label: "Dental Groups & DSOs", href: "/groups", desc: "5-500+ locations, one dashboard" },
  { label: "Implant Dentists", href: "/implant-dentists", desc: "Capture $3K-50K cases 24/7" },
  { label: "Cosmetic Dentists", href: "/cosmetic-dentists", desc: "Win the visual comparison" },
  { label: "Invisalign Providers", href: "/invisalign-providers", desc: "Convert comparison shoppers" },
];
const TOOLS = [
  { label: "Dental Practice Audit", href: "/dental-bizscorer", desc: "Free 60-second revenue leak audit" },
  { label: "Public Rankings", href: "/rankings", desc: "See how practices rank in your city" },
  { label: "Free Tools", href: "#freetools", desc: "Review link gen, QR codes, email sig" },
];
const COMPARE = [
  { label: "vs Podium", href: "/vs/podium" }, { label: "vs Birdeye", href: "/vs/birdeye" },
  { label: "vs Thryv", href: "/vs/thryv" }, { label: "vs Broadly", href: "/vs/broadly" },
  { label: "vs Weave", href: "/vs/weave" }, { label: "vs NiceJob", href: "/vs/nicejob" },
  { label: "vs GatherUp", href: "/vs/gatherup" }, { label: "vs BrightLocal", href: "/vs/brightlocal" },
  { label: "Switch Guide", href: "/switch" },
];
const LEAKS = [
  { icon: "🌙", name: "After-Hours Lost Patients", cost: "$2K-8K/mo", fix: "AI assistant answers at 10pm" },
  { icon: "⭐", name: "Review Gap vs Competitors", cost: "$1K-5K/mo", fix: "Automated review collection" },
  { icon: "🚫", name: "No-Shows & Cancellations", cost: "$3K-6K/mo", fix: "Smart reminders cut no-shows 50%" },
  { icon: "📋", name: "Unaccepted Treatment Plans", cost: "$5K-20K/mo", fix: "Follow-up recovers 20% of cases" },
  { icon: "📉", name: "Lapsed Patient Recalls", cost: "$2K-10K/mo", fix: "Reactivation brings patients back" },
];
const ENGINES = [
  { icon: "🤖", name: "AI Patient Assistant", desc: "Answers insurance, pricing, procedures 24/7. Trained on YOUR practice. Captures inquiries while you sleep." },
  { icon: "⭐", name: "Reputation Shield", desc: "Automated review requests. Smart routing. AI responses. Negative review SMS alerts." },
  { icon: "🔍", name: "Practice SEO & AI Visibility", desc: "Schema markup, rank tracking, 20+ checks. AI Visibility scoring for Google Gemini." },
  { icon: "📱", name: "Patient Content Engine", desc: "AI social posts, blog articles, email campaigns. Education content that ranks on Google." },
  { icon: "🎯", name: "Competitive Intelligence", desc: "Track competitor reviews, ratings, activity. Find weaknesses. Win their patients." },
  { icon: "📊", name: "Command Center", desc: "Revenue leak dashboard. BizScorer. Lead inbox. Production impact. Dollars, not vanity." },
];
const VERTICALS = [
  { icon: "🦷", label: "General Dentistry", on: true },
  { icon: "🔩", label: "Implant Dentists", on: true },
  { icon: "✨", label: "Cosmetic Dentists", on: true },
  { icon: "😁", label: "Invisalign Providers", on: true },
  { icon: "🏢", label: "Groups & DSOs", on: true },
  { icon: "💆", label: "Med Spas", on: false },
  { icon: "🔧", label: "Home Services", on: false },
  { icon: "⚖️", label: "Law Firms", on: false },
];
const PLANS = [
  { name: "Core", sub: "Get Found", price: 97, pop: false, features: ["AI Patient Assistant (24/7)", "Reputation Shield", "BizScorer Audit", "Lead Inbox", "Schema Generator", "QR Review Kit"] },
  { name: "Plus", sub: "Get Patients", price: 197, pop: true, features: ["Everything in Core", "Content Engine", "Ad Studio", "Revenue Radar", "Maps Rank Tracker", "Patient Reactivation"] },
  { name: "Pro", sub: "Get Efficient", price: 347, pop: false, features: ["Everything in Plus", "Competitor Deep Analysis", "Health Dashboard", "Case Follow-Up", "Proposal Studio", "Remove branding"] },
  { name: "Elite", sub: "Get Ahead", price: 697, pop: false, features: ["Everything in Pro", "Crisis Intelligence", "Strategy Simulator", "Staff Planner", "Priority Support", "Custom Integrations"] },
];
const COMP_NAMES = ["Podium", "Birdeye", "Thryv", "Broadly", "Weave", "NiceJob", "GatherUp", "BrightLocal"];

function NavLink({ href, children, ...props }) {
  if (href.startsWith("#")) return <a href={href} {...props}>{children}</a>;
  return <Link to={href} {...props}>{children}</Link>;
}

function DropMenu({ label, items, isOpen, onToggle, light }) {
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={e => { e.stopPropagation(); onToggle(); }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        style={{ background: "none", border: "none", color: light ? "#374151" : "#D1D5DB", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", padding: "6px 0", display: "flex", alignItems: "center", gap: 4 }}
      >
        {label} <span style={{ fontSize: 9, opacity: 0.5 }} aria-hidden="true">▼</span>
      </button>
      {isOpen && (
        <div
          role="menu"
          onClick={e => e.stopPropagation()}
          style={{ position: "absolute", top: "calc(100% + 8px)", left: -8, background: "#fff", borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", border: "1px solid #E2E8F0", padding: 8, minWidth: 250, zIndex: 200 }}
        >
          {items.map(it => (
            <NavLink
              key={it.label}
              href={it.href}
              role="menuitem"
              style={{ display: "block", padding: "9px 12px", borderRadius: 8, textDecoration: "none", color: "#0F172A" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F0FDFA"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ fontSize: 13, fontWeight: 600 }}>{it.label}</div>
              {it.desc && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{it.desc}</div>}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
export default function ZidlyHomepage() {
  useSEO({
    title: "AI Growth Platform for Dental Practices",
    description: "Zidly's AI answers insurance questions, captures patient inquiries, collects reviews, and tracks competitors 24/7. Replace Podium + Birdeye + BrightLocal for $97/month.",
    canonical: "/",
  });
  const [scan, setScan] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    const h = () => setOpenMenu(null);
    if (openMenu) window.addEventListener("click", h);
    return () => window.removeEventListener("click", h);
  }, [openMenu]);
  const navBg = scrollY > 50;
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "#0F172A", background: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .zb { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${TD}, ${TL}); color: #fff; border: none; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; text-decoration: none; transition: all 0.2s; }
        .zb:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(13,148,136,0.35); }
        .zo { display: inline-block; padding: 14px 32px; background: transparent; color: ${T}; border: 2px solid ${T}; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; text-decoration: none; transition: all 0.15s; }
        .zo:hover { background: ${T}; color: #fff; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .anim { animation: fadeUp 0.6s ease both; }
        .anim-d1 { animation-delay: 0.1s; }
        .anim-d2 { animation-delay: 0.2s; }
        .anim-d3 { animation-delay: 0.3s; }
        @media (max-width: 768px) {
          .g2 { grid-template-columns: 1fr !important; }
          .g3 { grid-template-columns: 1fr !important; }
          .g4 { grid-template-columns: 1fr 1fr !important; }
          .g5 { grid-template-columns: 1fr !important; }
          .hero-h { font-size: 32px !important; }
          .desk-nav { display: none !important; }
          .mob-btn { display: block !important; }
        }
      `}</style>

      {/* === NAV === */}
      <header>
        <nav aria-label="Main navigation" style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: navBg ? "rgba(255,255,255,0.97)" : "transparent",
          backdropFilter: navBg ? "blur(14px)" : "none",
          borderBottom: navBg ? "1px solid #E2E8F0" : "none",
          transition: "all 0.3s", padding: "12px 24px"
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link to="/" aria-label="Zidly homepage" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${T},${TL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 15 }} aria-hidden="true">Z</div>
              <span style={{ fontWeight: 800, fontSize: 19, color: navBg ? "#0F172A" : "#fff", letterSpacing: -0.5, transition: "color 0.3s" }}>Zidly</span>
            </Link>
            <div className="desk-nav" style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <DropMenu label="Solutions" items={SOLUTIONS} isOpen={openMenu === "sol"} onToggle={() => setOpenMenu(openMenu === "sol" ? null : "sol")} light={navBg} />
              <DropMenu label="Free Tools" items={TOOLS} isOpen={openMenu === "tools"} onToggle={() => setOpenMenu(openMenu === "tools" ? null : "tools")} light={navBg} />
              <DropMenu label="Compare" items={COMPARE} isOpen={openMenu === "cmp"} onToggle={() => setOpenMenu(openMenu === "cmp" ? null : "cmp")} light={navBg} />
              <a href="#pricing" style={{ color: navBg ? "#374151" : "#D1D5DB", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Pricing</a>
              <Link to="/dental-bizscorer" className="zb" style={{ padding: "9px 18px", fontSize: 13 }}>Free Audit →</Link>
            </div>
            <button className="mob-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle mobile menu" aria-expanded={mobileOpen} style={{ display: "none", background: "none", border: "none", color: navBg ? "#0F172A" : "#fff", fontSize: 22, cursor: "pointer" }}>
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
          {mobileOpen && (
            <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0", padding: "16px 24px", maxHeight: "70vh", overflowY: "auto" }}>
              {[["Solutions", SOLUTIONS], ["Free Tools", TOOLS], ["Compare", COMPARE]].map(([title, items]) => (
                <div key={title} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: 6, letterSpacing: 1 }}>{title}</div>
                  {items.map(it => (
                    <NavLink key={it.label} href={it.href} onClick={() => setMobileOpen(false)} style={{ display: "block", padding: "7px 0", color: "#0F172A", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{it.label}</NavLink>
                  ))}
                </div>
              ))}
              <Link to="/dental-bizscorer" className="zb" style={{ width: "100%", textAlign: "center", marginTop: 8, display: "block" }}>Free Practice Audit →</Link>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* === HERO === */}
        <section style={{
          background: "linear-gradient(165deg, #042F2E 0%, #0F172A 50%, #1E293B 100%)",
          padding: "140px 24px 80px", position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T}15, transparent 70%)` }} aria-hidden="true" />
          <div style={{ position: "absolute", bottom: -200, left: -100, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${TL}08, transparent 70%)` }} aria-hidden="true" />
          <div style={{ maxWidth: 740, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <div className="anim" style={{ display: "inline-block", padding: "6px 18px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, fontSize: 13, color: TL, fontWeight: 600, marginBottom: 22 }}>
              The AI That Watches Your Practice While You Sleep
            </div>
            <h1 className="hero-h anim anim-d1" style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.08, letterSpacing: -2, color: "#fff", marginBottom: 20 }}>
              Your practice is leaking<br />
              <span style={{ color: TL }}>$10,000+/month</span><br />
              in lost patients
            </h1>
            <p className="anim anim-d2" style={{ fontSize: 17, color: "#94A3B8", lineHeight: 1.65, maxWidth: 560, margin: "0 auto 32px" }}>
              97% of patients research you online before scheduling. After 5pm, your website is silent.
              Zidly's AI answers insurance questions, captures new patient inquiries, collects reviews,
              and tracks competitors — 24/7. For $97/month.
            </p>
            <div className="anim anim-d3" style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 22,
              maxWidth: 480, margin: "0 auto", border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                See how much production your practice is losing — free
              </p>
              <form onSubmit={e => e.preventDefault()} style={{ display: "flex", gap: 8 }} role="search" aria-label="Practice audit search">
                <label htmlFor="scan-input" className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>Your practice name or website</label>
                <input
                  id="scan-input"
                  value={scan} onChange={e => setScan(e.target.value)}
                  placeholder="Your practice name or website..."
                  style={{
                    flex: 1, padding: "12px 16px", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    fontSize: 14, fontFamily: "inherit", outline: "none", color: "#fff"
                  }}
                />
                <button className="zb" style={{ padding: "12px 20px", fontSize: 13, whiteSpace: "nowrap" }}>
                  Scan Free →
                </button>
              </form>
              <p style={{ fontSize: 11, color: "#64748B", marginTop: 8 }}>
                No signup. Scans reviews, website, competitors, and 20 dental-specific factors.
              </p>
            </div>
          </div>
        </section>

        {/* === PROOF BAR === */}
        <section aria-label="Key statistics" style={{ padding: "26px 24px", borderBottom: "1px solid #E2E8F0" }}>
          <div className="g4" style={{ maxWidth: 880, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, textAlign: "center" }}>
            {[
              { s: "97%", l: "of patients research you online first" },
              { s: "25%", l: "of patient calls missed daily" },
              { s: "$4,200", l: "lifetime production per patient" },
              { s: "107x", l: "average ROI on $97/month" },
            ].map(x => (
              <div key={x.l}>
                <div style={{ fontSize: 24, fontWeight: 900, color: T }}>{x.s}</div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{x.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* === REVENUE LEAKS === */}
        <section aria-labelledby="leaks-heading" style={{ padding: "68px 24px", background: "#FAFBFC" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <h2 id="leaks-heading" style={{ fontSize: 32, fontWeight: 900, textAlign: "center", letterSpacing: -1, marginBottom: 8 }}>
              5 revenue leaks costing your practice<br />
              <span style={{ color: "#DC2626" }}>$10,000-30,000/month</span>
            </h2>
            <p style={{ textAlign: "center", fontSize: 14, color: "#64748B", marginBottom: 28 }}>
              Each leak maps to a Zidly tool that plugs it.
            </p>
            <ul style={{ listStyle: "none" }}>
              {LEAKS.map((l, i) => (
                <li key={i} style={{
                  display: "flex", gap: 14, alignItems: "center", padding: "14px 18px",
                  background: "#fff", borderRadius: 10, border: "1px solid #E2E8F0", marginBottom: 6
                }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }} aria-hidden="true">{l.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{l.name}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{l.fix}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#DC2626", whiteSpace: "nowrap" }}>{l.cost}</div>
                </li>
              ))}
            </ul>
            <div style={{ textAlign: "center", marginTop: 18 }}>
              <Link to="/dental-bizscorer" className="zb">Free Practice Audit →</Link>
            </div>
          </div>
        </section>

        {/* === 6 ENGINES === */}
        <section aria-labelledby="engines-heading" style={{ padding: "68px 24px" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2 id="engines-heading" style={{ fontSize: 32, fontWeight: 900, textAlign: "center", letterSpacing: -1, marginBottom: 8 }}>
              6 AI engines. One platform.<br />
              Replaces Podium + Birdeye + BrightLocal.
            </h2>
            <p style={{ textAlign: "center", fontSize: 14, color: "#64748B", marginBottom: 32 }}>
              Practices pay $500-1,500/mo for 3-4 tools. Zidly does it all for $97/month.
            </p>
            <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {ENGINES.map(e => (
                <article key={e.name} style={{
                  padding: 20, background: "#fff", borderRadius: 12,
                  border: "1px solid #E2E8F0", transition: "border-color 0.15s"
                }}
                  onMouseEnter={ev => { ev.currentTarget.style.borderColor = T; }}
                  onMouseLeave={ev => { ev.currentTarget.style.borderColor = "#E2E8F0"; }}
                >
                  <div style={{ fontSize: 26, marginBottom: 8 }} aria-hidden="true">{e.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{e.name}</h3>
                  <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{e.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* === VERTICALS === */}
        <section aria-labelledby="verticals-heading" style={{ padding: "68px 24px", background: "#0F172A" }}>
          <div style={{ maxWidth: 880, margin: "0 auto" }}>
            <h2 id="verticals-heading" style={{ fontSize: 28, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 28 }}>
              Built for dental. Expanding everywhere.
            </h2>
            <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {VERTICALS.map(v => (
                <div key={v.label} style={{
                  padding: 16, background: "#1E293B", borderRadius: 10,
                  border: "1px solid #334155", textAlign: "center",
                  opacity: v.on ? 1 : 0.45
                }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }} aria-hidden="true">{v.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: v.on ? "#fff" : "#64748B" }}>{v.label}</div>
                  {!v.on && <div style={{ fontSize: 9, color: "#64748B" }}>Soon</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === COMPARISON TABLE === */}
        <section aria-labelledby="compare-heading" style={{ padding: "68px 24px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 id="compare-heading" style={{ fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 24 }}>
              Same reviews. 30 more tools. 1/3 the price.
            </h2>
            <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }} role="table" aria-label="Feature comparison: Zidly vs Podium vs Birdeye">
              <div role="row" style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 70px", padding: "10px 14px", background: "#F8FAFC", fontWeight: 700, fontSize: 11, color: "#64748B" }}>
                <div role="columnheader">Feature</div>
                <div role="columnheader" style={{ textAlign: "center", color: T }}>Zidly</div>
                <div role="columnheader" style={{ textAlign: "center" }}>Podium</div>
                <div role="columnheader" style={{ textAlign: "center" }}>Birdeye</div>
              </div>
              {[
                ["AI Patient Assistant", true, false, false],
                ["Review Management", true, true, true],
                ["SEO + AI Visibility", true, false, false],
                ["Content Engine", true, false, false],
                ["Competitor Tracking", true, false, true],
                ["Revenue Leak Dashboard", true, false, false],
                ["No Contracts", true, false, false],
                ["Price", "$97/mo", "$249/mo", "$299/mo"],
              ].map(([feat, z, p, b], i) => (
                <div role="row" key={i} style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 70px", padding: "9px 14px", borderTop: "1px solid #E2E8F0", fontSize: 12, alignItems: "center" }}>
                  <div role="rowheader" style={{ fontWeight: 500 }}>{feat}</div>
                  {[z, p, b].map((v, j) => (
                    <div role="cell" key={j} style={{
                      textAlign: "center",
                      color: v === true ? "#22C55E" : typeof v === "string" ? (j === 0 ? T : "#64748B") : "#EF4444",
                      fontWeight: typeof v === "string" ? 700 : 400,
                      fontSize: typeof v === "string" ? 11 : 14
                    }} aria-label={v === true ? "Yes" : v === false ? "No" : v}>
                      {v === true ? "✓" : v === false ? "✕" : v}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <nav aria-label="Competitor comparisons" style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginTop: 16 }}>
              {COMP_NAMES.map(c => (
                <Link key={c} to={`/vs/${c.toLowerCase()}`} style={{ padding: "5px 12px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 10, color: "#64748B", fontWeight: 500, textDecoration: "none" }}>
                  vs {c}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {/* === PRICING === */}
        <section id="pricing" aria-labelledby="pricing-heading" style={{ padding: "68px 24px", background: "#0F172A" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <h2 id="pricing-heading" style={{ fontSize: 28, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 6 }}>
              Transparent pricing. No surprises.
            </h2>
            <p style={{ textAlign: "center", fontSize: 13, color: "#94A3B8", marginBottom: 6 }}>
              Average practice spends $5K-8K/mo on marketing. One implant click costs $15-25. Zidly is less than 4 clicks.
            </p>
            <p style={{ textAlign: "center", fontSize: 12, color: "#64748B", marginBottom: 28 }}>
              Month-to-month. Annual saves 2 months. Multi-location discounts available.
            </p>
            <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, alignItems: "start" }}>
              {PLANS.map(p => (
                <article key={p.name} style={{
                  background: p.pop ? `linear-gradient(135deg, ${TD}, ${TL})` : "#1E293B",
                  borderRadius: 14, padding: 22, position: "relative",
                  border: p.pop ? "none" : "1px solid #334155"
                }}>
                  {p.pop && (
                    <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)", background: "#fff", color: T, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 10 }}>
                      MOST POPULAR
                    </div>
                  )}
                  <h3 style={{ fontSize: 12, fontWeight: 600, color: p.pop ? "rgba(255,255,255,0.8)" : "#94A3B8" }}>{p.name}</h3>
                  <div style={{ fontSize: 10, color: p.pop ? "rgba(255,255,255,0.5)" : "#64748B", marginBottom: 6 }}>{p.sub}</div>
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 30, fontWeight: 900, color: "#fff" }}>${p.price}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>/mo</span>
                  </div>
                  <ul style={{ listStyle: "none" }}>
                    {p.features.map(f => (
                      <li key={f} style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", padding: "3px 0", display: "flex", gap: 5, alignItems: "center" }}>
                        <span style={{ color: TL, fontSize: 10 }} aria-hidden="true">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button className="zb" style={{
                    width: "100%", marginTop: 14, padding: 11, fontSize: 12,
                    background: p.pop ? "#fff" : `linear-gradient(135deg, ${TD}, ${TL})`,
                    color: p.pop ? T : "#fff"
                  }}>
                    Start Free Trial
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* === FINAL CTA === */}
        <section aria-labelledby="cta-heading" style={{ padding: "68px 24px", textAlign: "center", background: `linear-gradient(135deg, ${TD}06, ${TL}03)` }}>
          <h2 id="cta-heading" style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>
            Stop losing patients tonight.
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", marginBottom: 24 }}>
            One implant case captured pays for 3 years of Zidly. The math isn't close.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/dental-bizscorer" className="zb" style={{ fontSize: 16, padding: "16px 36px" }}>Free Practice Audit →</Link>
            <a href="#pricing" className="zo" style={{ fontSize: 16, padding: "16px 36px" }}>See Pricing</a>
          </div>
        </section>
      </main>

      {/* === FOOTER === */}
      <footer style={{ background: "#0F172A", padding: "44px 24px 20px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div className="g5" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: 20, marginBottom: 28 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: `linear-gradient(135deg, ${T}, ${TL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 12 }} aria-hidden="true">Z</div>
                <span style={{ fontWeight: 800, fontSize: 17, color: "#fff" }}>Zidly</span>
              </div>
              <p style={{ fontSize: 11, color: "#64748B", lineHeight: 1.6 }}>
                AI-powered practice growth. The AI that watches your practice while you sleep.
              </p>
            </div>
            <nav aria-label="Solutions">
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", marginBottom: 10, letterSpacing: 1 }}>SOLUTIONS</div>
              {[
                { label: "Dental Practices", to: "/dentists" },
                { label: "Groups & DSOs", to: "/groups" },
                { label: "Implant", to: "/implant-dentists" },
                { label: "Cosmetic", to: "/cosmetic-dentists" },
                { label: "Invisalign", to: "/invisalign-providers" },
              ].map(l => (
                <Link key={l.label} to={l.to} style={{ display: "block", fontSize: 12, color: "#64748B", padding: "2px 0", textDecoration: "none" }}>{l.label}</Link>
              ))}
            </nav>
            <nav aria-label="Free tools">
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", marginBottom: 10, letterSpacing: 1 }}>FREE TOOLS</div>
              <Link to="/dental-bizscorer" style={{ display: "block", fontSize: 12, color: "#64748B", padding: "2px 0", textDecoration: "none" }}>Practice Audit</Link>
              <Link to="/rankings" style={{ display: "block", fontSize: 12, color: "#64748B", padding: "2px 0", textDecoration: "none" }}>Rankings</Link>
            </nav>
            <nav aria-label="Comparisons">
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", marginBottom: 10, letterSpacing: 1 }}>COMPARE</div>
              {[
                { label: "vs Podium", to: "/vs/podium" },
                { label: "vs Birdeye", to: "/vs/birdeye" },
                { label: "vs Thryv", to: "/vs/thryv" },
                { label: "vs Weave", to: "/vs/weave" },
                { label: "vs BrightLocal", to: "/vs/brightlocal" },
                { label: "Switch Guide", to: "/switch" },
              ].map(l => (
                <Link key={l.label} to={l.to} style={{ display: "block", fontSize: 12, color: "#64748B", padding: "2px 0", textDecoration: "none" }}>{l.label}</Link>
              ))}
            </nav>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", marginBottom: 10, letterSpacing: 1 }}>COMPANY</div>
              <a href="#pricing" style={{ display: "block", fontSize: 12, color: "#64748B", padding: "2px 0", textDecoration: "none" }}>Pricing</a>
              <div style={{ fontSize: 12, color: "#64748B", padding: "2px 0" }}>Privacy</div>
              <div style={{ fontSize: 12, color: "#64748B", padding: "2px 0" }}>Terms</div>
              <a href="mailto:alaa@zidly.ai" style={{ display: "block", fontSize: 12, color: "#64748B", padding: "2px 0", textDecoration: "none" }}>alaa@zidly.ai</a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1E293B", paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <p style={{ fontSize: 10, color: "#475569" }}>© 2026 Zidly. AI-powered practice growth.</p>
            <p style={{ fontSize: 10, color: "#475569" }}>Built in Cairo. Serving practices worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
