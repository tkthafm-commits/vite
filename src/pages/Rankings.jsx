import { useState, useEffect } from "react";

// Public BizScorer Rankings — zidly.ai/rankings/{vertical}/{city-state}
// Individual profiles — zidly.ai/score/{city-state}/{business-slug}
// Data: pulled from Supabase scan_results table
const T = "#0D9488", TD = "#0F766E", TL = "#14B8A6";

// In production: data comes from Supabase via getServerSideProps or API route
// In demo: static sample data
const DEMO_RANKINGS = [
  { rank: 1, name: "Valley Dental Care", slug: "valley-dental-care", score: 91, grade: "A", reviews: 142, rating: 4.8, change: 3, dims: { reputation: 95, findability: 88, conversion: 92, marketing: 85, aiVisibility: 78, competitive: 94 } },
  { rank: 2, name: "Smile Center of Phoenix", slug: "smile-center-phoenix", score: 87, grade: "A", reviews: 98, rating: 4.7, change: 0, dims: { reputation: 88, findability: 85, conversion: 90, marketing: 82, aiVisibility: 72, competitive: 88 } },
  { rank: 3, name: "Desert Ridge Family Dentistry", slug: "desert-ridge-family", score: 83, grade: "A", reviews: 127, rating: 4.6, change: 5, dims: { reputation: 90, findability: 78, conversion: 85, marketing: 75, aiVisibility: 65, competitive: 82 } },
  { rank: 4, name: "Arcadia Modern Dental", slug: "arcadia-modern-dental", score: 79, grade: "B+", reviews: 76, rating: 4.5, change: -2, dims: { reputation: 80, findability: 82, conversion: 78, marketing: 70, aiVisibility: 68, competitive: 75 } },
  { rank: 5, name: "Scottsdale Premium Dental", slug: "scottsdale-premium", score: 74, grade: "B+", reviews: 89, rating: 4.7, change: 1, dims: { reputation: 85, findability: 70, conversion: 72, marketing: 65, aiVisibility: 55, competitive: 78 } },
  { rank: 6, name: "Central Ave Dental Group", slug: "central-ave-dental", score: 68, grade: "B", reviews: 54, rating: 4.4, change: 0, dims: { reputation: 72, findability: 65, conversion: 70, marketing: 60, aiVisibility: 48, competitive: 65 } },
  { rank: 7, name: "Tempe Family Dental", slug: "tempe-family-dental", score: 61, grade: "B", reviews: 41, rating: 4.3, change: -3, dims: { reputation: 65, findability: 60, conversion: 62, marketing: 55, aiVisibility: 42, competitive: 60 } },
  { rank: 8, name: "Mesa Smile Studio", slug: "mesa-smile-studio", score: 52, grade: "C+", reviews: 28, rating: 4.2, change: 0, dims: { reputation: 55, findability: 50, conversion: 55, marketing: 45, aiVisibility: 35, competitive: 50 } },
  { rank: 9, name: "Gilbert Dental Associates", slug: "gilbert-dental", score: 44, grade: "C", reviews: 19, rating: 4.0, change: -1, dims: { reputation: 45, findability: 42, conversion: 48, marketing: 38, aiVisibility: 28, competitive: 42 } },
  { rank: 10, name: "Chandler Quick Dental", slug: "chandler-quick-dental", score: 38, grade: "D", reviews: 12, rating: 3.8, change: -4, dims: { reputation: 35, findability: 38, conversion: 42, marketing: 30, aiVisibility: 20, competitive: 35 } },
];

const DEMO_CITY = "Phoenix, AZ";
const DEMO_VERTICAL = "Dentists";
const DEMO_TOTAL = 113;

function scoreColor(s) { return s >= 70 ? "#22C55E" : s >= 50 ? "#EAB308" : "#EF4444"; }
function gradeBg(g) { return g.startsWith("A") ? "#22C55E" : g.startsWith("B") ? "#3B82F6" : g.startsWith("C") ? "#EAB308" : "#EF4444"; }
function medalEmoji(rank) { return rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : ""; }

// ===== PAGE TYPE B: City Leaderboard =====
function CityLeaderboard() {
  const [scanUrl, setScanUrl] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? DEMO_RANKINGS
    : filter === "top10" ? DEMO_RANKINGS.filter(b => b.score >= 70)
    : filter === "needs-work" ? DEMO_RANKINGS.filter(b => b.score < 50)
    : DEMO_RANKINGS;

  const avgScore = Math.round(DEMO_RANKINGS.reduce((s, b) => s + b.score, 0) / DEMO_RANKINGS.length);

  return <div>
    {/* Hero */}
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <div style={{ display: "inline-block", padding: "5px 14px", background: `${T}10`, borderRadius: 16, fontSize: 12, color: T, fontWeight: 600, marginBottom: 12 }}>BizScorer Rankings — Updated March 2026</div>
      <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, margin: "0 0 8px" }}>Best {DEMO_VERTICAL} in {DEMO_CITY}</h1>
      <p style={{ fontSize: 14, color: "#64748B" }}>{DEMO_TOTAL} practices scanned · Average score: {avgScore}/100</p>
    </div>

    {/* Scan CTA */}
    <div style={{ background: `${T}06`, borderRadius: 14, padding: 20, marginBottom: 24, border: `1px solid ${T}18` }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 10, textAlign: "center" }}>Is your practice missing? Scan it free.</p>
      <div style={{ display: "flex", gap: 8, maxWidth: 420, margin: "0 auto" }}>
        <input value={scanUrl} onChange={e => setScanUrl(e.target.value)} placeholder="Enter your practice website..." style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
        <button style={{ padding: "10px 18px", background: `linear-gradient(135deg,${TD},${TL})`, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Scan →</button>
      </div>
    </div>

    {/* Filters */}
    <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
      {[["all","All"],["top10","Top Performers"],["needs-work","Needs Work"]].map(([k,l]) =>
        <button key={k} onClick={() => setFilter(k)} style={{ padding: "6px 14px", background: filter === k ? T : "transparent", color: filter === k ? "#fff" : "#64748B", border: `1.5px solid ${filter === k ? T : "#E2E8F0"}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
      )}
    </div>

    {/* Rankings Table */}
    <div style={{ borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "50px 1fr 70px 60px 70px 60px", padding: "12px 16px", background: "#F8FAFC", fontWeight: 700, fontSize: 11, color: "#64748B", gap: 8 }}>
        <div>#</div><div>Practice</div><div style={{ textAlign: "right" }}>Score</div><div style={{ textAlign: "right" }}>Grade</div><div style={{ textAlign: "right" }}>Reviews</div><div style={{ textAlign: "right" }}>Trend</div>
      </div>
      {filtered.map((b, i) => <div key={b.slug} style={{ display: "grid", gridTemplateColumns: "50px 1fr 70px 60px 70px 60px", padding: "14px 16px", borderTop: "1px solid #E2E8F0", alignItems: "center", gap: 8, cursor: "pointer", background: b.rank <= 3 ? `${T}04` : "#fff" }}
        onMouseEnter={e => e.currentTarget.style.background = `${T}08`} onMouseLeave={e => e.currentTarget.style.background = b.rank <= 3 ? `${T}04` : "#fff"}>
        <div style={{ fontWeight: 800, color: b.rank <= 3 ? T : "#0F172A", fontSize: 15 }}>{medalEmoji(b.rank)} {b.rank}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{b.name}</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>{"★".repeat(Math.round(b.rating))} {b.rating}</div>
        </div>
        <div style={{ textAlign: "right", fontWeight: 800, fontSize: 16, color: scoreColor(b.score) }}>{b.score}</div>
        <div style={{ textAlign: "right" }}>
          <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, background: `${gradeBg(b.grade)}15`, color: gradeBg(b.grade), fontWeight: 700, fontSize: 12 }}>{b.grade}</span>
        </div>
        <div style={{ textAlign: "right", fontSize: 13, color: "#64748B" }}>{b.reviews}</div>
        <div style={{ textAlign: "right", fontSize: 13, fontWeight: 600, color: b.change > 0 ? "#22C55E" : b.change < 0 ? "#EF4444" : "#94A3B8" }}>
          {b.change > 0 ? `↑${b.change}` : b.change < 0 ? `↓${Math.abs(b.change)}` : "—"}
        </div>
      </div>)}
    </div>

    <p style={{ textAlign: "center", fontSize: 12, color: "#94A3B8", marginTop: 16 }}>
      Showing {filtered.length} of {DEMO_TOTAL} practices · Scores based on reviews, SEO, AI visibility, and competitive position ·
      <a href="#" style={{ color: T, textDecoration: "none", fontWeight: 600 }}> Remove my business</a>
    </p>

    {/* Bottom CTA */}
    <div style={{ marginTop: 32, padding: 28, background: "#0F172A", borderRadius: 14, textAlign: "center" }}>
      <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Want to improve your ranking?</h3>
      <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 16 }}>Zidly fixes every weakness in your BizScore — AI chatbot, review automation, SEO tools, and more. $97/mo, no contract.</p>
      <button style={{ padding: "14px 32px", background: `linear-gradient(135deg,${TD},${TL})`, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>See How Zidly Helps →</button>
    </div>
  </div>;
}

// ===== PAGE TYPE A: Individual Business Profile =====
function BusinessProfile() {
  const biz = DEMO_RANKINGS[6]; // Demo: #7 Tempe Family Dental
  if (!biz) return null;

  return <div>
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 90, height: 90, borderRadius: "50%", background: `${gradeBg(biz.grade)}12`, border: `4px solid ${gradeBg(biz.grade)}`, marginBottom: 10 }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: gradeBg(biz.grade) }}>{biz.grade}</span>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 4px" }}>{biz.name}</h1>
      <p style={{ fontSize: 14, color: "#64748B" }}>{biz.score}/100 · #{biz.rank} of {DEMO_TOTAL} {DEMO_VERTICAL.toLowerCase()} in {DEMO_CITY}</p>
      <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{"★".repeat(Math.round(biz.rating))} {biz.rating} · {biz.reviews} Google reviews · Last scanned: March 2026</p>
    </div>

    {/* 6 Dimension Bars */}
    {[["⭐","Reputation",biz.dims.reputation],["🔍","Findability",biz.dims.findability],["🎯","Conversion",biz.dims.conversion],["📱","Marketing",biz.dims.marketing],["🤖","AI Visibility",biz.dims.aiVisibility],["🏆","Competitive",biz.dims.competitive]].map(([icon,label,score]) =>
      <div key={label} style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
          <span style={{ fontSize: 13 }}>{icon} <strong>{label}</strong></span>
          <span style={{ fontSize: 14, fontWeight: 800, color: scoreColor(score) }}>{score}</span>
        </div>
        <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${score}%`, background: `linear-gradient(90deg,${scoreColor(score)}CC,${scoreColor(score)})`, borderRadius: 4 }} />
        </div>
      </div>
    )}

    {/* Strengths / Weaknesses */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
      <div style={{ padding: 16, background: "#F0FDF4", borderRadius: 10, border: "1px solid #BBF7D0" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 8 }}>Strengths</p>
        {Object.entries(biz.dims).filter(([,v]) => v >= 60).map(([k,v]) =>
          <div key={k} style={{ fontSize: 12, color: "#15803D", padding: "3px 0" }}>✓ {k.replace(/([A-Z])/g, ' $1').trim()} ({v})</div>
        )}
      </div>
      <div style={{ padding: 16, background: "#FEF2F2", borderRadius: 10, border: "1px solid #FECACA" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#991B1B", marginBottom: 8 }}>Needs Improvement</p>
        {Object.entries(biz.dims).filter(([,v]) => v < 60).map(([k,v]) =>
          <div key={k} style={{ fontSize: 12, color: "#B91C1C", padding: "3px 0" }}>✕ {k.replace(/([A-Z])/g, ' $1').trim()} ({v})</div>
        )}
      </div>
    </div>

    {/* Claim CTA */}
    <div style={{ marginTop: 24, padding: 24, background: `${T}06`, borderRadius: 14, border: `1px solid ${T}18`, textAlign: "center" }}>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Is this your business?</h3>
      <p style={{ fontSize: 13, color: "#64748B", marginBottom: 16 }}>Claim your profile to see the full report, fix your weaknesses, and improve your ranking.</p>
      <button style={{ padding: "12px 28px", background: `linear-gradient(135deg,${TD},${TL})`, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Claim & Improve →</button>
    </div>

    <p style={{ textAlign: "center", fontSize: 11, color: "#94A3B8", marginTop: 16 }}>
      Scores based on publicly available data (Google reviews, website analysis). ·
      <a href="#" style={{ color: T, textDecoration: "none" }}> Remove this page</a>
    </p>
  </div>;
}

// ===== MAIN COMPONENT (shows both page types) =====
export default function PublicRankings() {
  const [view, setView] = useState("leaderboard");

  return <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: "#0F172A", background: "#fff", minHeight: "100vh" }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } @media (max-width: 768px) { .rk-grid { grid-template-columns: 1fr !important; } }`}</style>

    {/* Nav */}
    <nav style={{ padding: "14px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg,${T},${TL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 13 }}>Z</div>
        <span style={{ fontWeight: 800, fontSize: 16 }}>Zidly</span>
        <span style={{ fontSize: 11, color: "#94A3B8" }}>BizScorer Rankings</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setView("leaderboard")} style={{ padding: "6px 14px", background: view === "leaderboard" ? T : "transparent", color: view === "leaderboard" ? "#fff" : "#64748B", border: `1px solid ${view === "leaderboard" ? T : "#E2E8F0"}`, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>City Rankings</button>
        <button onClick={() => setView("profile")} style={{ padding: "6px 14px", background: view === "profile" ? T : "transparent", color: view === "profile" ? "#fff" : "#64748B", border: `1px solid ${view === "profile" ? T : "#E2E8F0"}`, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Business Profile</button>
      </div>
    </nav>

    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      {view === "leaderboard" ? <CityLeaderboard /> : <BusinessProfile />}
    </div>

    <footer style={{ padding: "20px 24px", borderTop: "1px solid #E2E8F0", textAlign: "center", fontSize: 12, color: "#94A3B8" }}>
      Powered by <a href="https://zidly.ai" style={{ color: T, textDecoration: "none", fontWeight: 600 }}>Zidly BizScorer</a> · Scores based on publicly available data · <a href="#" style={{ color: "#64748B", textDecoration: "none" }}>Privacy</a> · <a href="#" style={{ color: "#64748B", textDecoration: "none" }}>Remove Business</a>
    </footer>
  </div>;
}
