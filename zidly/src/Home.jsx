import { useState, useEffect, useRef } from "react";
// ─── CONFIG ─────────────────────────────────────────────────────
const BRAND = {
  name: "Zidly",
  tagline: "The AI That Watches Your Business While You Sleep",
  phone: null, // never exposed
  contact: "Mike",
  site: "zidly.ai",
  price: 497,
  setup: 500,
  annualSave: "2 months free",
};
const TEAL = {
  50: "#f0fdfa", 100: "#ccfbf1", 200: "#99f6e4", 300: "#5eead4",
  400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e",
  800: "#115e59", 900: "#134e4a", 950: "#042f2e",
};
// ─── ICONS (inline SVG components) ──────────────────────────────
const Icon = ({ d, size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const PhoneIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const StarIcon = ({ size, className, filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);
const BotIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>;
const GlobeIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const CalendarIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>;
const ShieldIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>;
const ZapIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>;
const MessageIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>;
const CheckIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M20 6 9 17l-5-5"/></svg>;
const ArrowRightIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const MenuIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const XIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const ClockIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const BarChartIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
const UsersIcon = (p) => <svg xmlns="http://www.w3.org/2000/svg" width={p.size||24} height={p.size||24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={p.className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
// ─── ANIMATION HOOK ─────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}
const Fade = ({ children, delay = 0, direction = "up", className = "", style = {} }) => {
  const [ref, visible] = useInView();
  const dirs = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "none" };
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : dirs[direction],
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
};
// ─── STYLES ─────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
  :root {
    --teal-400: ${TEAL[400]};
    --teal-500: ${TEAL[500]};
    --teal-600: ${TEAL[600]};
    --bg: #0a0a0f;
    --bg-card: rgba(255,255,255,0.03);
    --bg-card-hover: rgba(255,255,255,0.06);
    --border: rgba(255,255,255,0.08);
    --border-hover: rgba(255,255,255,0.15);
    --text: #f0f0f5;
    --text-muted: #8a8a9a;
    --glass: rgba(255,255,255,0.04);
    --glass-strong: rgba(255,255,255,0.08);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body, #root { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  .font-display { font-family: 'Outfit', sans-serif; }
  .gradient-text {
    background: linear-gradient(135deg, ${TEAL[300]}, ${TEAL[500]}, ${TEAL[300]});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .glass {
    background: var(--glass);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .glass-strong {
    background: var(--glass-strong);
    border: 1px solid var(--border-hover);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
  }
  .glow-teal {
    box-shadow: 0 0 60px rgba(13,148,136,0.15), 0 0 120px rgba(13,148,136,0.05);
  }
  .glow-teal-strong {
    box-shadow: 0 0 40px rgba(13,148,136,0.3), 0 0 80px rgba(13,148,136,0.1);
  }
  .card-hover {
    transition: all 0.4s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    border-color: var(--border-hover);
    box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(13,148,136,0.08);
  }
  .btn-primary {
    background: linear-gradient(135deg, ${TEAL[600]}, ${TEAL[500]});
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'DM Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary:hover {
    box-shadow: 0 0 30px rgba(13,148,136,0.4), 0 0 60px rgba(13,148,136,0.15);
    transform: translateY(-2px);
  }
  .btn-outline {
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border-hover);
    padding: 14px 32px;
    border-radius: 50px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'DM Sans', sans-serif;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-outline:hover {
    background: rgba(255,255,255,0.05);
    border-color: var(--teal-500);
    box-shadow: 0 0 20px rgba(13,148,136,0.15);
  }
  .pulse-dot {
    animation: pulse-glow 2s ease-in-out infinite;
  }
  @keyframes pulse-glow {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(13,148,136,0.6); }
    50% { opacity: 0.6; box-shadow: 0 0 20px rgba(13,148,136,0.8); }
  }
  .float {
    animation: float 6s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  .scroll-line {
    animation: scroll-down 2s ease-in-out infinite;
  }
  @keyframes scroll-down {
    0% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(10px); }
  }
  @media (max-width: 768px) {
    .hero-grid { flex-direction: column !important; }
    .hero-stats { flex-direction: column !important; gap: 16px !important; }
    .nav-links { display: none !important; }
    .mobile-menu-btn { display: flex !important; }
    .services-grid { grid-template-columns: 1fr !important; }
    .features-grid { grid-template-columns: 1fr !important; }
    .pricing-grid { grid-template-columns: 1fr !important; }
    .testimonials-grid { grid-template-columns: 1fr !important; }
    .footer-grid { grid-template-columns: 1fr 1fr !important; }
    .cta-buttons { flex-direction: column !important; }
  }
`;
// ─── NAVBAR ─────────────────────────────────────────────────────
const NAV_LINKS = ["Services", "How It Works", "Pricing", "Reviews"];
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(10,10,15,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${TEAL[600]}, ${TEAL[400]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="font-display" style={{ color: "white", fontWeight: 800, fontSize: 16 }}>Z</span>
          </div>
          <span className="font-display" style={{ fontWeight: 700, fontSize: 22, color: "var(--text)" }}>Zidly</span>
        </a>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.3s" }}
              onMouseEnter={e => e.target.style.color = "var(--text)"}
              onMouseLeave={e => e.target.style.color = "var(--text-muted)"}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 14, display: "none" }} id="nav-cta-desktop"
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
            Get Started
          </button>
          <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 14 }}
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
            Get Started
          </button>
          <button className="mobile-menu-btn" onClick={() => setOpen(!open)}
            style={{ display: "none", background: "none", border: "none", color: "var(--text)", cursor: "pointer", padding: 8 }}>
            {open ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setOpen(false)}
              style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 15, fontWeight: 500, padding: "8px 0" }}>
              {l}
            </a>
          ))}
          <button className="btn-primary" style={{ width: "fit-content" }}
            onClick={() => { setOpen(false); document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}>
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}
// ─── HERO ───────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", top: "15%", left: "10%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${TEAL[600]}15, transparent 70%)`, filter: "blur(60px)", animation: "float 8s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${TEAL[400]}10, transparent 70%)`, filter: "blur(80px)", animation: "float 10s ease-in-out infinite reverse" }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", position: "relative", zIndex: 10, width: "100%" }}>
        <div className="hero-grid" style={{ display: "flex", gap: 64, alignItems: "center" }}>
          {/* Left */}
          <div style={{ flex: 1 }}>
            <Fade delay={0}>
              <div className="glass" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 50, marginBottom: 24 }}>
                <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: TEAL[500] }} />
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Powered by Advanced AI</span>
              </div>
            </Fade>
            <Fade delay={0.1}>
              <h1 className="font-display" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
                Never Miss a{" "}
                <span className="gradient-text">Customer</span>{" "}
                Again
              </h1>
            </Fade>
            <Fade delay={0.2}>
              <p style={{ fontSize: 18, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
                AI voice agents that answer every call. 5-star reviews on autopilot. A website that books appointments while you sleep. One platform. ${BRAND.price}/mo.
              </p>
            </Fade>
            <Fade delay={0.3}>
              <div className="cta-buttons" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button className="btn-primary" style={{ boxShadow: `0 0 50px rgba(13,148,136,0.35), 0 0 100px rgba(13,148,136,0.1)` }}
                  onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
                  Start Free Demo <ArrowRightIcon size={18} />
                </button>
                <button className="btn-outline"
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
                  <PhoneIcon size={18} /> See How It Works
                </button>
              </div>
            </Fade>
            <Fade delay={0.4}>
              <div className="hero-stats" style={{ display: "flex", gap: 40, marginTop: 56 }}>
                {[
                  { val: "500+", label: "Businesses Served" },
                  { val: "24/7", label: "AI Availability" },
                  { val: "4.9★", label: "Avg. Review Score" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: "var(--text)" }}>{s.val}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Fade>
          </div>
          {/* Right — visual card */}
          <Fade delay={0.3} direction="left" style={{ flex: 1 }}>
            <div className="float" style={{ position: "relative" }}>
              <div className="glass glow-teal" style={{ borderRadius: 20, padding: 2, overflow: "hidden" }}>
                <div style={{
                  borderRadius: 18,
                  background: "linear-gradient(180deg, rgba(13,148,136,0.08) 0%, rgba(10,10,15,0.95) 100%)",
                  padding: "40px 32px",
                  minHeight: 420,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}>
                  {/* Mock AI conversation */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${TEAL[600]}, ${TEAL[400]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BotIcon size={22} className="" style={{ color: "white" }} />
                      </div>
                      <div>
                        <div className="font-display" style={{ fontWeight: 700, fontSize: 16 }}>Sarah — AI Receptionist</div>
                        <div style={{ fontSize: 12, color: TEAL[400], display: "flex", alignItems: "center", gap: 6 }}>
                          <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL[400], display: "inline-block" }} />
                          Active now
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {[
                        { from: "ai", text: "Hi! Thanks for calling Sunrise Dental. This is Sarah — how can I help you today?" },
                        { from: "user", text: "I'd like to book a cleaning for next Tuesday." },
                        { from: "ai", text: "I have 10am and 2pm available Tuesday. Which works better?" },
                        { from: "user", text: "2pm please!" },
                        { from: "ai", text: "Done! You're booked for Tuesday at 2pm. You'll get a reminder text 24 hours before. Is there anything else I can help with?" },
                      ].map((m, i) => (
                        <div key={i} style={{
                          alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                          maxWidth: "80%",
                          padding: "12px 16px",
                          borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          background: m.from === "user" ? `linear-gradient(135deg, ${TEAL[600]}, ${TEAL[500]})` : "var(--glass-strong)",
                          border: m.from === "user" ? "none" : "1px solid var(--border)",
                          fontSize: 13,
                          lineHeight: 1.5,
                          color: m.from === "user" ? "white" : "var(--text)",
                          opacity: 0,
                          animation: `fadeInChat 0.5s ease ${0.5 + i * 0.6}s forwards`,
                        }}>
                          {m.text}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass" style={{ borderRadius: 14, padding: "14px 18px", marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>47 calls handled today</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>3 appointments booked in the last hour</div>
                    </div>
                    <span className="pulse-dot" style={{ width: 10, height: 10, borderRadius: "50%", background: TEAL[500] }} />
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </div>
      <style>{`
        @keyframes fadeInChat {
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
// ─── SERVICES ───────────────────────────────────────────────────
const SERVICES = [
  {
    icon: PhoneIcon,
    title: "AI Voice Receptionist",
    desc: "Answer every call 24/7. Book appointments, capture leads, answer FAQs — all in a natural, human-like voice trained on YOUR business.",
    features: ["24/7 Coverage", "Custom Voice & Gender", "3 Routing Modes", "Lead Capture"],
  },
  {
    icon: StarIcon,
    title: "Google Review Engine",
    desc: "Automatically collect 5-star reviews after every appointment. Route unhappy customers to private feedback. Respond to all reviews with AI.",
    features: ["Auto Review Requests", "Smart Star Routing", "AI Responses", "Review Monitoring"],
  },
  {
    icon: GlobeIcon,
    title: "Website + AI Chatbot",
    desc: "We build a premium website that converts — or add our AI chatbot to your existing site. It answers questions and books appointments 24/7.",
    features: ["High-End Design", "AI Chat Widget", "Mobile Optimized", "Lead Capture"],
  },
  {
    icon: CalendarIcon,
    title: "Booking + Auto Follow-Up",
    desc: "Customers book through AI, chatbot, or direct link. Automatic text reminders before appointments. Follow-up and review requests after.",
    features: ["Online Booking", "Text Reminders", "No-Show Recovery", "Auto Follow-Up"],
  },
];
function Services() {
  return (
    <section id="services" style={{ padding: "120px 0", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ color: TEAL[500], fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>What You Get</span>
            <h2 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 20 }}>
              One Package. <span className="gradient-text">Everything Included.</span>
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 17, maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
              No mix-and-match. No hidden fees. You get all four systems working together for ${BRAND.price}/month.
            </p>
          </div>
        </Fade>
        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {SERVICES.map((s, i) => (
            <Fade key={s.title} delay={i * 0.12}>
              <div className="glass card-hover" style={{ borderRadius: 20, padding: 32, height: "100%", position: "relative", overflow: "hidden" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: `linear-gradient(135deg, ${TEAL[600]}30, ${TEAL[400]}15)`,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
                }}>
                  <s.icon size={26} className="" style={{ color: TEAL[400] }} />
                </div>
                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>{s.desc}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                  {s.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text-muted)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: TEAL[500], flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${TEAL[600]}, ${TEAL[400]})`, opacity: 0, transition: "opacity 0.4s" }}
                  className="card-bottom-bar" />
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}
// ─── HOW IT WORKS ───────────────────────────────────────────────
const FEATURES = [
  { icon: ZapIcon, title: "5-Minute Setup", desc: "Tell us about your business. We configure everything. You're live the same day." },
  { icon: ShieldIcon, title: "Zero Missed Calls", desc: "Answer all calls, after-hours only, or as backup. You choose. Switch anytime." },
  { icon: BarChartIcon, title: "Real-Time Dashboard", desc: "Every call, review, booking, and lead — all in one place. Manage from your phone." },
  { icon: ClockIcon, title: "Always On", desc: "Your AI never sleeps, never takes a break, and never has a bad day. 24/7/365." },
  { icon: UsersIcon, title: "More 5-Star Reviews", desc: "Automated requests go out after every appointment. Watch your Google rating climb." },
  { icon: MessageIcon, title: "Smart Follow-Up", desc: "Text reminders, post-visit follow-ups, and no-show recovery — all automated." },
];
function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "120px 0", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: 64, alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 400px" }}>
            <Fade>
              <span style={{ color: TEAL[500], fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>Why Zidly</span>
              <h2 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 20 }}>
                Your Entire Front Office,{" "}
                <span className="gradient-text">Automated</span>
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 17, lineHeight: 1.7, marginBottom: 40 }}>
                Stop juggling five different tools. Zidly replaces your receptionist, review platform, website builder, and appointment system — all for less than a part-time hire.
              </p>
            </Fade>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Fade delay={0.15}>
                <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
                  <div className="font-display gradient-text" style={{ fontSize: 32, fontWeight: 800 }}>99.9%</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Uptime Guarantee</div>
                </div>
              </Fade>
              <Fade delay={0.25}>
                <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
                  <div className="font-display gradient-text" style={{ fontSize: 32, fontWeight: 800 }}>&lt;2s</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>AI Response Time</div>
                </div>
              </Fade>
            </div>
          </div>
          <div className="features-grid" style={{ flex: "1 1 500px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {FEATURES.map((f, i) => (
              <Fade key={f.title} delay={i * 0.08}>
                <div className="glass card-hover" style={{ borderRadius: 16, padding: 24 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `linear-gradient(135deg, ${TEAL[600]}20, ${TEAL[400]}10)`,
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                  }}>
                    <f.icon size={22} style={{ color: TEAL[400] }} />
                  </div>
                  <h3 className="font-display" style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
// ─── PRICING ────────────────────────────────────────────────────
const INCLUDES = [
  "AI Voice Receptionist (custom voice & gender)",
  "Google Review Automation & Management",
  "High-End Website OR Chatbot for Existing Site",
  "Online Booking System + Calendar Sync",
  "Automated Text Reminders (customizable timing)",
  "Post-Appointment Follow-Up Texts",
  "No-Show Recovery Texts",
  "AI Review Responses (approve or auto-send)",
  "Real-Time Dashboard + Mobile App",
  "Unlimited Calls, Chats & Bookings",
  "Dedicated Onboarding with Mike",
];
function Pricing() {
  return (
    <section id="pricing" style={{ padding: "120px 0", position: "relative" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ color: TEAL[500], fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>Simple Pricing</span>
            <h2 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 20 }}>
              One Plan. <span className="gradient-text">Everything Included.</span>
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 17, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
              No tiers. No upsells. No surprises. Every business gets the full platform.
            </p>
          </div>
        </Fade>
        <Fade delay={0.15}>
          <div className="glass-strong glow-teal" style={{ borderRadius: 24, padding: "48px 40px", position: "relative", overflow: "hidden" }}>
            {/* Top accent */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${TEAL[600]}, ${TEAL[400]}, ${TEAL[600]})` }} />
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div className="font-display" style={{ fontSize: 14, fontWeight: 600, color: TEAL[400], marginBottom: 12, textTransform: "uppercase", letterSpacing: 2 }}>The Zidly Plan</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                <span className="font-display" style={{ fontSize: 64, fontWeight: 900, color: "var(--text)" }}>${BRAND.price}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 18 }}>/month</span>
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 8 }}>
                + ${BRAND.setup} one-time setup &nbsp;·&nbsp; Annual: <span style={{ color: TEAL[400], fontWeight: 600 }}>2 months free</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14, marginBottom: 40 }}>
              {INCLUDES.map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${TEAL[600]}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CheckIcon size={14} style={{ color: TEAL[400] }} />
                  </div>
                  <span style={{ fontSize: 15, color: "var(--text)" }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <button className="btn-primary" style={{ padding: "16px 48px", fontSize: 16, boxShadow: `0 0 40px rgba(13,148,136,0.3)` }}>
                Book a Free Demo with Mike <ArrowRightIcon size={18} />
              </button>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 16 }}>No contracts. Cancel anytime. Setup in under 48 hours.</p>
            </div>
          </div>
        </Fade>
        {/* Value comparison */}
        <Fade delay={0.25}>
          <div className="glass" style={{ borderRadius: 16, padding: 32, marginTop: 32, textAlign: "center" }}>
            <p className="font-display" style={{ fontWeight: 700, fontSize: 18, marginBottom: 16 }}>What you'd pay separately:</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
              {[
                { label: "Part-time receptionist", price: "$1,500+" },
                { label: "Review software", price: "$200+" },
                { label: "Website design", price: "$3,000+" },
                { label: "Booking system", price: "$150+" },
              ].map(c => (
                <div key={c.label} style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  <span style={{ textDecoration: "line-through", color: "#ff6b6b" }}>{c.price}</span>
                  <span style={{ marginLeft: 6 }}>{c.label}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16, color: TEAL[400], fontWeight: 600, fontSize: 15 }}>All replaced by Zidly for ${BRAND.price}/mo</p>
          </div>
        </Fade>
      </div>
    </section>
  );
}
// ─── TESTIMONIALS ───────────────────────────────────────────────
const REVIEWS = [
  { name: "Sarah Mitchell", role: "Owner, Mitchell Dental", text: "We went from missing 30% of calls to capturing every single lead. Our reviews jumped from 3.8 to 4.9 stars in just 3 months.", initials: "SM" },
  { name: "David Chen", role: "CEO, Premier Auto Group", text: "The ROI speaks for itself. 400% increase in booked appointments and our Google ranking skyrocketed thanks to the review system.", initials: "DC" },
  { name: "Jessica Williams", role: "Director, Luxe Real Estate", text: "The AI handles our after-hours inquiries perfectly. It's like having a 24/7 sales team that never takes a day off.", initials: "JW" },
];
function Testimonials() {
  return (
    <section id="reviews" style={{ padding: "120px 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent, ${TEAL[600]}05, transparent)` }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10 }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{ color: TEAL[500], fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2 }}>Testimonials</span>
            <h2 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, marginTop: 16, marginBottom: 20 }}>
              Trusted by <span className="gradient-text">500+ Businesses</span>
            </h2>
          </div>
        </Fade>
        <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {REVIEWS.map((r, i) => (
            <Fade key={r.name} delay={i * 0.12}>
              <div className="glass card-hover" style={{ borderRadius: 20, padding: 32, height: "100%" }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                  {[1,2,3,4,5].map(s => (
                    <StarIcon key={s} size={18} filled style={{ color: TEAL[400] }} />
                  ))}
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${TEAL[600]}, ${TEAL[400]})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 14, color: "white",
                  }}>
                    {r.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{r.role}</div>
                  </div>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}
// ─── CTA ────────────────────────────────────────────────────────
function CTA() {
  return (
    <section style={{ padding: "80px 0 120px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
        <Fade>
          <div style={{
            borderRadius: 28, position: "relative", overflow: "hidden",
            background: `linear-gradient(135deg, ${TEAL[600]}15, ${TEAL[400]}08)`,
            border: `1px solid ${TEAL[600]}30`,
          }}>
            <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, borderRadius: "50%", background: `${TEAL[500]}10`, filter: "blur(80px)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, width: 200, height: 200, borderRadius: "50%", background: `${TEAL[400]}08`, filter: "blur(60px)" }} />
            <div style={{ position: "relative", zIndex: 10, padding: "64px 48px", textAlign: "center" }}>
              <h2 className="font-display" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 20 }}>
                Ready to <span className="gradient-text">Grow on Autopilot?</span>
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 17, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
                Book a free demo with Mike. He'll show you exactly how Zidly works for YOUR business. No pitch, no pressure — just answers.
              </p>
              <div className="cta-buttons" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                <button className="btn-primary" style={{ padding: "16px 40px", fontSize: 16, boxShadow: `0 0 40px rgba(13,148,136,0.3)` }}>
                  Book Your Free Demo <ArrowRightIcon size={18} />
                </button>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 20 }}>Free. No obligation. Takes 15 minutes.</p>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}
// ─── FOOTER ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "64px 0 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${TEAL[600]}, ${TEAL[400]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="font-display" style={{ color: "white", fontWeight: 800, fontSize: 14 }}>Z</span>
              </div>
              <span className="font-display" style={{ fontWeight: 700, fontSize: 20 }}>Zidly</span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              AI-powered growth platform for local businesses. Never miss a customer again.
            </p>
          </div>
          {[
            { title: "Product", links: ["AI Receptionist", "Review Engine", "Website Design", "Booking System"] },
            { title: "Company", links: ["About", "Contact", "Careers", "Blog"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontWeight: 600, fontSize: 14, marginBottom: 16 }}>{col.title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14, transition: "color 0.3s" }}
                      onMouseEnter={e => e.target.style.color = TEAL[400]}
                      onMouseLeave={e => e.target.style.color = "var(--text-muted)"}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>© 2026 Zidly. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Twitter", "LinkedIn", "Instagram"].map(s => (
              <a key={s} href="#" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 13, transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = TEAL[400]}
                onMouseLeave={e => e.target.style.color = "var(--text-muted)"}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
// ─── MAIN APP ───────────────────────────────────────────────────
export default function ZidlyHomepage() {
  // Load GHL Chat Widget
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widgets.leadconnectorhq.com/loader.js";
    script.setAttribute("data-resources-url", "https://widgets.leadconnectorhq.com/chat-widget/loader.js");
    script.setAttribute("data-widget-id", "69b45c714d840e6bfe368110");
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  return (
    <>
      <style>{css}</style>
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <Navbar />
        <Hero />
        <Services />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </>
  );
}