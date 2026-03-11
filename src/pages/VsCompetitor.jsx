import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// ===== /vs/[slug] — Dynamic competitor comparison pages =====
// Production (Next.js): /pages/vs/[slug].jsx with getStaticPaths + getStaticProps
// Artifact (demo): hash-based routing with all data in one file
//
// Each URL is a separate indexed page to Google:
//   zidly.ai/vs/podium      → "Podium alternative"
//   zidly.ai/vs/birdeye     → "Birdeye alternative"  
//   zidly.ai/vs/thryv       → "Thryv alternative"
//   zidly.ai/vs/broadly     → "Broadly alternative"
//   zidly.ai/vs/nicejob     → "NiceJob alternative"
//   zidly.ai/vs/gatherup    → "GatherUp alternative"
//   zidly.ai/vs/weave       → "Weave alternative"
//   zidly.ai/vs/brightlocal → "BrightLocal alternative"

const T = "#0D9488", TD = "#0F766E", TL = "#14B8A6";

// ===== COMPETITOR DATA (one object per page) =====
const COMPETITORS = {

podium: {
  name: "Podium", logo: "💬", slug: "podium",
  meta: { title: "Zidly vs Podium — 3x Features, 1/3 the Price, No Contract", description: "Compare Zidly and Podium side by side. More features, transparent pricing, no 12-month lock-in. Switch in 5 minutes." },
  priceRange: "$249–$599/mo", priceStart: "$249", contract: "12-month minimum",
  cancellation: "Must call sales, difficult to cancel, auto-renews annually",
  whatTheyDo: "Messaging, webchat, reviews, payments. Core product is text-based communication with customers.",
  comparison: [
    ["AI Chatbot (trained on your business)", true, false, "Podium has basic webchat — not AI-trained on your data"],
    ["Review Management", true, true, ""],
    ["Review Request Automation", true, true, ""],
    ["SEO Site Audit (15+ checks)", true, false, ""],
    ["Schema Markup Generator", true, false, ""],
    ["Google Maps Rank Tracker", true, false, ""],
    ["AI Visibility Score (Gemini/AI Overviews)", true, false, "Zidly is the only platform scoring for AI search readiness"],
    ["Social Content Generator", true, false, ""],
    ["Blog & Article Writer", true, false, ""],
    ["Ad Campaign Builder", true, false, ""],
    ["Email Campaign Studio", true, false, ""],
    ["Competitor Deep Analysis", true, false, ""],
    ["Competitor Activity Tracking", true, false, ""],
    ["Revenue Loss Calculator", true, false, ""],
    ["BizScorer Free Audit", true, false, ""],
    ["QR Code Review Kit", true, true, ""],
    ["Lead Inbox (unified)", true, true, ""],
    ["Monthly ROI Reports", true, false, "Podium has basic analytics"],
    ["No Contract Required", true, false, "Podium requires 12-month minimum"],
    ["Transparent Pricing", true, false, "Podium hides pricing behind sales calls"],
    ["Cancel From Dashboard", true, false, "Podium requires calling sales to cancel"],
    ["Data Export", true, false, ""],
    ["Starting Price", "$97/mo", "$249/mo", ""],
  ],
  complaints: [
    { text: "Locked into a 12-month contract. Tried to cancel after month 3 when we realized it wasn't working. They wouldn't let us out.", stars: 2, source: "G2 Review" },
    { text: "Started at $249/mo. At renewal they bumped it to $350 with zero notice. When I pushed back, the 'discount' was still more than I originally paid.", stars: 1, source: "Capterra Review" },
    { text: "The webchat is basic. It's not trained on my business. When someone asks about insurance, it just says 'contact us'. That's not helpful.", stars: 3, source: "G2 Review" },
    { text: "Support was great during the sales process. After I signed the contract, response time went from hours to days.", stars: 2, source: "Trustpilot Review" },
  ],
  keyDiff: "Podium is a messaging tool that charges premium pricing behind a 12-month contract. Their basic plan ($249/mo) is messaging only — no SEO, no content, no competitor tracking. Zidly includes all of that plus an AI chatbot actually trained on your business data, for $97/mo with no contract.",
},

birdeye: {
  name: "Birdeye", logo: "🐦", slug: "birdeye",
  meta: { title: "Zidly vs Birdeye — Same Reviews, No 90-Day Cancel Window, 1/3 the Price", description: "Birdeye charges $299+/mo with a 90-day cancellation notice. Zidly starts at $97/mo, month-to-month. Full comparison inside." },
  priceRange: "$299–$449/mo", priceStart: "$299", contract: "Annual + 90-day cancellation notice",
  cancellation: "Written notice 90 days before renewal. Miss the window = locked in for another year.",
  whatTheyDo: "Review management, messaging, listings, surveys. Recently added AI review responses. Strong product, predatory contracts.",
  comparison: [
    ["AI Chatbot (trained on your business)", true, false, "Birdeye has basic webchat — not AI-trained"],
    ["Review Management", true, true, ""],
    ["Review Request Automation", true, true, ""],
    ["AI Review Responses", true, true, "Both offer AI-generated responses"],
    ["Listing Management", true, true, "Birdeye has multi-directory listing sync"],
    ["SEO Site Audit", true, false, ""],
    ["Schema Markup Generator", true, false, ""],
    ["Google Maps Rank Tracker", true, false, ""],
    ["AI Visibility Score", true, false, ""],
    ["Social Content Generator", true, false, ""],
    ["Blog & Article Writer", true, false, ""],
    ["Ad Campaign Builder", true, false, ""],
    ["Competitor Deep Analysis", true, true, "Birdeye has basic competitor benchmarks"],
    ["BizScorer Free Audit", true, false, ""],
    ["Revenue Loss Calculator", true, false, ""],
    ["No Contract Required", true, false, "Birdeye requires annual commitment"],
    ["Transparent Pricing", true, false, "Birdeye hides pricing behind sales calls"],
    ["No 90-Day Cancel Window", true, false, "You read that right — 90 days notice to cancel"],
    ["Per-Location Pricing", "Flat rate", true, "Multi-location costs multiply fast with Birdeye"],
    ["Starting Price", "$97/mo", "$299/mo", ""],
  ],
  complaints: [
    { text: "The 90-day cancellation notice is absurd. I tried to cancel 60 days before renewal and they said I was too late. Stuck for another year.", stars: 2, source: "G2 Review" },
    { text: "Price jumped from $299 to $399 at renewal with no warning. When I asked why, they said 'market adjustment.' That's a 33% increase.", stars: 2, source: "Capterra Review" },
    { text: "The platform is powerful but overwhelming. My front desk staff never learned to use half the features. We're paying for tools we don't touch.", stars: 3, source: "G2 Review" },
    { text: "Per-location pricing killed us. We have 3 locations — suddenly we're paying $900/month for what should be one platform.", stars: 2, source: "Trustpilot Review" },
  ],
  keyDiff: "Birdeye is a solid product trapped behind predatory contracts. The 90-day cancellation window is designed to make you miss it and auto-renew. Zidly gives you the same review management plus SEO, content, AI chatbot, and competitor tracking — at 1/3 the price, month-to-month.",
},

thryv: {
  name: "Thryv", logo: "📋", slug: "thryv",
  meta: { title: "Zidly vs Thryv — No Contracts, No BBB Complaints, Half the Price", description: "Thryv has 300+ BBB complaints about billing and cancellation. Zidly has zero. Compare features, pricing, and real user reviews." },
  priceRange: "$199–$499+/mo", priceStart: "$199", contract: "6-12 month contracts",
  cancellation: "Notoriously difficult. Multiple BBB complaints. Reports of being charged months after 'cancelling.'",
  whatTheyDo: "CRM, marketing automation, social media, website builder, online presence. Tries to be everything for small businesses.",
  comparison: [
    ["AI Chatbot (trained on your business)", true, false, "Thryv has basic live chat — not AI"],
    ["Review Management", true, true, ""],
    ["Review Request Automation", true, true, ""],
    ["CRM / Client Management", false, true, "Zidly focuses on growth — use your existing CRM"],
    ["Website Builder", false, true, "Thryv includes a basic site builder"],
    ["SEO Site Audit", true, false, ""],
    ["Schema Markup Generator", true, false, ""],
    ["AI Visibility Score", true, false, ""],
    ["Social Content Generator", true, true, "Thryv has basic social posting"],
    ["AI-Written Blog Content", true, false, ""],
    ["Competitor Intelligence", true, false, ""],
    ["BizScorer Free Audit", true, false, ""],
    ["No Contract Required", true, false, ""],
    ["Transparent Pricing", true, false, "Hidden behind sales demos"],
    ["Easy Cancellation", true, false, "Thryv has worst cancel reputation in industry"],
    ["BBB Complaints", "0", "300+", ""],
    ["Starting Price", "$97/mo", "$199/mo", ""],
  ],
  complaints: [
    { text: "This company is a SCAM. They signed me up for a contract I never agreed to and refused to cancel. I had to dispute charges with my bank.", stars: 1, source: "BBB Complaint" },
    { text: "Bait and switch. The demo looked great. The actual product is clunky and half the features don't work as shown. Then they won't let you cancel.", stars: 1, source: "G2 Review" },
    { text: "I've been trying to cancel for 3 months. Every time I call, they transfer me to 'retention' who offers a discount instead of canceling.", stars: 1, source: "Trustpilot Review" },
    { text: "They charged my card 2 months after I 'cancelled.' When I called, they said the cancellation didn't process. How convenient.", stars: 1, source: "BBB Complaint" },
  ],
  keyDiff: "Thryv tries to be everything and does nothing well. Their BBB complaint history speaks for itself — hundreds of reports about billing and cancellation nightmares. Zidly does fewer things but does them exceptionally, at half the price, with zero contract drama.",
},

broadly: {
  name: "Broadly", logo: "📡", slug: "broadly",
  meta: { title: "Zidly vs Broadly — No $350 Build-Out Fee, More Features, Less Money", description: "Broadly charges $249/mo plus a $350 build-out fee for reviews and chat. Zidly includes 34 tools for $97/mo. Compare now." },
  priceRange: "$249+/mo", priceStart: "$249", contract: "12-month contract + $350 build-out fee",
  cancellation: "Must call sales. Contract auto-renews. Build-out fee non-refundable.",
  whatTheyDo: "Reviews, webchat, payments, email/text campaigns. Focused on home services and automotive verticals.",
  comparison: [
    ["AI Chatbot (trained on your business)", true, false, "Broadly has basic webchat — not AI"],
    ["Review Management", true, true, ""],
    ["Review Request Automation", true, true, ""],
    ["Webchat / Messaging", true, true, ""],
    ["Payment Processing", false, true, "Broadly includes payment collection"],
    ["SEO Site Audit", true, false, ""],
    ["Schema Markup Generator", true, false, ""],
    ["AI Visibility Score", true, false, ""],
    ["Social Content Generator", true, false, ""],
    ["Competitor Intelligence", true, false, ""],
    ["Blog Writer", true, false, ""],
    ["BizScorer Free Audit", true, false, ""],
    ["No Contract Required", true, false, ""],
    ["No Build-Out Fee", true, false, "Broadly charges $350 upfront for setup"],
    ["Transparent Pricing", true, false, ""],
    ["Starting Price", "$97/mo", "$249/mo", ""],
  ],
  complaints: [
    { text: "The $350 build-out fee on TOP of the monthly fee felt like a cash grab. They basically just configured a chat widget.", stars: 2, source: "G2 Review" },
    { text: "Decent product but overpriced for what you get. It's really just reviews + chat. No SEO, no content, no competitor tracking.", stars: 3, source: "Capterra Review" },
    { text: "Contract auto-renewed and I didn't notice until I saw the charge. They wouldn't prorate or refund.", stars: 2, source: "G2 Review" },
    { text: "Good for reviews but that's about it. I was paying $249/mo for something I could replicate with a free Google review link.", stars: 3, source: "Trustpilot Review" },
  ],
  keyDiff: "Broadly is a reviews + chat tool priced at premium. The $350 build-out fee is pure margin on 30 minutes of config work. Zidly includes reviews, AI chatbot, SEO tools, content engine, and competitor tracking for $97/mo with a $99 setup — 72% cheaper.",
},

nicejob: {
  name: "NiceJob", logo: "👍", slug: "nicejob",
  meta: { title: "Zidly vs NiceJob — Everything NiceJob Does, Plus 30 More Tools", description: "NiceJob is great for reviews ($75/mo). Zidly does reviews PLUS AI chatbot, SEO, content, and competitor tracking for $97/mo." },
  priceRange: "$75–$125/mo", priceStart: "$75", contract: "Month-to-month (fair — credit to NiceJob)",
  cancellation: "Cancel anytime from dashboard. NiceJob is honest about this.",
  whatTheyDo: "Review collection, social proof widgets, review marketing. Very focused on doing one thing well — getting reviews.",
  comparison: [
    ["AI Chatbot", true, false, ""],
    ["Review Management", true, true, "NiceJob is excellent at reviews"],
    ["Review Request Automation", true, true, "NiceJob's core strength"],
    ["Social Proof Widgets", true, true, "NiceJob has nice embeddable review widgets"],
    ["SEO Site Audit", true, false, ""],
    ["Schema Markup Generator", true, false, ""],
    ["Google Maps Rank Tracker", true, false, ""],
    ["AI Visibility Score", true, false, ""],
    ["Social Content Generator", true, false, ""],
    ["Competitor Intelligence", true, false, ""],
    ["Revenue Loss Calculator", true, false, ""],
    ["Ad Campaign Builder", true, false, ""],
    ["Email Campaigns", true, false, ""],
    ["Blog Writer", true, false, ""],
    ["No Contract", true, true, "Both are month-to-month"],
    ["Transparent Pricing", true, true, "Both show pricing openly"],
    ["Starting Price", "$97/mo", "$75/mo", "NiceJob is $22 cheaper — for reviews only"],
  ],
  complaints: [
    { text: "Great for reviews but that's ALL it does. I still needed separate tools for SEO, social media, and a chatbot. It adds up.", stars: 4, source: "G2 Review" },
    { text: "Wish it had more features. The review automation is solid but I'm paying for 3 other tools to cover everything NiceJob doesn't.", stars: 3, source: "Capterra Review" },
    { text: "No competitor tracking, no SEO tools, no content generation. For a 'marketing platform' it only does one thing.", stars: 3, source: "G2 Review" },
    { text: "Love the product but outgrew it. Needed chatbot, SEO, and competitor intel. Had to switch to a platform that does everything.", stars: 4, source: "G2 Review" },
  ],
  keyDiff: "NiceJob is the one competitor I genuinely respect. Fair pricing, no contracts, excellent at reviews. But they ONLY do reviews. If you need a chatbot, SEO tools, content engine, competitor tracking, and AI visibility scoring — Zidly does all of that for $22/mo more. That's 30+ additional tools for less than a dollar a day.",
},

gatherup: {
  name: "GatherUp", logo: "📊", slug: "gatherup",
  meta: { title: "Zidly vs GatherUp — Same Price, 6x the Features", description: "GatherUp costs $99/mo for review monitoring. Zidly costs $97/mo for reviews + chatbot + SEO + content + competitor tracking." },
  priceRange: "$99–$175/mo", priceStart: "$99", contract: "Month-to-month or annual discount",
  cancellation: "Cancel anytime. Clean process. Credit to GatherUp.",
  whatTheyDo: "Review monitoring, review requests, NPS surveys, review marketing reports. Mid-market focus, agency-friendly.",
  comparison: [
    ["AI Chatbot", true, false, ""],
    ["Review Monitoring", true, true, "GatherUp's core strength"],
    ["Review Request Automation", true, true, ""],
    ["NPS Surveys", false, true, "GatherUp includes NPS"],
    ["SEO Site Audit", true, false, ""],
    ["Schema Markup Generator", true, false, ""],
    ["AI Visibility Score", true, false, ""],
    ["Social Content Generator", true, false, ""],
    ["Competitor Intelligence", true, false, ""],
    ["Blog Writer", true, false, ""],
    ["Revenue Radar", true, false, ""],
    ["Lead Capture (Chatbot)", true, false, ""],
    ["Ad Campaign Builder", true, false, ""],
    ["Transparent Pricing", true, true, "Both show pricing"],
    ["Starting Price", "$97/mo", "$99/mo", "Nearly identical — but Zidly has 6x the tools"],
  ],
  complaints: [
    { text: "Solid review tool but limited. No chatbot, no SEO, no content tools. For the same price I wanted more.", stars: 3, source: "G2 Review" },
    { text: "The reporting is good but the interface feels dated. Competitors have more modern UIs and more features for similar pricing.", stars: 3, source: "Capterra Review" },
    { text: "Used GatherUp for 2 years. Did reviews well but needed to add 3 other tools for everything else. Consolidated to one platform.", stars: 3, source: "G2 Review" },
  ],
  keyDiff: "GatherUp and Zidly are priced within $2/month of each other. The difference: GatherUp gives you review monitoring and NPS surveys. Zidly gives you review monitoring PLUS AI chatbot, SEO tools, content engine, competitor tracking, AI visibility scoring, and 25+ more tools. Same price. 6x the value.",
},

weave: {
  name: "Weave", logo: "🏥", slug: "weave",
  meta: { title: "Zidly vs Weave — No Hardware, No Annual Contract, 75% Less", description: "Weave costs $399+/mo and requires hardware installation. Zidly is $97/mo, software-only, live in 5 minutes." },
  priceRange: "$399+/mo", priceStart: "$399", contract: "Annual contract",
  cancellation: "Must call sales. Early termination fees reported. Hardware complicates switching.",
  whatTheyDo: "Phone system/VoIP, texting, reviews, payments, scheduling. Hardware-first — requires installing their phone equipment.",
  comparison: [
    ["AI Chatbot (trained on business)", true, false, "Weave has basic text — not AI-trained"],
    ["Phone System / VoIP", false, true, "Weave's core product"],
    ["Review Management", true, true, ""],
    ["Review Request Automation", true, true, ""],
    ["Payment Processing", false, true, ""],
    ["Appointment Scheduling", false, true, "Weave has built-in scheduling"],
    ["SEO Site Audit", true, false, ""],
    ["Schema Markup Generator", true, false, ""],
    ["AI Visibility Score", true, false, ""],
    ["Social Content Generator", true, false, ""],
    ["Competitor Intelligence", true, false, ""],
    ["Blog Writer", true, false, ""],
    ["No Hardware Required", true, false, "Weave requires phone hardware installation"],
    ["No Contract", true, false, ""],
    ["Setup in 5 Minutes", true, false, "Weave takes days-weeks for hardware install"],
    ["Starting Price", "$97/mo", "$399/mo", ""],
  ],
  complaints: [
    { text: "The phone system is great but the reviews and marketing features feel like afterthoughts. I'm paying $399/mo mostly for a phone.", stars: 3, source: "G2 Review" },
    { text: "Hardware installation was a nightmare. Took 3 weeks to get everything working. Then we were locked into a contract.", stars: 2, source: "Capterra Review" },
    { text: "Way too expensive for a practice our size. $399/mo for phone + reviews when I just needed reviews and a chatbot.", stars: 2, source: "G2 Review" },
    { text: "Good if you need a full phone system overhaul. Overkill if you just want online presence and review management.", stars: 3, source: "Trustpilot Review" },
  ],
  keyDiff: "Weave is a phone system that added marketing features as upsells. If you need a new phone system, consider Weave. If you need reviews, AI chatbot, SEO, content, and competitor tracking without hardware installation or annual contracts — Zidly does all of that for 75% less, live in 5 minutes.",
},

brightlocal: {
  name: "BrightLocal", logo: "📍", slug: "brightlocal",
  meta: { title: "Zidly vs BrightLocal — SEO + Reviews + Chatbot vs SEO-Only", description: "BrightLocal is a great SEO tool ($39-79/mo). Zidly adds AI chatbot, review automation, content, and competitor tracking for $97/mo." },
  priceRange: "$39–$79/mo", priceStart: "$39", contract: "Month-to-month. Fair and transparent.",
  cancellation: "Cancel anytime. Clean process. BrightLocal is honest.",
  whatTheyDo: "Local SEO audits, rank tracking, citation building, review monitoring. Pure SEO tool — no messaging, chat, content, or automation.",
  comparison: [
    ["AI Chatbot", true, false, ""],
    ["Review Monitoring", true, true, "BrightLocal monitors reviews"],
    ["Review Request Automation", true, false, "BrightLocal monitors — Zidly automates"],
    ["AI Review Responses", true, false, ""],
    ["Local Rank Tracking", true, true, "BrightLocal's core strength"],
    ["Citation / Listing Audit", true, true, "BrightLocal is excellent here"],
    ["SEO Site Audit", true, true, "Both offer audits"],
    ["Schema Markup Generator", true, false, ""],
    ["AI Visibility Score", true, false, ""],
    ["Social Content Generator", true, false, ""],
    ["Blog Writer", true, false, ""],
    ["Competitor Intelligence", true, true, "BrightLocal has competitor benchmarks"],
    ["Ad Campaign Builder", true, false, ""],
    ["Email Campaigns", true, false, ""],
    ["Revenue Loss Calculator", true, false, ""],
    ["Lead Capture", true, false, ""],
    ["No Contract", true, true, "Both month-to-month"],
    ["Starting Price", "$97/mo", "$39/mo", "BrightLocal is cheaper — SEO reporting only"],
  ],
  complaints: [
    { text: "Excellent for SEO data but that's it. No chatbot, no content tools, no review automation. I needed additional tools on top.", stars: 4, source: "G2 Review" },
    { text: "The rank tracking is solid but designed for SEO agencies, not business owners. Too technical for most of my clients.", stars: 3, source: "Capterra Review" },
    { text: "Great tool but I wish it did more. Reviews are monitor-only, no social content, no messaging. Had to add other platforms.", stars: 3, source: "G2 Review" },
  ],
  keyDiff: "BrightLocal is the best pure SEO reporting tool in the market. If you're an SEO agency analyzing data, it's the right choice. But business owners don't need raw data — they need results. Zidly packages SEO + reviews + chatbot + content + competitor tracking into one tool that grows your business, not just reports on it. The $58/mo difference gets you 20+ additional tools.",
},

}; // end COMPETITORS

// ===== SHARED RENDER COMPONENT =====
function VsPage({ comp }) {
  const C = comp;
  const zCount = C.comparison.filter(c => c[1] === true).length;
  const tCount = C.comparison.filter(c => c[2] === true).length;
  const savings = parseInt(C.priceStart.replace(/[^0-9]/g, "")) - 97;

  return <>
    {/* Hero */}
    <section style={{ padding: "48px 0 32px", textAlign: "center" }}>
      <div style={{ display: "inline-block", padding: "6px 16px", background: "#FEE2E2", borderRadius: 20, fontSize: 13, color: "#DC2626", fontWeight: 600, marginBottom: 16 }}>Switching from {C.name}?</div>
      <h1 style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.15, letterSpacing: -1.2, marginBottom: 14 }}>
        Zidly vs {C.name}:<br /><span style={{ color: T }}>{zCount} features vs {tCount}. ${savings}/mo saved.</span>
      </h1>
      <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.6, marginBottom: 24, maxWidth: 600, margin: "0 auto 24px" }}>{C.keyDiff}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="vs-btn">Try Zidly Free →</button>
        <a href="#table" style={{ display: "inline-flex", alignItems: "center", padding: "14px 28px", color: T, border: `2px solid ${T}`, borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", fontFamily: "inherit" }}>Full Comparison ↓</a>
      </div>
    </section>

    {/* Score Cards */}
    <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }} className="vs-grid">
      <div style={{ background: `${T}08`, border: `2px solid ${T}`, borderRadius: 14, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T, marginBottom: 6 }}>ZIDLY</div>
        <div style={{ fontSize: 42, fontWeight: 900, color: T }}>{zCount}</div>
        <div style={{ fontSize: 13, color: "#64748B" }}>features</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 10 }}>$97<span style={{ fontSize: 13, fontWeight: 500, color: "#64748B" }}>/mo</span></div>
        <div style={{ fontSize: 12, color: T, fontWeight: 600, marginTop: 4 }}>No contract · Cancel anytime</div>
      </div>
      <div style={{ background: "#FEF2F2", border: "2px solid #FECACA", borderRadius: 14, padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", marginBottom: 6 }}>{C.name.toUpperCase()}</div>
        <div style={{ fontSize: 42, fontWeight: 900, color: "#DC2626" }}>{tCount}</div>
        <div style={{ fontSize: 13, color: "#64748B" }}>features</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 10 }}>{C.priceStart}<span style={{ fontSize: 13, fontWeight: 500, color: "#64748B" }}>/mo</span></div>
        <div style={{ fontSize: 12, color: "#DC2626", fontWeight: 600, marginTop: 4 }}>{C.contract}</div>
      </div>
    </section>

    {/* Contract Warning */}
    {(C.contract.toLowerCase().includes("month") || C.contract.toLowerCase().includes("annual")) && <div style={{ padding: 16, background: "#FFF7ED", borderRadius: 10, border: "1px solid #FED7AA", marginBottom: 24 }}>
      <p style={{ fontSize: 13, color: "#9A3412", lineHeight: 1.6, margin: 0 }}>
        <strong>Contract alert:</strong> {C.name} requires {C.contract.toLowerCase()}. Cancellation: {C.cancellation} <strong>Zidly is month-to-month. Cancel from your dashboard.</strong>
      </p>
    </div>}

    {/* Comparison Table */}
    <section id="table" style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, textAlign: "center", marginBottom: 20 }}>Feature-by-feature comparison</h2>
      <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px", padding: "12px 16px", background: "#F8FAFC", fontWeight: 700, fontSize: 12, color: "#64748B" }}>
          <div>Feature</div><div style={{ textAlign: "center", color: T }}>Zidly</div><div style={{ textAlign: "center" }}>{C.name}</div>
        </div>
        {C.comparison.map((row, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 90px 90px", padding: "11px 16px", borderTop: "1px solid #E2E8F0", fontSize: 13, alignItems: "center" }}>
          <div>
            <span style={{ fontWeight: 500 }}>{row[0]}</span>
            {row[3] && <span style={{ display: "block", fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{row[3]}</span>}
          </div>
          <div style={{ textAlign: "center", fontSize: typeof row[1] === "string" ? 12 : 15, fontWeight: typeof row[1] === "string" ? 700 : 400, color: row[1] === true ? "#22C55E" : row[1] === false ? "#EF4444" : T }}>
            {row[1] === true ? "✓" : row[1] === false ? "✕" : row[1]}
          </div>
          <div style={{ textAlign: "center", fontSize: typeof row[2] === "string" ? 12 : 15, fontWeight: typeof row[2] === "string" ? 700 : 400, color: row[2] === true ? "#22C55E" : row[2] === false ? "#EF4444" : "#64748B" }}>
            {row[2] === true ? "✓" : row[2] === false ? "✕" : row[2]}
          </div>
        </div>)}
      </div>
    </section>

    {/* Real Complaints */}
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, textAlign: "center", marginBottom: 6 }}>What {C.name} users actually say</h2>
      <p style={{ textAlign: "center", fontSize: 13, color: "#64748B", marginBottom: 20 }}>From G2, Capterra, Trustpilot, and BBB</p>
      {C.complaints.map((c, i) => <div key={i} style={{ padding: 18, background: "#fff", borderRadius: 10, border: "1px solid #E2E8F0", borderLeft: `4px solid ${c.stars <= 2 ? "#EF4444" : "#EAB308"}`, marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: c.stars <= 2 ? "#DC2626" : "#EAB308", marginBottom: 4 }}>{"★".repeat(c.stars)}<span style={{ opacity: 0.2 }}>{"★".repeat(5 - c.stars)}</span></div>
        <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.65, fontStyle: "italic", margin: 0 }}>"{c.text}"</p>
        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 6, marginBottom: 0 }}>— {c.source}</p>
      </div>)}
    </section>

    {/* Final CTA */}
    <section style={{ padding: 32, background: `linear-gradient(135deg, ${TD}08, ${TL}05)`, borderRadius: 16, textAlign: "center", marginBottom: 40 }}>
      <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 10 }}>Ready to switch from {C.name}?</h2>
      <p style={{ fontSize: 15, color: "#64748B", marginBottom: 20 }}>14-day free trial. No credit card. No contract. Live in 5 minutes.</p>
      <button className="vs-btn" style={{ fontSize: 16, padding: "16px 40px" }}>Start Free Trial →</button>
      {savings > 0 && <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 12 }}>You'll save <strong style={{ color: T }}>${savings}/month</strong> from day one.</p>}
    </section>
  </>;
}

// ===== MAIN EXPORT =====
// In production (Next.js): export getStaticPaths + getStaticProps
// In artifact: hash-based routing
export default function VsCompetitorPage() {
  const { slug: urlSlug } = useParams();
  const [slug, setSlug] = useState(urlSlug && COMPETITORS[urlSlug] ? urlSlug : "podium");
  useEffect(() => {
    if (urlSlug && COMPETITORS[urlSlug]) setSlug(urlSlug);
  }, [urlSlug]);

  const comp = COMPETITORS[slug];
  if (!comp) return null;

  return <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: "#0F172A", background: "#fff", minHeight: "100vh" }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .vs-btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${TD}, ${TL}); color: #fff; border: none; border-radius: 10px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit; text-decoration: none; transition: transform 0.15s, box-shadow 0.15s; }
      .vs-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,148,136,0.3); }
      @media (max-width: 768px) { .vs-grid { grid-template-columns: 1fr !important; } }
    `}</style>

    {/* Nav with competitor tabs */}
    <nav style={{ borderBottom: "1px solid #E2E8F0", padding: "10px 16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg,${T},${TL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 13 }}>Z</div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>Zidly</span>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>vs {comp.name}</span>
        </div>
        <div style={{ display: "flex", gap: 3, overflowX: "auto" }}>
          {Object.entries(COMPETITORS).map(([k, v]) =>
            <button key={k} onClick={() => setSlug(k)} style={{ padding: "5px 10px", background: slug === k ? T : "transparent", color: slug === k ? "#fff" : "#94A3B8", border: `1px solid ${slug === k ? T : "transparent"}`, borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              {v.name}
            </button>
          )}
        </div>
      </div>
    </nav>

    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
      <VsPage comp={comp} />
    </div>

    <footer style={{ padding: "16px 24px", borderTop: "1px solid #E2E8F0", textAlign: "center", fontSize: 11, color: "#94A3B8" }}>
      <a href="https://zidly.ai" style={{ color: T, textDecoration: "none", fontWeight: 600 }}>Zidly</a> — AI-powered growth for local businesses ·
      {Object.values(COMPETITORS).map(c => <span key={c.slug}> <a href={`/vs/${c.slug}`} style={{ color: "#94A3B8", textDecoration: "none" }}>vs {c.name}</a> ·</span>)}
      <a href="/switch" style={{ color: "#94A3B8", textDecoration: "none" }}> Switch Guide</a>
    </footer>
  </div>;
}

// ===== NEXT.JS PRODUCTION EXPORT (uncomment when deploying) =====
/*
// /pages/vs/[slug].jsx

export async function getStaticPaths() {
  return {
    paths: Object.keys(COMPETITORS).map(slug => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const comp = COMPETITORS[params.slug];
  if (!comp) return { notFound: true };
  return { props: { comp } };
}

export default function VsPage({ comp }) {
  // Same component as above, but receives comp as prop from getStaticProps
  // Each page gets its own URL, meta tags, and is statically generated at build time
  return (
    <Head>
      <title>{comp.meta.title}</title>
      <meta name="description" content={comp.meta.description} />
      <meta property="og:title" content={comp.meta.title} />
      <meta property="og:description" content={comp.meta.description} />
      <link rel="canonical" href={`https://zidly.ai/vs/${comp.slug}`} />
    </Head>
    // ... render VsPage component
  );
}
*/
