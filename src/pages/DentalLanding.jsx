import { useState, useEffect, useRef } from "react";

// Dental Landing Page — zidly.ai/dentists
// Design: Clean, trust-forward, conversion-optimized
// Hero = BizScorer input field (try before you buy)

const T = "#0D9488", TD = "#0F766E", TL = "#14B8A6";

const PLANS = [
  { name: "Core", price: 97, setup: 99, tag: "Most Popular", features: ["AI Chatbot (24/7)", "Review Response Writer", "Review Funnel", "BizScorer Audit", "Lead Inbox", "Schema Generator", "QR Code Kit", "Monthly Report"], cta: "Start Free Trial" },
  { name: "Plus", price: 197, setup: 199, tag: null, features: ["Everything in Core", "Social Content Engine", "Blog Writer", "Ad Studio", "Email Campaigns", "Revenue Radar", "Maps Rank Tracker"], cta: "Start Free Trial" },
  { name: "Pro", price: 347, setup: 299, tag: "Best Value", features: ["Everything in Plus", "Competitor Deep Analysis", "Activity Tracking", "Steal Their Customers", "Health Dashboard", "Proposal Studio", "\"Powered by Zidly\" removed"], cta: "Start Free Trial" },
  { name: "Elite", price: 697, setup: 499, tag: null, features: ["Everything in Pro", "Crisis Intelligence", "Strategy Simulator", "Partnership Finder", "Staff Planner", "Priority Support", "Custom Integrations"], cta: "Contact Us" },
];

const PAIN_POINTS = [
  { icon: "📞", title: "\"Do you accept Delta Dental?\" — 30 times a day.", desc: "Your front desk answers the same insurance question all day long. After 5pm? Nobody answers. The patient checks the next practice. An AI assistant trained on YOUR insurance list answers in 2 seconds, at 2am, on a Sunday. Correctly. Every time.", stat: "30+", statLabel: "times/day this question is asked" },
  { icon: "📱", title: "Your practice misses 25% of inbound calls.", desc: "Of those answered, only half schedule. That's 62 out of every 100 potential patients — gone. Missed Call Text-Back sends an automatic text within 10 seconds: \"Sorry we missed your call! Schedule here.\" Recovers 40%+ of missed opportunities.", stat: "25%", statLabel: "of patient calls go unanswered" },
  { icon: "⭐", title: "Your competitor has 120 reviews. You have 23.", desc: "97% of patients check Google reviews before scheduling. Automated review requests after every appointment close this gap in weeks, not years. Happy patients go to Google. Unhappy patients go to a private feedback form you can actually address.", stat: "97%", statLabel: "of patients check reviews first" },
  { icon: "💎", title: "The $25,000 case that got away.", desc: "Someone researching dental implants at 10pm finds your site. No implant page. No pricing. No financing info. They find a competitor with a dedicated implant page and before/after photos. That's a $25,000 All-on-4 case — gone. Your AI assistant doesn't just capture cleanings. It captures life-changing procedures.", stat: "$25K+", statLabel: "per All-on-4 implant case" },
];

const FAQS = [
  { q: "How does the AI know my insurance list, hours, and services?", a: "It scans your website and extracts everything — insurance providers, services with pricing, hours, provider bios, and specialties. For dental practices, it specifically looks for your accepted insurance plans, emergency availability, and high-value services like implants and Invisalign." },
  { q: "Will this replace my front desk staff?", a: "No — it supports them. Your AI handles the repetitive questions (insurance, hours, pricing) so your front desk can focus on the patients in front of them. It reduces phone volume by 30%+, not headcount." },
  { q: "How long does setup take?", a: "Under 5 minutes. Your AI assistant scans your website and is ready to answer patient questions within minutes. We add it to your site with a single line of code — or we do it for you." },
  { q: "What if a patient asks something the AI doesn't know?", a: "It says: 'Let me connect you with our team for the most accurate answer. Can I get your name and number?' Then it captures their info and notifies your front desk. No patient falls through the cracks." },
  { q: "Does this work for high-value procedures like implants and cosmetic cases?", a: "Especially for those. Implant patients research for months and often search at night. Your AI answers their questions about cost, timeline, financing, and recovery — then captures their consultation request. One implant case ($3,000-$50,000) pays for years of Zidly." },
  { q: "What if I already use Podium, Weave, or Birdeye?", a: "Switch in minutes. We're 1/3 the cost with more features, no contracts, and no cancellation headaches. We even have a migration guide. Most practices see the same (or better) results immediately." },
  { q: "Is there a contract?", a: "No. Month-to-month. Cancel anytime from your dashboard. We also offer annual plans that save 2 months. No phone calls, no retention games — unlike some competitors." },
  { q: "What's the guarantee?", a: "If your AI assistant doesn't capture at least 10 new patient inquiries in 30 days, we refund your setup fee. That's nearly risk-free — any practice with decent traffic gets 10+ interactions in a month." },
];

const SOCIAL_PROOF = [
  { stat: "97%", label: "of patients research your practice online before scheduling" },
  { stat: "$4,200", label: "average lifetime production per patient" },
  { stat: "25%", label: "of patient calls your front desk misses daily" },
  { stat: "$15-25", label: "per Google Ads click for implant keywords — Zidly is $97/month" },
];

export default function DentalLanding() {
  const [scanUrl, setScanUrl] = useState("");
  const [email, setEmail] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState({});
  const refs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.id]: true })); });
    }, { threshold: 0.15 });
    document.querySelectorAll("[data-anim]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const anim = (id) => visible[id] ? "zd-visible" : "zd-hidden";

  return <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: "#0F172A", background: "#fff", overflowX: "hidden" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .zd-hidden { opacity: 0; transform: translateY(30px); }
      .zd-visible { opacity: 1; transform: translateY(0); transition: opacity 0.6s ease, transform 0.6s ease; }
      .zd-btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${TD}, ${TL}); color: #fff; border: none; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; text-decoration: none; transition: transform 0.15s, box-shadow 0.15s; }
      .zd-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,148,136,0.3); }
      .zd-btn-outline { display: inline-block; padding: 14px 32px; background: transparent; color: ${T}; border: 2px solid ${T}; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; text-decoration: none; transition: all 0.15s; }
      .zd-btn-outline:hover { background: ${T}; color: #fff; }
      @media (max-width: 768px) { .zd-grid-2 { grid-template-columns: 1fr !important; } .zd-grid-4 { grid-template-columns: 1fr 1fr !important; } .zd-hero-h { font-size: 32px !important; } .zd-pricing-grid { grid-template-columns: 1fr !important; } }
    `}</style>

    {/* Nav */}
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrollY > 50 ? "rgba(255,255,255,0.95)" : "transparent", backdropFilter: scrollY > 50 ? "blur(12px)" : "none", borderBottom: scrollY > 50 ? "1px solid #E2E8F0" : "none", transition: "all 0.3s", padding: "14px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${T},${TL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 15 }}>Z</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "#0F172A", letterSpacing: -0.5 }}>Zidly</span>
          <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, marginLeft: 4 }}>for Dentists</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="#pricing" style={{ color: "#64748B", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Pricing</a>
          <a href="#faq" style={{ color: "#64748B", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>FAQ</a>
          <button className="zd-btn" style={{ padding: "10px 22px", fontSize: 13 }}>Try Free →</button>
        </div>
      </div>
    </nav>

    {/* Hero */}
    <section style={{ paddingTop: 120, paddingBottom: 80, background: "linear-gradient(180deg, #F0FDFA 0%, #fff 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T}08, transparent)` }} />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        <div style={{ display: "inline-block", padding: "6px 16px", background: `${T}10`, borderRadius: 20, fontSize: 13, color: T, fontWeight: 600, marginBottom: 20 }}>Built for dental practices. No contracts. Cancel anytime.</div>
        <h1 className="zd-hero-h" style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.12, letterSpacing: -1.5, marginBottom: 18, color: "#0F172A" }}>
          Your practice loses patients<br /><span style={{ color: T }}>every night after 5pm</span>
        </h1>
        <p style={{ fontSize: 18, color: "#64748B", lineHeight: 1.6, marginBottom: 32, maxWidth: 560, margin: "0 auto 32px" }}>
          97% of patients research you online before scheduling. At 10pm, someone asks "Do you accept my insurance?" Your website is silent. A competitor's AI answers. They schedule there. That patient is worth $4,200 in lifetime production — one implant case, $25,000+.
        </p>

        {/* BizScorer Input — the conversion moment */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 480, margin: "0 auto", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #E2E8F0" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>See what your practice is missing — free, 60 seconds</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={scanUrl} onChange={e => setScanUrl(e.target.value)} placeholder="Enter your practice website..." style={{ flex: 1, padding: "12px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            <button className="zd-btn" style={{ padding: "12px 20px", fontSize: 13, whiteSpace: "nowrap" }}>Scan My Practice →</button>
          </div>
          <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 8 }}>No signup. No credit card. See your score, your competitors, and what's costing you patients.</p>
        </div>
      </div>
    </section>

    {/* Social Proof Bar */}
    <section style={{ background: "#0F172A", padding: "32px 24px" }}>
      <div className="zd-grid-4" style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
        {SOCIAL_PROOF.map(s => <div key={s.label}>
          <div style={{ fontSize: 28, fontWeight: 900, color: TL }}>{s.stat}</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
        </div>)}
      </div>
    </section>

    {/* Pain Points */}
    <section style={{ padding: "80px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.8 }}>You're losing patients right now.<br />Here's exactly how much.</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {PAIN_POINTS.map((p, i) => <div key={i} id={`pain-${i}`} data-anim className={anim(`pain-${i}`)} style={{ display: "grid", gridTemplateColumns: i % 2 === 0 ? "1fr 200px" : "200px 1fr", gap: 32, alignItems: "center", padding: 32, background: "#FAFBFC", borderRadius: 16, border: "1px solid #E2E8F0" }} className={`zd-grid-2 ${anim(`pain-${i}`)}`}>
          {i % 2 !== 0 && <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#DC2626" }}>{p.stat}</div>
            <div style={{ fontSize: 13, color: "#64748B" }}>{p.statLabel}</div>
          </div>}
          <div>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{p.title}</h3>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7 }}>{p.desc}</p>
          </div>
          {i % 2 === 0 && <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#DC2626" }}>{p.stat}</div>
            <div style={{ fontSize: 13, color: "#64748B" }}>{p.statLabel}</div>
          </div>}
        </div>)}
      </div>
    </section>

    {/* How It Works */}
    <section style={{ padding: "80px 24px", background: "linear-gradient(180deg, #F0FDFA 0%, #fff 100%)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 34, fontWeight: 800, marginBottom: 48, letterSpacing: -0.8 }}>Live in 5 minutes. Seriously.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }} className="zd-grid-2">
          {[
            { step: "1", title: "Scan your practice", desc: "Enter your website. We scan your reviews, SEO, insurance page, provider bios, and competitors in 60 seconds. See your dental-specific BizScore instantly.", icon: "🔍" },
            { step: "2", title: "Choose your plan", desc: "Core, Plus, Pro, or Elite. All tools activate automatically — AI patient assistant, review automation, SEO monitoring, content engine. Zero configuration.", icon: "⚡" },
            { step: "3", title: "Patients start finding you", desc: "Your AI answers insurance questions at 10pm. Reviews grow weekly. Rankings improve. Implant consultations come in while you sleep. Production follows.", icon: "📈" },
          ].map(s => <div key={s.step} style={{ padding: 28, background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${T}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: T, marginBottom: 8 }}>Step {s.step}</div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>{s.desc}</p>
          </div>)}
        </div>
      </div>
    </section>

    {/* What You Get */}
    <section style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.8 }}>Everything your practice needs.<br />One platform.</h2>
          <p style={{ fontSize: 16, color: "#64748B", marginTop: 12 }}>No more juggling 5 tools. Zidly replaces Podium, Birdeye, and BrightLocal — at 1/3 the cost. The average dental practice spends $5,000-8,000/month on marketing. Zidly is less than 2% of that budget.</p>
        </div>
        <div className="zd-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { icon: "🤖", title: "AI Patient Assistant", desc: "Answers insurance questions, explains procedures, discusses financing, and captures new patient details 24/7. Trained on YOUR services, providers, hours, and insurance list. \"Do you accept Cigna?\" answered correctly at 10pm." },
            { icon: "⭐", title: "Reputation Shield", desc: "Automated review requests after every appointment. Smart routing: happy patients go to Google, unhappy go to private feedback. AI-written responses in your practice's voice. Negative review alerts sent to your phone instantly." },
            { icon: "🔍", title: "Practice SEO", desc: "Schema markup showing your stars, hours, and phone in Google results. Rank tracking for \"dentist near me\" and high-value terms like \"dental implants\" and \"Invisalign.\" AI Visibility scoring for Google's Gemini answers." },
            { icon: "📱", title: "Patient Content Engine", desc: "AI-generated social posts, patient education articles, and email campaigns. \"What to expect during a root canal.\" \"5 signs you need a dental implant.\" Content answering the questions patients are already Googling." },
            { icon: "🎯", title: "Competitive Intelligence", desc: "Track competitor reviews, ratings, and Google activity weekly. Find practices with bad reviews and target their dissatisfied patients. See exactly how you stack up in your area." },
            { icon: "📊", title: "Practice BizScore", desc: "Free health audit scoring 6 dimensions including AI Visibility. See your insurance page, provider bios, emergency page, implant page, and 20+ dental-specific checks. The report shows exactly what to fix and what each gap costs in lost production." },
          ].map(f => <div key={f.title} style={{ padding: 24, background: "#FAFBFC", borderRadius: 14, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>{f.desc}</p>
          </div>)}
        </div>
      </div>
    </section>

    {/* Pricing */}
    <section id="pricing" style={{ padding: "80px 24px", background: "#0F172A" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: -0.8 }}>Transparent pricing. No surprises.</h2>
          <p style={{ fontSize: 16, color: "#94A3B8", marginTop: 12 }}>The average practice spends $5,000-8,000/month on marketing. One Google Ads click for "dental implants" costs $15-25. Your entire month of Zidly? Less than 4 clicks.</p>
          <p style={{ fontSize: 14, color: "#64748B", marginTop: 8 }}>Month-to-month. Cancel anytime. Annual saves 2 months.</p>
        </div>
        <div className="zd-pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignItems: "start" }}>
          {PLANS.map(p => <div key={p.name} style={{ background: p.tag === "Most Popular" ? `linear-gradient(135deg, ${TD}, ${TL})` : "#1E293B", borderRadius: 16, padding: 28, position: "relative", border: p.tag === "Best Value" ? `2px solid ${T}` : "1px solid #334155" }}>
            {p.tag && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: p.tag === "Most Popular" ? "#fff" : T, color: p.tag === "Most Popular" ? T : "#fff", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 12 }}>{p.tag}</div>}
            <div style={{ fontSize: 14, fontWeight: 600, color: p.tag === "Most Popular" ? "rgba(255,255,255,0.8)" : "#94A3B8", marginBottom: 8 }}>{p.name}</div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>${p.price}</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>/mo</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>${p.setup} setup fee</div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, marginBottom: 20 }}>
              {p.features.map(f => <div key={f} style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", padding: "5px 0", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: TL, fontSize: 12 }}>✓</span> {f}
              </div>)}
            </div>
            <button className="zd-btn" style={{ width: "100%", padding: "12px", background: p.tag === "Most Popular" ? "#fff" : `linear-gradient(135deg,${TD},${TL})`, color: p.tag === "Most Popular" ? T : "#fff" }}>{p.cta}</button>
          </div>)}
        </div>
        <p style={{ textAlign: "center", fontSize: 13, color: "#64748B", marginTop: 24 }}>All plans include 14-day free trial. No credit card required to start.</p>
      </div>
    </section>

    {/* Comparison */}
    <section style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, textAlign: "center", marginBottom: 8, letterSpacing: -0.5 }}>Zidly vs. the competition</h2>
        <p style={{ textAlign: "center", fontSize: 14, color: "#64748B", marginBottom: 24 }}>Same review management. Plus 30 tools they don't have. At 1/3 the price.</p>
        <div style={{ borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "14px 16px", background: "#F8FAFC", fontWeight: 700, fontSize: 13, gap: 8 }}>
            <div>Feature</div><div style={{ color: T, textAlign: "center" }}>Zidly</div><div style={{ textAlign: "center", color: "#94A3B8" }}>Podium</div><div style={{ textAlign: "center", color: "#94A3B8" }}>Birdeye</div>
          </div>
          {[
            ["AI Patient Assistant (trained on YOUR practice)", true, false, true],
            ["Insurance Question Answering (24/7)", true, false, false],
            ["Review Management", true, true, true],
            ["Review Request Automation", true, true, true],
            ["SEO Tools + Schema Markup", true, false, false],
            ["AI Visibility Score (Gemini)", true, false, false],
            ["Social Content Generator", true, false, false],
            ["Competitor Tracking", true, false, true],
            ["High-Ticket Procedure Pages (Implants, Cosmetic)", true, false, false],
            ["No Contracts", true, false, false],
            ["Transparent Pricing", true, false, false],
            ["Starting Price", "$97/mo", "$249/mo", "$299/mo"],
          ].map(([feature, z, p, b], i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "12px 16px", borderTop: "1px solid #E2E8F0", fontSize: 13, gap: 8, alignItems: "center" }}>
            <div style={{ fontWeight: 500 }}>{feature}</div>
            <div style={{ textAlign: "center", color: z === true ? "#22C55E" : typeof z === "string" ? T : "#EF4444", fontWeight: typeof z === "string" ? 800 : 400 }}>{z === true ? "✓" : z === false ? "✕" : z}</div>
            <div style={{ textAlign: "center", color: p === true ? "#22C55E" : typeof p === "string" ? "#64748B" : "#EF4444" }}>{p === true ? "✓" : p === false ? "✕" : p}</div>
            <div style={{ textAlign: "center", color: b === true ? "#22C55E" : typeof b === "string" ? "#64748B" : "#EF4444" }}>{b === true ? "✓" : b === false ? "✕" : b}</div>
          </div>)}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section id="faq" style={{ padding: "80px 24px", background: "#FAFBFC" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, textAlign: "center", marginBottom: 32, letterSpacing: -0.5 }}>Frequently asked questions</h2>
        {FAQS.map((f, i) => <div key={i} style={{ marginBottom: 8 }}>
          <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#fff", borderRadius: openFaq === i ? "12px 12px 0 0" : 12, border: "1px solid #E2E8F0", cursor: "pointer" }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{f.q}</span>
            <span style={{ color: "#94A3B8", fontSize: 18, transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
          </div>
          {openFaq === i && <div style={{ padding: "16px 20px", background: "#fff", borderRadius: "0 0 12px 12px", borderTop: "none", border: "1px solid #E2E8F0", borderTopColor: "transparent" }}>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{f.a}</p>
          </div>}
        </div>)}
      </div>
    </section>

    {/* Final CTA */}
    <section style={{ padding: "80px 24px", textAlign: "center", background: `linear-gradient(135deg, ${TD}08, ${TL}05)` }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <h2 style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1, marginBottom: 16 }}>Stop losing patients tonight.</h2>
        <p style={{ fontSize: 16, color: "#64748B", marginBottom: 28, lineHeight: 1.6 }}>Scan your practice. See your score. Your AI patient assistant is live in 5 minutes. One implant case captured pays for 3 years of Zidly.</p>
        <div style={{ display: "flex", gap: 8, maxWidth: 440, margin: "0 auto" }}>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your practice website..." style={{ flex: 1, padding: "14px 18px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          <button className="zd-btn" style={{ whiteSpace: "nowrap" }}>Start Free →</button>
        </div>
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 12 }}>14-day free trial. No credit card. Cancel anytime.</p>
      </div>
    </section>

    {/* Footer */}
    <footer style={{ padding: "32px 24px", borderTop: "1px solid #E2E8F0", textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: `linear-gradient(135deg,${T},${TL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 11 }}>Z</div>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Zidly</span>
      </div>
      <p style={{ fontSize: 12, color: "#94A3B8" }}>AI-powered growth for dental practices. Built by a practice marketing expert, not a generic SaaS company.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12, fontSize: 13, color: "#64748B" }}>
        <a href="#" style={{ color: "#64748B", textDecoration: "none" }}>Privacy</a>
        <a href="#" style={{ color: "#64748B", textDecoration: "none" }}>Terms</a>
        <a href="#" style={{ color: "#64748B", textDecoration: "none" }}>Contact</a>
      </div>
    </footer>
  </div>;
}
