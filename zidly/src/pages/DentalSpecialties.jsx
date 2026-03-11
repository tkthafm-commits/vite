import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useSEO from "../useSEO.js";

// zidly.ai/implant-dentists | /cosmetic-dentists | /invisalign-providers
// Same product, different emotional framing per specialty
const T = "#0D9488", TD = "#0F766E", TL = "#14B8A6";

const SUBS = {
  implant: {
    title: "Implant Dentists",
    slug: "implant-dentists",
    badge: "Built for implant practices. No contracts. Cancel anytime.",
    hero: ["Every implant inquiry", "you miss costs $3,000-$50,000"],
    heroSub: "Implant patients research for months. They compare 3-5 practices at 10pm on a Tuesday. They check your reviews, your before/afters, and your financing options — all before they ever call. If your website can't answer their questions, they book with whoever can. One All-on-4 case is worth $25,000. One missed inquiry costs more than 20 years of Zidly.",
    stats: [
      { stat: "$4,500", label: "average single implant case value" },
      { stat: "$25,000", label: "average All-on-4 case value" },
      { stat: "800+", label: "monthly 'dental implants near me' searches in your area" },
      { stat: "$15-25", label: "per Google Ads click — Zidly is $97/month total" },
    ],
    pains: [
      { icon: "🌙", title: "Implant patients research at 10pm.", desc: "They have questions: How much? How long? Does it hurt? Is financing available? Am I a candidate? If your website can't answer at 10pm, the practice that CAN answer gets the $25,000 case. Your AI assistant answers every implant question 24/7 — accurately, warmly, with financing details included.", stat: "$25K", statLabel: "per All-on-4 case lost" },
      { icon: "📸", title: "No before/after gallery = no cosmetic credibility.", desc: "Implant patients need VISUAL PROOF. They want to see what the result looks like. Practices with before/after galleries see 50%+ higher consultation requests for high-value procedures. Without one, you're invisible to the patients who spend the most.", stat: "50%", statLabel: "more consults with a gallery" },
      { icon: "💰", title: "No financing page = no case acceptance.", desc: "40% of patients delay implant treatment due to cost uncertainty. When your website prominently features CareCredit, in-house payment plans, and monthly breakdowns ($150/month for 30 months), case acceptance jumps from 40% to 70%+. That's the difference between a $25K case and a 'let me think about it.'", stat: "40%", statLabel: "delay treatment over cost" },
    ],
    features: [
      { icon: "🤖", title: "Implant-Trained AI Assistant", desc: "Answers procedure questions, explains timelines, discusses financing, confirms candidacy criteria — 24/7. Trained on YOUR specific implant services, pricing, and providers. Captures consultation requests while you sleep." },
      { icon: "⭐", title: "Implant Review Collection", desc: "Automated review requests specifically targeting implant patients post-procedure. These reviews mention 'implants,' 'All-on-4,' and provider names — exactly what Gemini uses to recommend practices." },
      { icon: "🔍", title: "Implant SEO + AI Visibility", desc: "Rank for 'dental implants near me,' 'All-on-4 [city],' and 'dental implant cost.' Schema markup telling Google you're an implant provider. AI Visibility scoring for Gemini-powered recommendations." },
    ],
    roiCalc: { label: "One implant case", value: 4500, months: Math.round(4500/97) },
    patientJourney: "Implant patients take 2-6 months from first Google search to booked consultation. During that time, they visit 3-5 practice websites, read 20+ reviews, compare pricing, and look at before/after photos. Your online presence IS the sales process.",
  },

  cosmetic: {
    title: "Cosmetic Dentists",
    slug: "cosmetic-dentists",
    badge: "Built for cosmetic practices. No contracts. Cancel anytime.",
    hero: ["Cosmetic patients choose", "based on what they see online"],
    heroSub: "Veneer patients, smile makeover candidates, and whitening seekers make decisions based on your before/after gallery, your Google reviews, and how 'premium' your online presence feels. A cosmetic practice with 150 reviews and a polished gallery wins every comparison against one with 30 reviews and a template website. At $10,000-30,000 per smile makeover, every lost comparison hurts.",
    stats: [
      { stat: "$15,000", label: "average veneer case value (10 veneers)" },
      { stat: "$25,000", label: "average smile makeover case value" },
      { stat: "91%", label: "of aesthetic demand driven by social media" },
      { stat: "3.2", label: "practices compared before choosing cosmetic dentist" },
    ],
    pains: [
      { icon: "📸", title: "Your before/afters are your #1 sales tool.", desc: "Cosmetic patients are visual decision-makers. They scroll through Instagram before/afters, then Google 'cosmetic dentist near me.' If your website doesn't have a gallery that matches the quality they saw on social media, they bounce. Your gallery needs to be prominent, mobile-optimized, and updated regularly.", stat: "91%", statLabel: "influenced by social media" },
      { icon: "⭐", title: "Cosmetic reviews need to mention specific procedures.", desc: "A review saying 'great dentist!' helps. A review saying 'Dr. Chen did my porcelain veneers and I've never been happier with my smile — the whole process took 3 visits' converts. Zidly's review system encourages procedure-specific language that Google's AI uses to recommend you for cosmetic searches.", stat: "3.2x", statLabel: "practices compared per patient" },
      { icon: "💎", title: "Cash-pay patients expect a premium experience — starting online.", desc: "Cosmetic patients are typically self-pay. They have higher expectations for the entire experience, starting with your website. If your site looks like a template from 2015, they assume your clinical work is equally outdated. Premium care requires premium presentation.", stat: "$25K+", statLabel: "per smile makeover case" },
    ],
    features: [
      { icon: "🤖", title: "Cosmetic Consultation AI", desc: "Answers questions about procedures, recovery, pricing, and financing. Explains the difference between composite and porcelain veneers at 11pm. Captures consultation requests for smile makeovers, veneers, bonding, and whitening." },
      { icon: "📱", title: "Social Content Engine", desc: "AI-generated Instagram captions for before/afters, educational posts about cosmetic procedures, and Facebook ad copy targeting cosmetic-intent patients in your area." },
      { icon: "⭐", title: "Cosmetic-Specific Reviews", desc: "Smart review requests that prompt patients to mention their procedure. 'Tell us about your veneer experience!' These procedure-specific reviews are what rank you for cosmetic searches." },
    ],
    roiCalc: { label: "One veneer case (10 units)", value: 15000, months: Math.round(15000/97) },
    patientJourney: "Cosmetic patients are 70% female, ages 30-55, active on Instagram. They see a friend's smile transformation, Google 'veneers near me,' compare 3-4 practices based on galleries and reviews, then book a consultation. The entire decision happens online.",
  },

  invisalign: {
    title: "Invisalign Providers",
    slug: "invisalign-providers",
    badge: "Built for clear aligner practices. No contracts. Cancel anytime.",
    hero: ["Invisalign patients shop", "harder than any other dental consumer"],
    heroSub: "Clear aligner patients are digitally native comparison-shoppers. They check SmileDirectClub pricing, compare 4-5 local providers, read every review, and care deeply about cost and convenience. They decide entirely online — and they expect instant answers. If your website can't tell them your Invisalign price at 9pm, they go to the provider who can.",
    stats: [
      { stat: "$5,500", label: "average Invisalign case value" },
      { stat: "1,200+", label: "monthly 'Invisalign near me' searches in your area" },
      { stat: "4-5", label: "providers compared before choosing" },
      { stat: "68%", label: "of Invisalign patients are under 40" },
    ],
    pains: [
      { icon: "💲", title: "Price transparency wins Invisalign patients.", desc: "Clear aligner patients know SmileDirectClub costs $2,000. When they search for Invisalign, they expect to see your price range immediately. Practices that show 'Starting at $3,999 — 0% financing available' convert 60% more than those saying 'Call for a consultation.' Your chatbot should answer pricing questions instantly.", stat: "60%", statLabel: "more conversions with visible pricing" },
      { icon: "📱", title: "68% of your Invisalign patients are digital-first millennials.", desc: "They research on their phone. They expect online scheduling, instant chat answers, and a modern website. If your site doesn't have online booking and a chat widget, you've lost the exact demographic that wants Invisalign.", stat: "68%", statLabel: "of patients are under 40" },
      { icon: "🏆", title: "Your Invisalign tier matters — and patients check it.", desc: "Invisalign's tiered provider system (Silver, Gold, Platinum, Diamond) signals experience. Patients actively look for this. If your tier is displayed prominently with case count, it's a trust signal. If it's buried or missing, patients worry about experience.", stat: "4-5", statLabel: "providers compared per patient" },
    ],
    features: [
      { icon: "🤖", title: "Invisalign Price Bot", desc: "Answers the #1 question: 'How much does Invisalign cost?' with YOUR specific pricing, financing options, and consultation availability. Captures patient details for your treatment coordinator to follow up." },
      { icon: "📸", title: "Aligner Content Machine", desc: "Before/after posts, 'Invisalign vs braces' comparison content, treatment timeline infographics. Content that ranks for the exact searches your patients are making." },
      { icon: "🎯", title: "Competitor Tracker", desc: "Monitor competitor pricing, reviews, and Google visibility for Invisalign keywords. Know exactly how you compare to every provider in your area." },
    ],
    roiCalc: { label: "One Invisalign case", value: 5500, months: Math.round(5500/97) },
    patientJourney: "Invisalign patients start on social media or Google, check SmileDirectClub pricing first, then search for local providers. They compare 4-5 options in one sitting, prioritizing price transparency, reviews, and online scheduling. Decision made in 1-3 weeks.",
  },
};

export default function DentalSpecialties() {
  const location = useLocation();
  const slugMap = { "/implant-dentists": "implant", "/cosmetic-dentists": "cosmetic", "/invisalign-providers": "invisalign" };
  const [active, setActive] = useState(slugMap[location.pathname] || "implant");
  const seoMap = {
    implant: { title: "AI for Implant Dentists — Capture $3K-$50K Cases 24/7", description: "AI chatbot answers implant questions at 10pm. Capture All-on-4 and single implant cases while you sleep. From $97/mo.", canonical: "/implant-dentists" },
    cosmetic: { title: "AI for Cosmetic Dentists — Win the Visual Comparison", description: "AI assistant showcases veneers, whitening, and smile makeover results 24/7. Automated before/after galleries and review collection.", canonical: "/cosmetic-dentists" },
    invisalign: { title: "AI for Invisalign Providers — Convert Comparison Shoppers", description: "AI chatbot answers Invisalign cost, timeline, and eligibility questions instantly. Capture leads comparing clear aligner options 24/7.", canonical: "/invisalign-providers" },
  };
  useSEO(seoMap[active] || seoMap.implant);
  useEffect(() => {
    const key = slugMap[location.pathname];
    if (key) setActive(key);
  }, [location.pathname]);

  const S = SUBS[active];
  const [scanUrl, setScanUrl] = useState("");

  return <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: "#0F172A", background: "#fff", minHeight: "100vh" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .ds-btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${TD}, ${TL}); color: #fff; border: none; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; transition: transform 0.15s; }
      .ds-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,148,136,0.3); }
      @media (max-width: 768px) { .ds-grid { grid-template-columns: 1fr !important; } .ds-hero { font-size: 32px !important; } }
    `}</style>

    {/* Specialty Selector */}
    <div style={{ borderBottom: "1px solid #E2E8F0", padding: "10px 24px", textAlign: "center" }}>
      {Object.entries(SUBS).map(([k, v]) =>
        <button key={k} onClick={() => setActive(k)} style={{ padding: "6px 16px", margin: "0 4px", background: active === k ? T : "transparent", color: active === k ? "#fff" : "#64748B", border: `1.5px solid ${active === k ? T : "#E2E8F0"}`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{v.title}</button>
      )}
    </div>

    <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px" }}>
      {/* Hero */}
      <section style={{ padding: "48px 0 32px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "5px 14px", background: `${T}10`, borderRadius: 16, fontSize: 12, color: T, fontWeight: 600, marginBottom: 14 }}>{S.badge}</div>
        <h1 className="ds-hero" style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.12, letterSpacing: -1.2, marginBottom: 14 }}>
          {S.hero[0]}<br /><span style={{ color: T }}>{S.hero[1]}</span>
        </h1>
        <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.65, maxWidth: 600, margin: "0 auto 24px" }}>{S.heroSub}</p>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, maxWidth: 440, margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #E2E8F0" }}>
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>See what your practice is losing — free audit</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={scanUrl} onChange={e => setScanUrl(e.target.value)} placeholder="Your practice website..." style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
            <button className="ds-btn" style={{ padding: "10px 18px", fontSize: 13 }}>Scan →</button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div style={{ background: "#0F172A", borderRadius: 14, padding: "24px 20px", marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, textAlign: "center" }} className="ds-grid">
          {S.stats.map(s => <div key={s.label}><div style={{ fontSize: 24, fontWeight: 900, color: TL }}>{s.stat}</div><div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{s.label}</div></div>)}
        </div>
      </div>

      {/* Pain Points */}
      {S.pains.map((p, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 20, padding: 24, background: "#FAFBFC", borderRadius: 14, border: "1px solid #E2E8F0", marginBottom: 12, alignItems: "center" }} className="ds-grid">
        <div>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{p.icon}</div>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>{p.title}</h3>
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{p.desc}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: "#DC2626" }}>{p.stat}</div>
          <div style={{ fontSize: 11, color: "#64748B" }}>{p.statLabel}</div>
        </div>
      </div>)}

      {/* Patient Journey */}
      <div style={{ padding: 20, background: "#FFFBEB", borderRadius: 14, border: "1px solid #FDE68A", margin: "20px 0" }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: "#92400E", marginBottom: 6 }}>How {S.title.split(" ")[0]} Patients Choose a Practice</h3>
        <p style={{ fontSize: 13, color: "#78350F", lineHeight: 1.7, margin: 0 }}>{S.patientJourney}</p>
      </div>

      {/* Features */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, margin: "20px 0" }} className="ds-grid">
        {S.features.map(f => <div key={f.title} style={{ padding: 20, background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{f.title}</h3>
          <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{f.desc}</p>
        </div>)}
      </div>

      {/* ROI Calculator */}
      <div style={{ padding: 28, background: `linear-gradient(135deg, ${TD}08, ${TL}05)`, borderRadius: 14, textAlign: "center", margin: "20px 0" }}>
        <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>The math is simple.</h3>
        <p style={{ fontSize: 15, color: "#64748B", marginBottom: 16 }}>{S.roiCalc.label} captured by your AI assistant at 10pm:</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ padding: 16, background: "#fff", borderRadius: 10, minWidth: 120 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: T }}>${S.roiCalc.value.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: "#64748B" }}>case value</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 24, fontWeight: 900, color: "#94A3B8" }}>=</div>
          <div style={{ padding: 16, background: "#fff", borderRadius: 10, minWidth: 120 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: T }}>{S.roiCalc.months} months</div>
            <div style={{ fontSize: 12, color: "#64748B" }}>of Zidly paid for</div>
          </div>
        </div>
        <button className="ds-btn" style={{ marginTop: 20, fontSize: 16, padding: "16px 40px" }}>Start 14-Day Free Trial →</button>
        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 10 }}>$97/month. No contract. Cancel anytime.</p>
      </div>
    </div>
  </div>;
}
