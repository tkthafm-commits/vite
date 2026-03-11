import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useSEO from "../useSEO.js";

// Vertical Landing Page Template — zidly.ai/medspa, /lawyers, /homeservices
// Same structure as dental, different copy/pain points/pricing emphasis per vertical
const T = "#0D9488", TD = "#0F766E", TL = "#14B8A6";

const VERTICALS = {
  medspa: {
    title: "Med Spa",
    slug: "medspa",
    heroH1: ["Your med spa loses clients", "every night after hours"],
    heroSub: "Someone Googles \"Botox near me\" at 9pm. Your website is silent. A competitor's AI chatbot answers their questions instantly. They book there. You lose a $2,400 lifetime client.",
    badge: "Built for med spas. No contracts. Cancel anytime.",
    painPoints: [
      { icon: "💉", title: "Consultations lost after hours.", desc: "Med spa clients research treatments at night — Botox, fillers, laser, facials. They have questions about pricing, recovery time, and eligibility. Your website can't answer. A chatbot can.", stat: "$2,400", statLabel: "avg client lifetime value" },
      { icon: "⭐", title: "Your competitor has 200 reviews. You have 35.", desc: "Med spa clients are cautious. They're putting chemicals in their face. They read EVERY review before booking. If your competitor has 6x more reviews with better photos, the decision is already made.", stat: "92%", statLabel: "read reviews before booking" },
      { icon: "📸", title: "Instagram drives 60% of your leads — but your website doesn't convert them.", desc: "They see your before/afters on IG. They click your link. They land on a static page with no chat, no booking button, no instant answers. They leave.", stat: "60%", statLabel: "of medspa leads start on social" },
    ],
    features: [
      { icon: "🤖", title: "AI Concierge", desc: "Answers treatment questions 24/7 — pricing, recovery time, candidacy, packages. Knows your specific services and providers." },
      { icon: "⭐", title: "Review Growth", desc: "Automated requests after every appointment. Happy clients → Google. Unhappy → private feedback. Watch your rating climb." },
      { icon: "📸", title: "Social Content Engine", desc: "AI-generated posts for Instagram, Facebook, TikTok. Before/after captions, treatment education, seasonal promos. A full social team for $97/mo." },
    ],
    stats: [
      { stat: "3,200+", label: "med spa searches monthly in your area" },
      { stat: "$2,400", label: "average client lifetime value" },
      { stat: "24/7", label: "your AI concierge never sleeps" },
      { stat: "92%", label: "read reviews before booking treatments" },
    ],
    compLabel: "med spas",
    persona: "client",
  },
  lawyers: {
    title: "Law Firm",
    slug: "lawyers",
    heroH1: ["Someone needs a lawyer", "right now. At midnight."],
    heroSub: "Personal injury. DUI. Custody battle. They're searching in a crisis. Your website is a brochure. Your competitor's chatbot captures their name, email, and case details while you sleep. That's an $8,000 case — gone.",
    badge: "Built for law firms. No contracts. Cancel anytime.",
    painPoints: [
      { icon: "⚖️", title: "Legal emergencies don't wait for business hours.", desc: "Arrests happen at 2am. Car accidents at midnight. Custody fights on weekends. Potential clients search in crisis. If your site can't capture them instantly, they go to the attorney who can.", stat: "$8,000", statLabel: "avg case value (personal injury)" },
      { icon: "⭐", title: "Reviews are your #1 trust signal.", desc: "People hiring a lawyer are scared. They're making the biggest decision of their life based on Google reviews. 35 reviews at 4.2 stars vs a competitor with 80 reviews at 4.6 stars? You lose every time.", stat: "84%", statLabel: "trust reviews as much as referrals" },
      { icon: "🔍", title: "\"Lawyer near me\" = $50-100/click on Google Ads.", desc: "Legal keywords are the most expensive in all of Google advertising. Instead of paying $50/click, rank organically with proper SEO, schema markup, and a content strategy. Zidly does this automatically.", stat: "$50+", statLabel: "per click on Google Ads for lawyers" },
    ],
    features: [
      { icon: "🤖", title: "AI Intake Bot", desc: "Captures case details 24/7 — practice areas, incident dates, injury type, contact info. Pre-qualifies leads before your first call." },
      { icon: "⭐", title: "Review Management", desc: "Automated requests after case resolution. Smart routing protects your reputation. AI-written responses to all Google reviews." },
      { icon: "🔍", title: "Legal SEO Suite", desc: "Schema markup for attorneys, rank tracking for legal keywords, competitor analysis. Stop paying $50/click when you can rank for free." },
    ],
    stats: [
      { stat: "1,200+", label: "legal searches monthly in your area" },
      { stat: "$8,000", label: "average case value" },
      { stat: "$50+", label: "saved per click vs Google Ads" },
      { stat: "24/7", label: "AI intake captures leads while you sleep" },
    ],
    compLabel: "law firms",
    persona: "client",
  },
  homeservices: {
    title: "Home Services",
    slug: "homeservices",
    heroH1: ["A pipe bursts at 2am.", "Who answers your phone?"],
    heroSub: "Emergency plumbing. AC broken in July. Roof leak during a storm. Your customers need someone NOW. If your website can't capture them instantly, they're calling the next result on Google.",
    badge: "Built for home service pros. No contracts. Cancel anytime.",
    painPoints: [
      { icon: "🔧", title: "Emergencies happen outside business hours.", desc: "A burst pipe doesn't wait for Monday. A broken AC in August doesn't wait until 9am. 40% of home service calls happen after hours. Without an AI answering, that's 40% of leads going to competitors.", stat: "40%", statLabel: "of calls happen after hours" },
      { icon: "⭐", title: "One bad review costs you $30,000/year.", desc: "Home service customers check reviews obsessively — they're letting a stranger into their home. One unaddressed negative review can cost you 30 potential customers per year at $1,000 average ticket.", stat: "$30K", statLabel: "annual cost of one bad review" },
      { icon: "📱", title: "\"Plumber near me\" is searched 12,000 times/month.", desc: "Your area has thousands of people actively searching for your exact service right now. If you're not in the top 3 results with great reviews, you don't exist.", stat: "12K", statLabel: "monthly searches for home services" },
    ],
    features: [
      { icon: "🤖", title: "Emergency AI Responder", desc: "Captures emergency details 24/7 — service type, address, urgency level, contact info. Texts you instantly so you can dispatch." },
      { icon: "⭐", title: "Review Domination", desc: "Automated requests after every job. QR code on invoices. Smart routing. Go from 20 reviews to 200 in months." },
      { icon: "📈", title: "Service Area SEO", desc: "Rank in every neighborhood you serve. Schema markup, rank tracking, competitor monitoring. Stop paying for leads — earn them." },
    ],
    stats: [
      { stat: "12,000+", label: "home service searches monthly in your area" },
      { stat: "$3,200", label: "average customer lifetime value" },
      { stat: "40%", label: "of leads come after business hours" },
      { stat: "<60s", label: "to scan your business and see your score" },
    ],
    compLabel: "home service businesses",
    persona: "customer",
  },
};

export default function VerticalLanding() {
  const location = useLocation();
  const pathKey = location.pathname.replace("/", "");
  const [vertical, setVertical] = useState(VERTICALS[pathKey] ? pathKey : "medspa");
  const seoMap = {
    medspa: { title: "AI for Med Spas — Capture Botox & Filler Leads 24/7", description: "AI chatbot answers treatment questions, pricing, and booking for med spas after hours. Automated review collection. From $97/mo.", canonical: "/medspa" },
    lawyers: { title: "AI for Law Firms — Capture Legal Leads After Hours", description: "AI assistant qualifies personal injury, family law, and criminal defense leads 24/7. Automated review management for attorneys.", canonical: "/lawyers" },
    homeservices: { title: "AI for Home Services — HVAC, Plumbing, Electrical Leads 24/7", description: "AI chatbot captures emergency service requests at 2am. Automated reviews for contractors. From $97/mo.", canonical: "/homeservices" },
    restaurants: { title: "AI for Restaurants — Answer Menu, Hours & Reservation Questions 24/7", description: "AI assistant handles menu questions, delivery zones, catering orders, and reservations automatically. Boost Google reviews.", canonical: "/restaurants" },
    realestate: { title: "AI for Real Estate — Answer Property Questions 24/7", description: "AI chatbot handles property inquiries, financing questions, and showing requests after hours. Automated review collection for agents.", canonical: "/realestate" },
  };
  useSEO(seoMap[vertical] || seoMap.medspa);
  useEffect(() => {
    const key = location.pathname.replace("/", "");
    if (VERTICALS[key]) setVertical(key);
  }, [location.pathname]);

  const V = VERTICALS[vertical];
  const [scanUrl, setScanUrl] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const FAQS = [
    { q: "How long does setup take?", a: "Under 5 minutes. Our onboarding wizard collects your business info, and all tools activate automatically. Your chatbot is live within 24 hours." },
    { q: "Do I need technical knowledge?", a: "Zero. We handle everything. Your chatbot gets a simple code snippet to paste on your site — or we do it for you." },
    { q: "Is there a contract?", a: "No. Month-to-month. Cancel anytime from your dashboard. Annual plans save 2 months." },
    { q: "How does the AI chatbot work?", a: `It scans your website and learns your services, hours, pricing, and team. Then it answers ${V.persona} questions 24/7 — accurately, warmly, and guides them toward booking.` },
    { q: "What's the guarantee?", a: "If your chatbot doesn't capture at least 10 inquiries in 30 days, we refund your setup fee." },
  ];

  return <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: "#0F172A", background: "#fff" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .vl-btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${TD}, ${TL}); color: #fff; border: none; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; text-decoration: none; transition: transform 0.15s; }
      .vl-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,148,136,0.3); }
      @media (max-width: 768px) { .vl-grid-2 { grid-template-columns: 1fr !important; } .vl-grid-3 { grid-template-columns: 1fr !important; } .vl-grid-4 { grid-template-columns: 1fr 1fr !important; } .vl-hero-h { font-size: 32px !important; } }
    `}</style>

    {/* Vertical Selector (for demo — in production, each is a separate route) */}
    <div style={{ background: "#F8FAFC", padding: "8px 24px", textAlign: "center", borderBottom: "1px solid #E2E8F0" }}>
      <span style={{ fontSize: 12, color: "#94A3B8", marginRight: 8 }}>Preview:</span>
      {Object.entries(VERTICALS).map(([k, v]) => <button key={k} onClick={() => setVertical(k)} style={{ padding: "4px 12px", margin: "0 4px", background: vertical === k ? T : "transparent", color: vertical === k ? "#fff" : "#64748B", border: `1px solid ${vertical === k ? T : "#E2E8F0"}`, borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{v.title}</button>)}
    </div>

    {/* Hero */}
    <section style={{ paddingTop: 80, paddingBottom: 60, background: "linear-gradient(180deg, #F0FDFA 0%, #fff 100%)", textAlign: "center" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "inline-block", padding: "6px 16px", background: `${T}10`, borderRadius: 20, fontSize: 13, color: T, fontWeight: 600, marginBottom: 20 }}>{V.badge}</div>
        <h1 className="vl-hero-h" style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.12, letterSpacing: -1.5, marginBottom: 18 }}>
          {V.heroH1[0]}<br /><span style={{ color: T }}>{V.heroH1[1]}</span>
        </h1>
        <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.6, marginBottom: 32, maxWidth: 560, margin: "0 auto 32px" }}>{V.heroSub}</p>
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 480, margin: "0 auto", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #E2E8F0" }}>
          <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>See what your business is missing — free</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={scanUrl} onChange={e => setScanUrl(e.target.value)} placeholder="Enter your website..." style={{ flex: 1, padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            <button className="vl-btn" style={{ padding: "12px 20px", fontSize: 13 }}>Scan Free →</button>
          </div>
          <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 8 }}>No signup. No credit card. 60-second results.</p>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section style={{ background: "#0F172A", padding: "32px 24px" }}>
      <div className="vl-grid-4" style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
        {V.stats.map(s => <div key={s.label}><div style={{ fontSize: 28, fontWeight: 900, color: TL }}>{s.stat}</div><div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{s.label}</div></div>)}
      </div>
    </section>

    {/* Pain Points */}
    <section style={{ padding: "70px 24px", maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 40, letterSpacing: -0.8 }}>You're losing {V.persona}s right now.</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {V.painPoints.map((p, i) => <div key={i} className="vl-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 24, padding: 28, background: "#FAFBFC", borderRadius: 14, border: "1px solid #E2E8F0", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{p.icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{p.title}</h3>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{p.desc}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: "#DC2626" }}>{p.stat}</div>
            <div style={{ fontSize: 12, color: "#64748B" }}>{p.statLabel}</div>
          </div>
        </div>)}
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: "60px 24px", background: "#F0FDFA" }}>
      <div className="vl-grid-3" style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {V.features.map(f => <div key={f.title} style={{ padding: 24, background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0" }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{f.desc}</p>
        </div>)}
      </div>
    </section>

    {/* FAQ */}
    <section style={{ padding: "60px 24px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: "center", marginBottom: 24 }}>FAQ</h2>
        {FAQS.map((f, i) => <div key={i} style={{ marginBottom: 6 }}>
          <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: openFaq === i ? "#FAFBFC" : "#fff", borderRadius: openFaq === i ? "10px 10px 0 0" : 10, border: "1px solid #E2E8F0", cursor: "pointer" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{f.q}</span>
            <span style={{ color: "#94A3B8" }}>{openFaq === i ? "−" : "+"}</span>
          </div>
          {openFaq === i && <div style={{ padding: "14px 18px", background: "#FAFBFC", borderRadius: "0 0 10px 10px", border: "1px solid #E2E8F0", borderTop: "none" }}>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{f.a}</p>
          </div>}
        </div>)}
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: "60px 24px", textAlign: "center", background: `linear-gradient(135deg, ${TD}08, ${TL}05)` }}>
      <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Stop losing {V.persona}s tonight.</h2>
      <p style={{ fontSize: 15, color: "#64748B", marginBottom: 24 }}>14-day free trial. No credit card. Live in 5 minutes.</p>
      <button className="vl-btn" style={{ fontSize: 16, padding: "16px 40px" }}>Start Free Trial →</button>
    </section>
  </div>;
}
