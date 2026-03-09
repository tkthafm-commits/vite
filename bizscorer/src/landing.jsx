// This file contains the new landing page components and data
// It will be imported into App.jsx

import { useState, useEffect, useRef } from "react";

/* ═══ ROTATING REVIEWS ═══ */
export const REVIEWS = [
  { name: "Dr. Sarah Mitchell", role: "Dentist", loc: "Houston, TX", text: "Found 6 issues I had no idea about. Fixed 3 in one hour. Phone started ringing more that same week.", stars: 5 },
  { name: "Mike Romano", role: "Restaurant Owner", loc: "Chicago, IL", text: "Showed me my competitor had 4x my Google reviews. Two months later, I passed them. Incredible tool.", stars: 5 },
  { name: "Jessica Chen", role: "Med Spa Owner", loc: "Los Angeles, CA", text: "We were invisible online. This audit showed exactly why. Our bookings are up 35% since fixing the issues.", stars: 5 },
  { name: "David Hernandez", role: "Personal Injury Lawyer", loc: "Miami, FL", text: "I was spending $3K/mo on ads but my website had no chat. Patients were leaving at midnight. Not anymore.", stars: 5 },
  { name: "Rachel Goldstein", role: "Veterinarian", loc: "Denver, CO", text: "The competitor comparison was eye-opening. I didn't realize how far behind we'd fallen on reviews.", stars: 5 },
  { name: "Tom Bradley", role: "Real Estate Agent", loc: "Phoenix, AZ", text: "Ran the audit on a Monday. Had my chatbot answering questions by Friday. Best ROI decision this year.", stars: 5 },
  { name: "Priya Patel", role: "Salon Owner", loc: "Atlanta, GA", text: "The after-hours comparison blew my mind. Customers were seeing a dead website while my competitor had live chat.", stars: 5 },
  { name: "James Wilson", role: "Auto Repair Shop", loc: "Dallas, TX", text: "Went from 12 Google reviews to 67 in 60 days using the action plan. Revenue is up 28%.", stars: 5 },
];

/* ═══ FLOATING STATS ═══ */
export const HERO_STATS = [
  { number: "98%", text: "of consumers research businesses online before visiting", source: "BrightLocal Consumer Survey 2025" },
  { number: "88%", text: "read Google reviews before choosing a local business", source: "BrightLocal / WiserNotify 2025" },
  { number: "31%", text: "more money spent at businesses with excellent reviews", source: "Podium Consumer Study" },
  { number: "94%", text: "of consumers avoid businesses after reading a bad review", source: "ReviewTrackers 2025" },
];

/* ═══ HOW IT WORKS STEPS ═══ */
export const STEPS = [
  { num: "01", title: "Enter your business name", desc: "Just type your business name and city. Our AI finds everything else — Google profile, website, social media, competitors.", icon: "🔍" },
  { num: "02", title: "AI scans everything", desc: "In about 60 seconds, we analyze your Google reviews, website quality, social media presence, and how you stack up against local competitors.", icon: "⚡" },
  { num: "03", title: "Get your score + action plan", desc: "See your score out of 100, what's hurting you, what's working, and a prioritized list of fixes — many you can do yourself for free.", icon: "📊" },
];

/* ═══ FAQ ═══ */
export const FAQS = [
  { q: "Is this really free?", a: "Yes. 100% free, no credit card, no signup required for your first audit. We make money when businesses choose to fix issues using Zidly's AI tools — but the audit itself costs you nothing." },
  { q: "How accurate is the score?", a: "Our AI searches the actual internet for your business — real Google reviews, real website data, real competitor information. It's not a guess. Every finding is based on verifiable data." },
  { q: "What happens with my data?", a: "We scan publicly available information about your business (the same things your customers see). We don't store personal data or share it with third parties." },
  { q: "How long does the scan take?", a: "About 60 seconds. Our AI runs 5 analysis phases — Google profile, website, social media, competitors, and then generates your personalized action plan." },
  { q: "Do I need to fix everything myself?", a: "No. Each recommendation includes a 'do it yourself' option with free copy-paste content, plus an option to automate it with Zidly if you'd rather not do it manually." },
];

/* ═══ ROTATING REVIEW COMPONENT ═══ */
export const RotatingReviews = () => {
  const [startIdx, setStartIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setStartIdx(i => (i + 3) % REVIEWS.length); setFade(true); }, 400);
    }, 6000);
    return () => clearInterval(t);
  }, []);
  const visible = [0,1,2].map(i => REVIEWS[(startIdx + i) % REVIEWS.length]);
  return (
    <div className="reviews-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:32, transition:"opacity 0.4s", opacity:fade?1:0 }}>
      {visible.map((r,i) => (
        <div key={startIdx+i}>
          <div style={{ display:"flex", gap:2, marginBottom:10 }}>{[1,2,3,4,5].map(j => <span key={j} style={{ color:"#facc15", fontSize:18 }}>★</span>)}</div>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:17, color:"#334155", lineHeight:1.6, fontStyle:"italic", marginBottom:14 }}>"{r.text}"</p>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:700, color:"#0f172a" }}>{r.name}</p>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#64748b" }}>{r.role} · {r.loc}</p>
        </div>
      ))}
    </div>
  );
};

/* ═══ FAQ ACCORDION ═══ */
export const FAQSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {FAQS.map((f, i) => (
        <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{ borderBottom: "1px solid #e2e8f0", cursor: "pointer", padding: "20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 17, fontWeight: 600, color: "#0f172a" }}>{f.q}</p>
            <span style={{ fontSize: 20, color: "#94a3b8", transform: open === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s" }}>+</span>
          </div>
          {open === i && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: "#475569", lineHeight: 1.7, marginTop: 10 }}>{f.a}</p>}
        </div>
      ))}
    </div>
  );
};

/* ═══ PRIVACY POLICY ═══ */
export const PRIVACY_TEXT = `
BizScorer Privacy Policy — Last updated March 2025

What We Collect: When you use BizScorer, we scan publicly available information about your business (Google Business Profile, website, social media pages). This is the same information any customer can see. If you provide your email address, we store it to send you your report.

What We Don't Collect: We do not collect passwords, financial information, or private business data. We do not install cookies for tracking. We do not sell or share your information with third parties.

Data Storage: Scan results are generated in real-time and are not permanently stored on our servers. Email addresses provided for report delivery are stored securely and can be deleted upon request.

Third-Party Services: We use Anthropic's Claude AI to power our analysis, Vercel for hosting, and Stripe for any payment processing. Each of these services has their own privacy policies.

Your Rights: You can request deletion of any data we hold about you by emailing privacy@zidly.ai. You can unsubscribe from any emails at any time.

Contact: For privacy questions, email privacy@zidly.ai.
`;

export const TERMS_TEXT = `
BizScorer Terms of Service — Last updated March 2025

Acceptance: By using BizScorer, you agree to these terms. If you disagree, please do not use the service.

Service Description: BizScorer provides AI-powered analysis of publicly available business information. Scores and recommendations are generated by artificial intelligence and should be considered guidance, not guarantees.

Accuracy: While we strive for accuracy, our AI analysis may contain errors. Scores are relative assessments, not absolute measures. We recommend verifying specific findings independently.

Free Service: The basic audit is free. Premium features may require payment. All paid services are processed through Stripe and subject to Stripe's terms.

Intellectual Property: The BizScorer tool, design, and methodology are owned by Zidly. Reports generated for your business are yours to use and share.

Limitation of Liability: BizScorer is provided "as is" without warranties. We are not liable for business decisions made based on our reports.

Changes: We may update these terms. Continued use constitutes acceptance.

Contact: For questions, email legal@zidly.ai.
`;
