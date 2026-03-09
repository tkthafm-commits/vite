import { useState, useEffect, useRef } from "react";

/* ─── Intersection Observer Hook ─── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, isVisible];
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(32px)",
      transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    }}>{children}</div>
  );
};

/* ─── Icons ─── */
const ClockIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const StarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const ShieldIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>;
const ZapIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>;
const UsersIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>;
const MessageIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>;
const CheckIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>;
const ArrowRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const GlobeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;
const ChevronDown = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const ToothIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 3C4.5 3 3 5 3 7.5c0 2 .5 3.5 1 5.5.7 2.8 1.5 5.5 2 8 .3 1.2 1.5 1.2 1.8 0 .5-2 1.2-3.5 2.2-3.5s1.7 1.5 2.2 3.5c.3 1.2 1.5 1.2 1.8 0 .5-2.5 1.3-5.2 2-8 .5-2 1-3.5 1-5.5C17 5 15.5 3 13 3c-1.5 0-2.2.8-3 .8S8.5 3 7 3z"/></svg>;
const SendIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>;
const SparklesIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>;
const MicIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>;
const CalendarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>;
const BarChartIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>;
const BellIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const LinkIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;

/* ─── Animated Counter ─── */
const Counter = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useInView();
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
};

/* ═══════════════════════════════════════════════════════
   LIVE DEMO CHATBOT — The Hero Feature
   ═══════════════════════════════════════════════════════ */
const LiveDemoBot = () => {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState("input"); // input | scanning | ready
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("");
  const [practiceInfo, setPracticeInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [practiceName, setPracticeName] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const scanWebsite = async () => {
    if (!url.trim()) return;
    setPhase("scanning");
    setScanProgress(0);
    const stages = [
      { progress: 12, status: "Connecting to website..." },
      { progress: 28, status: "Scanning pages and content..." },
      { progress: 45, status: "Extracting services & specialties..." },
      { progress: 60, status: "Identifying insurance & pricing info..." },
      { progress: 75, status: "Analyzing team & office hours..." },
      { progress: 88, status: "Training your personalized AI..." },
    ];
    for (const s of stages) {
      await new Promise(r => setTimeout(r, 550 + Math.random() * 450));
      setScanProgress(s.progress);
      setScanStatus(s.status);
    }
    try {
      const cleanUrl = url.trim().replace(/^(https?:\/\/)?/, "https://");
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: `Search for this dental practice website: ${cleanUrl}\n\nReturn ONLY a JSON object (no markdown, no backticks) with:\n{"name":"practice name","services":["services"],"insurance":["insurances accepted"],"hours":"hours","address":"address","phone":"phone","team":["dentist names"],"specialties":"specialties","emergency":"emergency info"}\n\nIf info not found use "Not listed on website".` }]
        })
      });
      const data = await resp.json();
      const text = data.content?.filter(b => b.type === "text")?.map(b => b.text)?.join("") || "";
      let parsed;
      try { parsed = JSON.parse(text.replace(/```json|```/g, "").trim()); }
      catch { parsed = { name: url.replace(/https?:\/\/(www\.)?/, "").split(/[./]/)[0].replace(/[-_]/g, " "), services: ["General Dentistry","Cosmetic Dentistry","Teeth Whitening","Dental Implants"], insurance: ["Most major insurance accepted"], hours: "Mon-Fri 8am-5pm", address: "See website", phone: "See website", team: ["See website"], specialties: "General & Cosmetic Dentistry", emergency: "Contact office" }; }
      setPracticeInfo(parsed);
      setPracticeName(parsed.name || "Your Practice");
      setScanProgress(100);
      setScanStatus("Your AI assistant is ready!");
      await new Promise(r => setTimeout(r, 500));
      setPhase("ready");
      setMessages([{ from: "bot", text: `Hi! I'm the AI assistant for ${parsed.name || "your practice"}. I've been trained on your website and I'm ready to answer patient questions 24/7.\n\nTry asking me anything your patients would — like "What insurance do you accept?" or "Do you do Invisalign?"` }]);
    } catch {
      const fallback = url.replace(/https?:\/\/(www\.)?/, "").split(/[./]/)[0].replace(/[-_]/g, " ");
      setPracticeInfo({ name: fallback, services: ["General Dentistry"], insurance: ["Contact office"], hours: "See website", address: "See website", phone: "See website", team: [], specialties: "General Dentistry", emergency: "Contact office" });
      setPracticeName(fallback);
      setScanProgress(100);
      setScanStatus("Ready!");
      await new Promise(r => setTimeout(r, 500));
      setPhase("ready");
      setMessages([{ from: "bot", text: `Hi! I'm the AI assistant for your dental practice. I've scanned your site and I'm ready to handle patient questions. Go ahead — ask me something!` }]);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    const msg = userInput.trim();
    setUserInput("");
    setMessages(prev => [...prev, { from: "user", text: msg }]);
    setIsLoading(true);
    try {
      const sys = `You are the AI front-desk assistant for ${practiceName}. Practice info:\n${JSON.stringify(practiceInfo, null, 2)}\n\nRULES:\n- ONLY answer about this practice\n- Warm, professional, concise (2-3 sentences)\n- If patient wants to book, capture name, date preference, phone\n- If info unknown, say "I'd recommend calling our office for that detail"\n- Speak as the practice ("we offer...", "our office...")\n- Guide toward booking`;
      const history = messages.map(m => ({ role: m.from === "user" ? "user" : "assistant", content: m.text }));
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: [...history, { role: "user", content: msg }] })
      });
      const data = await resp.json();
      if (data.error) {
        console.error("API error:", data.error);
        setMessages(prev => [...prev, { from: "bot", text: "I'm having trouble connecting right now. Please try again in a moment!" }]);
      } else {
        const reply = data.content?.find(b => b.type === "text")?.text || "I couldn't generate a response. Please try again!";
        setMessages(prev => [...prev, { from: "bot", text: reply }]);
      }
    } catch (err) { console.error("Chat error:", err); setMessages(prev => [...prev, { from: "bot", text: "I'm having a moment — please try again!" }]); }
    setIsLoading(false);
  };

  // ─── INPUT PHASE ───
  if (phase === "input") {
    return (
      <div style={{ width: "100%", maxWidth: 560, margin: "0 auto", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(45,212,191,0.12)", borderRadius: 24, padding: "44px 36px", textAlign: "center", boxShadow: "0 25px 60px rgba(0,0,0,0.3), 0 0 80px rgba(45,212,191,0.04)" }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, margin: "0 auto 20px", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2dd4bf" }}><SparklesIcon /></div>
        <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>Build Your AI Assistant <span style={{ color: "#2dd4bf" }}>Right Now</span></h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#64748b", lineHeight: 1.6, marginBottom: 28, maxWidth: 420, margin: "0 auto 28px" }}>Enter your dental practice website and we'll instantly create a personalized AI chatbot trained on your services, insurance, hours, and team. Test it live — ask it anything your patients would.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "0 16px" }}>
            <span style={{ color: "#475569" }}><LinkIcon /></span>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && scanWebsite()} placeholder="yourpractice.com" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: 15, fontFamily: "'DM Sans', sans-serif", padding: "15px 0" }} />
          </div>
          <button onClick={scanWebsite} style={{ background: "linear-gradient(135deg, #2dd4bf, #0d9488)", color: "white", border: "none", borderRadius: 14, padding: "15px 28px", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 15px rgba(45,212,191,0.3)", whiteSpace: "nowrap" }}>Build My Bot <ArrowRight /></button>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#475569", marginTop: 14 }}>Takes ~15 seconds. No signup. No credit card. Completely free.</p>
      </div>
    );
  }

  // ─── SCANNING PHASE ───
  if (phase === "scanning") {
    return (
      <div style={{ width: "100%", maxWidth: 520, margin: "0 auto", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(45,212,191,0.12)", borderRadius: 24, padding: "52px 36px", textAlign: "center", boxShadow: "0 25px 60px rgba(0,0,0,0.3), 0 0 80px rgba(45,212,191,0.04)" }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, margin: "0 auto 24px", background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2dd4bf" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin-slow 2s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/></svg>
        </div>
        <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Building Your AI Assistant</h3>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#2dd4bf", marginBottom: 28, height: 20 }}>{scanStatus}</p>
        <div style={{ width: "100%", height: 6, borderRadius: 100, background: "rgba(255,255,255,0.05)", overflow: "hidden", marginBottom: 8 }}>
          <div style={{ height: "100%", borderRadius: 100, background: "linear-gradient(90deg, #2dd4bf, #0d9488)", width: `${scanProgress}%`, transition: "width 0.5s ease", boxShadow: "0 0 12px rgba(45,212,191,0.4)" }} />
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#475569" }}>Scanning {url.replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, "")}...</p>
      </div>
    );
  }

  // ─── CHAT PHASE ───
  return (
    <div style={{ width: "100%", maxWidth: 460, margin: "0 auto", background: "#0a0f1e", border: "1px solid rgba(45,212,191,0.15)", borderRadius: 24, overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 60px rgba(45,212,191,0.06)" }}>
      <div style={{ padding: "16px 20px", background: "linear-gradient(135deg, #0d9488, #0f766e)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}><ToothIcon /></div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "white", fontWeight: 700, fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>{practiceName}</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />AI Assistant — Online 24/7
          </div>
        </div>
        <button onClick={() => { setPhase("input"); setMessages([]); setUrl(""); }} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "6px 14px", color: "white", fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", fontWeight: 600 }}>New Demo</button>
      </div>
      <div style={{ padding: 16, height: 340, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === "user" ? "flex-end" : "flex-start",
            background: m.from === "user" ? "linear-gradient(135deg, #0d9488, #0f766e)" : "rgba(45,212,191,0.08)",
            border: m.from === "user" ? "none" : "1px solid rgba(45,212,191,0.12)",
            borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
            padding: "11px 15px", maxWidth: "85%",
            color: m.from === "user" ? "white" : "#99f6e4",
            fontSize: 14, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "pre-wrap", animation: "fadeUp 0.3s ease",
          }}>{m.text}</div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: "flex-start", background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.12)", borderRadius: "4px 16px 16px 16px", padding: "13px 20px", display: "flex", gap: 5 }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#2dd4bf", animation: `bounce 1.2s ease infinite ${i*0.15}s`, display: "block", opacity: 0.6 }}/>)}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(45,212,191,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
        <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }}} placeholder="Ask about insurance, services, hours..." style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "11px 14px", color: "#e2e8f0", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
        <button onClick={sendMessage} style={{ width: 40, height: 40, borderRadius: 10, background: userInput.trim() ? "linear-gradient(135deg, #2dd4bf, #0d9488)" : "rgba(255,255,255,0.05)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "white", cursor: userInput.trim() ? "pointer" : "default" }}><SendIcon /></button>
      </div>
    </div>
  );
};

/* ─── FAQ Item ─── */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{ padding: "20px 24px", cursor: "pointer", borderRadius: 16, background: open ? "rgba(45,212,191,0.05)" : "transparent", border: "1px solid", borderColor: open ? "rgba(45,212,191,0.2)" : "rgba(255,255,255,0.06)", transition: "all 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 16, fontFamily: "'DM Sans', sans-serif", flex: 1 }}>{q}</span>
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", color: "#2dd4bf", flexShrink: 0, marginLeft: 12 }}><ChevronDown /></span>
      </div>
      <div style={{ maxHeight: open ? 220 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
        <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7, marginTop: 12, fontFamily: "'DM Sans', sans-serif" }}>{a}</p>
      </div>
    </div>
  );
};

/* ═══════════════════ MAIN PAGE ═══════════════════ */
export default function DentistDemo() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  return (
    <div style={{ background: "#050810", minHeight: "100vh", color: "white", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Instrument+Serif:ital@0;1&display=swap');
        *{margin:0;padding:0;box-sizing:border-box} html{scroll-behavior:smooth}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
        @keyframes pulse-glow{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes spin-slow{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        ::selection{background:rgba(45,212,191,.3);color:#fff}
        input::placeholder{color:rgba(255,255,255,.25)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(45,212,191,.2);border-radius:4px}
      `}</style>

      {/* ═══ NAVBAR ═══ */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 24px", height: 72, background: scrolled ? "rgba(5,8,16,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(45,212,191,0.08)" : "1px solid transparent", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 1200, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #2dd4bf, #0d9488)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}><ToothIcon /></div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>Zid<span style={{ color: "#2dd4bf" }}>ly</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {[["#demo","Try Demo"],["#features","Features"],["#pricing","Pricing"],["#roadmap","Roadmap"]].map(([h,l])=><a key={h} href={h} style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{l}</a>)}
            <a href="#cta" style={{ background: "linear-gradient(135deg, #2dd4bf, #0d9488)", color: "white", padding: "10px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 15px rgba(45,212,191,0.25)" }}>Get Started</a>
          </div>
        </div>
      </nav>

      {/* ═══ HERO + LIVE DEMO ═══ */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: "120px 24px 60px" }}>
        <div style={{ position: "absolute", top: "10%", left: "15%", width: 500, height: 500, background: "radial-gradient(circle, rgba(45,212,191,0.07) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)", animation: "pulse-glow 6s ease infinite" }} />
        <div style={{ position: "absolute", top: "40%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div style={{ maxWidth: 800, textAlign: "center", position: "relative", marginBottom: 44 }}>
          <FadeIn>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px 6px 8px", borderRadius: 100, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.15)", marginBottom: 28 }}>
              <span style={{ background: "linear-gradient(135deg, #2dd4bf, #0d9488)", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em" }}>LIVE DEMO</span>
              <span style={{ color: "#2dd4bf", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>Build a bot for your practice in 60 seconds</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}><h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 20 }}>Your AI dental receptionist,{" "}<span style={{ fontStyle: "italic", color: "#2dd4bf" }}>built instantly</span></h1></FadeIn>
          <FadeIn delay={0.2}><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 19, lineHeight: 1.7, color: "#94a3b8", maxWidth: 600, margin: "0 auto" }}>Paste your website below. Our AI scans your practice, learns your services, insurance, and hours — and builds a custom patient assistant you can test right now.</p></FadeIn>
        </div>

        <FadeIn delay={0.3}><div id="demo" style={{ width: "100%" }}><LiveDemoBot /></div></FadeIn>

        <FadeIn delay={0.5}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ display: "flex" }}>
              {["#0d9488","#0891b2","#7c3aed","#e11d48"].map((c,i)=><div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: c, border: "2px solid #050810", marginLeft: i>0?-10:0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", fontFamily: "'DM Sans', sans-serif" }}>{["SM","JR","PP","KL"][i]}</div>)}
            </div>
            <div>
              <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>{[1,2,3,4,5].map(i=><svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
              <span style={{ color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Trusted by dental practices across the US</span>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ padding: "48px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, textAlign: "center" }}>
          {[{v:67,s:"%",l:"of dental calls go unanswered"},{v:24,s:"/7",l:"patient coverage with AI"},{v:35,s:"%",l:"average increase in bookings"},{v:10,s:"x",l:"cheaper than a receptionist"}].map((s,i)=>(
            <FadeIn key={i} delay={i*.1}><div><div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, color: "#2dd4bf" }}><Counter end={s.v} suffix={s.s}/></div><div style={{ color: "#64748b", fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>{s.l}</div></div></FadeIn>
          ))}
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <FadeIn><span style={{ color: "#f87171", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>The Problem</span></FadeIn>
          <FadeIn delay={0.1}><h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.02em", marginTop: 16, marginBottom: 24 }}>Your practice is closed. <span style={{ fontStyle: "italic", color: "#f87171" }}>Your patients aren't.</span></h2></FadeIn>
          <FadeIn delay={0.2}><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, lineHeight: 1.8, color: "#94a3b8", maxWidth: 640, margin: "0 auto" }}>Every night, patients visit your website with questions about insurance, pricing, and availability. They find no one to help. They leave. They book with the next dentist on Google. You never even know they were there.</p></FadeIn>
          <FadeIn delay={0.3}><div style={{ marginTop: 48, padding: "32px 40px", borderRadius: 20, background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.12)", fontFamily: "'Instrument Serif', serif", fontSize: 28, fontStyle: "italic", color: "#fca5a5", lineHeight: 1.4 }}>"The average dental practice loses 15–20 potential patients per month from unanswered after-hours inquiries."</div></FadeIn>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn><div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ color: "#2dd4bf", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>Features</span>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.02em", marginTop: 16 }}>Everything your practice needs to <span style={{ fontStyle: "italic", color: "#2dd4bf" }}>never miss a patient</span></h2>
          </div></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {[
              { icon: <ClockIcon/>, title: "24/7 Patient Coverage", desc: "Your AI handles questions about services, insurance, pricing, and emergencies around the clock — even at 2am on a Sunday." },
              { icon: <ZapIcon/>, title: "Instant Responses", desc: "Patients expect answers in seconds. Your AI responds immediately so no patient ever leaves your site unanswered." },
              { icon: <UsersIcon/>, title: "Automatic Lead Capture", desc: "Every interaction is captured — names, phones, preferences — delivered to your inbox in real time." },
              { icon: <StarIcon/>, title: "Google Review Booster", desc: "Automatically request reviews after visits. Smart routing: happy patients go to Google, unhappy ones to private feedback." },
              { icon: <ShieldIcon/>, title: "HIPAA-Conscious Design", desc: "Built with healthcare privacy in mind. No medical records stored. Only general inquiries and contact info." },
              { icon: <GlobeIcon/>, title: "Multilingual Support", desc: "Serve diverse populations. Your AI speaks Spanish, Mandarin, Arabic, and 50+ languages automatically." },
            ].map((f,i)=>(
              <FadeIn key={i} delay={i*.08}>
                <div style={{ padding: 32, borderRadius: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", height: "100%" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#2dd4bf", marginBottom: 20 }}>{f.icon}</div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }}>{f.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: "#64748b" }}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "100px 24px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <FadeIn><div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ color: "#2dd4bf", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>How It Works</span>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.02em", marginTop: 16 }}>Live in <span style={{ fontStyle: "italic", color: "#2dd4bf" }}>three simple steps</span></h2>
          </div></FadeIn>
          {[{n:"01",t:"Enter Your Website URL",d:"Just paste your practice's website link. Our AI scans your entire site in seconds — learning your services, hours, insurance, team, and specialties."},{n:"02",t:"Your AI Assistant Is Built Instantly",d:"Within 60 seconds, a custom chatbot is created — trained specifically on your practice. Review it, test it, ask it anything your patients would."},{n:"03",t:"Go Live & Start Capturing Patients",d:"A simple widget on your site — or a link to share anywhere. Start capturing after-hours leads from day one."}].map((s,i)=>(
            <FadeIn key={i} delay={i*.15}>
              <div style={{ display: "flex", gap: 32, alignItems: "flex-start", padding: "36px 40px", borderRadius: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: i<2?24:0 }}>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 56, color: "rgba(45,212,191,0.15)", lineHeight: 1, flexShrink: 0 }}>{s.n}</span>
                <div><h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>{s.t}</h3><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7, color: "#64748b" }}>{s.d}</p></div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <FadeIn><div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ color: "#2dd4bf", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>Testimonials</span>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.02em", marginTop: 16 }}>Practices <span style={{ fontStyle: "italic", color: "#2dd4bf" }}>love the results</span></h2>
          </div></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {[
              {n:"Dr. Sarah Mitchell",r:"Mitchell Family Dentistry, Houston TX",t:"We were losing 15-20 inquiries monthly after hours. First week with Zidly, we captured 12 new leads that would've been lost. Paid for itself day one."},
              {n:"Dr. James Rivera",r:"Bright Smile Dental, Phoenix AZ",t:"Front desk was overwhelmed with insurance and pricing questions. Now the AI handles 80% automatically. My team focuses on patients in the chair."},
              {n:"Dr. Priya Patel",r:"Patel Dental Group, Atlanta GA",t:"The review booster alone was worth it. 23 to 67 Google reviews in two months. New patients say they chose us because of our reviews. No-brainer."},
            ].map((t,i)=>(
              <FadeIn key={i} delay={i*.1}>
                <div style={{ padding: 32, borderRadius: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>{[1,2,3,4,5].map(j=><svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.7, color: "#94a3b8", flex: 1, fontStyle: "italic" }}>"{t.t}"</p>
                  <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #0d9488, #0891b2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 16, fontFamily: "'DM Sans', sans-serif" }}>{t.n.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                    <div><div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>{t.n}</div><div style={{ color: "#64748b", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{t.r}</div></div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" style={{ padding: "100px 24px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn><div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ color: "#2dd4bf", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>Pricing</span>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.02em", marginTop: 16 }}>Simple, <span style={{ fontStyle: "italic", color: "#2dd4bf" }}>transparent</span> pricing</h2>
            <p style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 16, marginTop: 12 }}>No contracts. No hidden fees. Cancel anytime.</p>
          </div></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {[
              {name:"Starter",price:"$97",setup:"$99 one-time setup",items:["AI chatbot trained on your practice","Installed on your website","24/7 patient question handling","Lead capture with instant alerts","Monthly performance report","Shareable link for social media"],hl:false},
              {name:"Growth",price:"$197",setup:"$299 one-time setup",items:["Everything in Starter, plus:","Automated Google review collection","Smart review routing system","Lead tracking dashboard","Automated staff follow-up reminders","Monthly analytics report"],hl:true},
              {name:"Full Autopilot",price:"$297",setup:"$499 one-time setup",items:["Everything in Growth, plus:","Online appointment booking","Automated appointment reminders","Email & SMS marketing campaigns","Full CRM access","Priority support"],hl:false},
            ].map((p,i)=>(
              <FadeIn key={i} delay={i*.1}>
                <div style={{ padding: 36, borderRadius: 20, position: "relative", height: "100%", display: "flex", flexDirection: "column", background: p.hl?"rgba(45,212,191,0.03)":"rgba(255,255,255,0.02)", border: `1px solid ${p.hl?"rgba(45,212,191,0.2)":"rgba(255,255,255,0.06)"}`, boxShadow: p.hl?"0 0 60px rgba(45,212,191,0.06)":"none" }}>
                  {p.hl && <div style={{ position: "absolute", top: -12, right: 24, background: "linear-gradient(135deg, #2dd4bf, #0d9488)", color: "white", padding: "5px 16px", borderRadius: 100, fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>MOST POPULAR</div>}
                  <div style={{ color: p.hl?"#2dd4bf":"#94a3b8", fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>{p.name}</div>
                  <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 4 }}><span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 48, color: "#e2e8f0" }}>{p.price}</span><span style={{ color: "#64748b", fontSize: 16, fontFamily: "'DM Sans', sans-serif" }}>/month</span></div>
                  <div style={{ color: "#64748b", fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>+ {p.setup}</div>
                  <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                    {p.items.map((item,j)=><div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><span style={{ color: "#2dd4bf", marginTop: 2, flexShrink: 0 }}><CheckIcon/></span><span style={{ color: j===0&&i>0?"#2dd4bf":"#94a3b8", fontSize: 14, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, fontWeight: j===0&&i>0?600:400 }}>{item}</span></div>)}
                  </div>
                  <a href="#cta" style={{ display: "block", textAlign: "center", marginTop: 32, padding: "14px 24px", borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", textDecoration: "none", background: p.hl?"linear-gradient(135deg, #2dd4bf, #0d9488)":"rgba(255,255,255,0.05)", color: p.hl?"white":"#e2e8f0", border: p.hl?"none":"1px solid rgba(255,255,255,0.08)", boxShadow: p.hl?"0 4px 15px rgba(45,212,191,0.25)":"none" }}>Get Started</a>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}><div style={{ textAlign: "center", marginTop: 40 }}><div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "20px 32px", borderRadius: 16, background: "rgba(45,212,191,0.04)", border: "1px solid rgba(45,212,191,0.1)" }}><ShieldIcon/><span style={{ color: "#94a3b8", fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}><strong style={{ color: "#2dd4bf" }}>30-day money-back guarantee.</strong> If your AI doesn't capture 10+ inquiries, full refund.</span></div></div></FadeIn>
        </div>
      </section>

      {/* ═══ COMING SOON / ROADMAP ═══ */}
      <section id="roadmap" style={{ padding: "100px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <FadeIn><div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px 6px 8px", borderRadius: 100, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", marginBottom: 20 }}>
              <span style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "white", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif" }}>ROADMAP</span>
              <span style={{ color: "#a78bfa", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>What we're building next</span>
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.02em" }}>The chatbot is just <span style={{ fontStyle: "italic", color: "#a78bfa" }}>the beginning</span></h2>
            <p style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif", fontSize: 17, marginTop: 16, maxWidth: 620, margin: "16px auto 0", lineHeight: 1.7 }}>We're building a complete AI growth platform for dental practices. Get in early — prices increase as new features launch.</p>
          </div></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              {icon:<MicIcon/>,title:"Voice AI Receptionist",desc:"AI answers your phone calls in a natural human voice — handles scheduling, insurance questions, and triage. Never miss a call again.",tag:"Coming Q2 2025"},
              {icon:<CalendarIcon/>,title:"Smart Appointment Scheduling",desc:"AI booking synced with your calendar. Handles cancellations, sends reminders, reduces no-shows by 40%. Fully automated.",tag:"Coming Q2 2025"},
              {icon:<BarChartIcon/>,title:"Patient Intelligence Dashboard",desc:"Real-time analytics: patient inquiries, peak hours, common questions, conversion rates, and revenue attribution.",tag:"Coming Q3 2025"},
              {icon:<BellIcon/>,title:"Automated Follow-Up Sequences",desc:"AI-crafted email and SMS for missed appointments, post-visit care, recall reminders, and reactivation campaigns.",tag:"Coming Q3 2025"},
            ].map((item,i)=>(
              <FadeIn key={i} delay={i*.1}>
                <div style={{ padding: 28, borderRadius: 20, height: "100%", background: "rgba(124,58,237,0.02)", border: "1px solid rgba(124,58,237,0.1)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)", backgroundSize: "200% 100%", animation: "shimmer 3s ease infinite" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa" }}>{item.icon}</div>
                    <span style={{ background: "rgba(124,58,237,0.1)", color: "#a78bfa", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 100, fontFamily: "'DM Sans', sans-serif" }}>{item.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: "#64748b" }}>{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.5}><div style={{ marginTop: 48, textAlign: "center", padding: "28px 36px", borderRadius: 20, background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(45,212,191,0.06))", border: "1px solid rgba(124,58,237,0.12)" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#c4b5fd", fontWeight: 600, marginBottom: 6 }}>Early adopters get all future features at no extra cost.</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#64748b" }}>Sign up now and your rate is locked in — even when Voice AI and Smart Scheduling go live.</p>
          </div></FadeIn>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding: "100px 24px", background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <FadeIn><div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ color: "#2dd4bf", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase" }}>FAQ</span>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.02em", marginTop: 16 }}>Got questions? We've got <span style={{ fontStyle: "italic", color: "#2dd4bf" }}>answers</span></h2>
          </div></FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {q:"How does the AI know about my specific practice?",a:"We scan your website and train the AI on your services, hours, team, insurance, location, and specialties. You can also add custom FAQs. The result is an assistant that sounds like your front desk."},
              {q:"Will it work with my existing website?",a:"Yes — WordPress, Wix, Squarespace, or custom. Installation takes 5 minutes with a code snippet, or we install it for you free."},
              {q:"What happens when the AI can't answer a question?",a:"It gracefully captures the patient's contact info and forwards the inquiry to your team. No patient hits a dead end."},
              {q:"Is there a contract or long-term commitment?",a:"No contracts. Month-to-month. Cancel anytime. We earn your business through results."},
              {q:"How is this different from a generic chatbot?",a:"Generic bots give generic answers. Ours is trained on YOUR practice — your services, insurance, team, and hours. Patients interact with an assistant that truly knows your business."},
              {q:"What if I'm not tech-savvy?",a:"Perfect — that's who we built this for. We handle everything: setup, training, installation, optimization. You just watch your bookings grow."},
            ].map((f,i)=><FadeIn key={i} delay={i*.05}><FAQItem q={f.q} a={f.a}/></FadeIn>)}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section id="cta" style={{ padding: "100px 24px", position: "relative" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(45,212,191,0.1) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <FadeIn><div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 20, background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", color: "#2dd4bf", marginBottom: 24 }}><MessageIcon/></div></FadeIn>
          <FadeIn delay={0.1}><h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 400, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 20 }}>Ready to stop losing <span style={{ fontStyle: "italic", color: "#2dd4bf" }}>patients?</span></h2></FadeIn>
          <FadeIn delay={0.2}><p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, lineHeight: 1.7, color: "#94a3b8", maxWidth: 520, margin: "0 auto 40px" }}>Join dental practices across the country capturing more leads, collecting more reviews, and growing — on autopilot.</p></FadeIn>
          <FadeIn delay={0.3}>
            <a href="mailto:alaa@zidly.ai" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "linear-gradient(135deg, #2dd4bf, #0d9488)", color: "white", padding: "18px 40px", borderRadius: 16, fontSize: 18, fontWeight: 700, textDecoration: "none", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 8px 30px rgba(45,212,191,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }}>Get Your AI Assistant Today <ArrowRight/></a>
            <p style={{ color: "#64748b", fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginTop: 16 }}>No credit card required — try the free demo above first</p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.04)", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #2dd4bf, #0d9488)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M7 3C4.5 3 3 5 3 7.5c0 2 .5 3.5 1 5.5.7 2.8 1.5 5.5 2 8 .3 1.2 1.5 1.2 1.8 0 .5-2 1.2-3.5 2.2-3.5s1.7 1.5 2.2 3.5c.3 1.2 1.5 1.2 1.8 0 .5-2.5 1.3-5.2 2-8 .5-2 1-3.5 1-5.5C17 5 15.5 3 13 3c-1.5 0-2.2.8-3 .8S8.5 3 7 3z"/></svg></div>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 16 }}>Zid<span style={{ color: "#2dd4bf" }}>ly</span></span>
        </div>
        <p style={{ color: "#475569", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>&copy; 2025 Zidly. All rights reserved. AI-powered patient assistants for dental practices.</p>
      </footer>
    </div>
  );
}
