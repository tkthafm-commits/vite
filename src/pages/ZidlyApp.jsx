import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ========== THEME ==========
const T = "#0D9488", TL = "#14B8A6", TD = "#0F766E", SB = "#0A0F1E", SH = "#111827";
const PG = "#F8FAFC", CD = "#FFFFFF", TX = "#0F172A", TG = "#64748B", TM = "#94A3B8", BD = "#E2E8F0";
const TC = { Core: T, Plus: "#7C3AED", Pro: "#D97706", Elite: "#DC2626" };

const INDUSTRIES = [
  {v:"dental",l:"Dental"},{v:"restaurant",l:"Restaurant"},{v:"salon",l:"Salon / Spa"},
  {v:"medical",l:"Medical / Clinic"},{v:"legal",l:"Law Firm"},{v:"fitness",l:"Gym / Fitness"},
  {v:"homeservice",l:"Home Services"},{v:"retail",l:"Retail / E-commerce"},
  {v:"realestate",l:"Real Estate"},{v:"general",l:"General / Other"}
];

// ========== SHARED CONTEXT ==========
const BizCtx = createContext(null);
const LeadCtx = createContext({ leads: [], addLead: () => {}, updateLeadStatus: () => {} });
const ProofCtx = createContext({ counts: {}, bump: () => {} });

// ========== API ==========
async function ask(prompt, sys, highTokens = false) {
  try {
    const body = { model: "claude-sonnet-4-20250514", max_tokens: highTokens ? 8000 : 4000,
      messages: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search_20250305", name: "web_search" }] };
    if (sys) body.system = sys;
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) {
      if (r.status === 429) return "⚠️ Rate limited. Wait 30 seconds and try again.";
      if (r.status >= 500) return "⚠️ Server error. Try again in a moment.";
      return `⚠️ Error (${r.status}). Try again.`;
    }
    const d = await r.json();
    return (d.content || []).filter(b => b.type === "text").map(b => b.text).join("\n") || "No results found.";
  } catch (e) {
    if (e.message?.includes("fetch")) return "⚠️ Network error. Check connection.";
    return "⚠️ Unexpected error. Try again.";
  }
}

async function askChat(messages, sys) {
  try {
    const body = { model: "claude-sonnet-4-20250514", max_tokens: 1000, messages, system: sys };
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) return "Sorry, having trouble connecting. Try again.";
    const d = await r.json();
    return (d.content || []).filter(b => b.type === "text").map(b => b.text).join("\n") || "Not sure how to answer. Rephrase?";
  } catch { return "Connection issue. Try again."; }
}

// ========== UI ==========
// Fix #15: Safe clipboard
const CopyBtn = ({ text, label }) => { const [c, setC] = useState(false); return <button onClick={(e) => { e.stopPropagation(); try { navigator.clipboard.writeText(text).then(() => { setC(true); setTimeout(() => setC(false), 1500); }).catch(() => {}); } catch {} }} style={{ background: c ? T : "transparent", color: c ? "#fff" : TG, border: `1px solid ${c ? T : BD}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s", whiteSpace: "nowrap" }}>{c ? "✓ Copied" : (label || "Copy")}</button>; };

// Fix #2: XSS-safe markdown renderer
function Md({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  return <div style={{ fontSize: 13, lineHeight: 1.75, color: TX }}>{lines.map((line, i) => {
    // Escape HTML first to prevent XSS
    let html = line.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    // Links first (before bold/italic transforms touch the text)
    html = html.replace(/(https?:\/\/[^\s&]+)/g, '⟦LINK:$1⟧');
    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    // Italic
    html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
    // Restore links as clickable anchors
    html = html.replace(/⟦LINK:(.*?)⟧/g, '<a href="$1" target="_blank" rel="noopener" style="color:#0D9488;text-decoration:underline;word-break:break-all">$1</a>');
    // Bullet
    if (html.match(/^[-•]\s/)) html = "  •  " + html.replace(/^[-•]\s*/, "");
    // Numbered
    if (html.match(/^\d+\.\s/)) html = "  " + html;
    if (html.trim() === "") return <div key={i} style={{ height: 8 }} />;
    return <div key={i} dangerouslySetInnerHTML={{ __html: html }} />;
  })}</div>;
}

// Fix #8: Card with regen-aware saved state
function Card({ title, content, i, genId }) {
  const [o, setO] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(content);
  const [saved, setSaved] = useState(false);
  // Reset on new generation (genId changes) or content change when not saved
  useEffect(() => { setEditText(content); setSaved(false); setEditing(false); }, [genId, content]);
  const displayText = saved ? editText : content;

  return <div style={{ background: CD, borderRadius: 10, border: `1px solid ${editing ? T : BD}`, marginBottom: 12, overflow: "hidden", animation: `su .3s ease ${(i||0)*.05}s both` }}>
    <div onClick={() => !editing && setO(!o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderBottom: o ? `1px solid ${editing ? T+"30" : BD}` : "none", cursor: editing ? "default" : "pointer" }}>
      <span style={{ fontWeight: 700, fontSize: 13, color: TX }}>{title}</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }} onClick={e => e.stopPropagation()}>
        <CopyBtn text={displayText} />
        <button onClick={() => {
          if (editing) { setSaved(true); setEditing(false); }
          else { setEditing(true); setO(true); }
        }} style={{ background: editing ? T : "transparent", color: editing ? "#fff" : TG, border: `1px solid ${editing ? T : BD}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          {editing ? "Save" : "Edit"}</button>
        {!editing && <span style={{ color: TM, fontSize: 14 }}>{o ? "−" : "+"}</span>}
      </div>
    </div>
    {o && (editing
      ? <textarea value={editText} onChange={e => setEditText(e.target.value)} style={{ width: "100%", padding: "12px 16px", fontSize: 13, lineHeight: 1.75, color: TX, border: "none", borderTop: `1px solid ${T}30`, outline: "none", fontFamily: "inherit", minHeight: 120, resize: "vertical", background: `${T}04`, boxSizing: "border-box" }} />
      : <div style={{ padding: "12px 16px" }}><Md text={displayText} /></div>
    )}
  </div>;
}

const Ld = ({ msg, long }) => <div style={{ textAlign: "center", padding: 45 }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${T},${TL})`, margin: "0 auto 14px", animation: "pulse 1.4s ease infinite" }} /><p style={{ color: TG, fontSize: 13 }}>{msg}</p><p style={{ color: TM, fontSize: 11, marginTop: 4 }}>{long ? "30-60 seconds" : "15-30 seconds"}</p></div>;

function I({ label, value, onChange, placeholder, multi, required, error }) {
  const s = { width: "100%", padding: "10px 13px", borderRadius: 8, border: `1.5px solid ${error ? "#EF4444" : BD}`, fontSize: 13, fontFamily: "inherit", color: TX, background: "#FAFBFC", outline: "none", boxSizing: "border-box" };
  return <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TX, marginBottom: 4 }}>{label}{required && <span style={{ color: "#EF4444" }}> *</span>}</label>
    {multi ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...s, resize: "vertical" }} onFocus={e => e.target.style.borderColor = T} onBlur={e => e.target.style.borderColor = error ? "#EF4444" : BD} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={s} onFocus={e => e.target.style.borderColor = T} onBlur={e => e.target.style.borderColor = BD} />}
    {error && <p style={{ color: "#EF4444", fontSize: 11, marginTop: 3 }}>{error}</p>}
  </div>;
}

const S = ({ label, value, onChange, options }) => <div style={{ marginBottom: 14 }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TX, marginBottom: 4 }}>{label}</label><select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "10px 13px", borderRadius: 8, border: `1.5px solid ${BD}`, fontSize: 13, fontFamily: "inherit", color: TX, background: "#FAFBFC", cursor: "pointer" }}>{options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select></div>;

const B = ({ onClick, loading, label }) => <button onClick={onClick} disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? TM : `linear-gradient(135deg,${TD},${TL})`, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", boxShadow: loading ? "none" : `0 3px 10px ${T}33` }}>{loading ? "Working..." : label}</button>;

// Fix #9: VoiceToggle shows tip only once per session
let voiceTipShown = false;
function VoiceToggle({ enabled, onToggle }) {
  const [showTip, setShowTip] = useState(false);
  return <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "8px 12px", background: "#FAFBFC", borderRadius: 8, border: `1px solid ${BD}` }}>
    <div onClick={() => { onToggle(); if (!enabled && !voiceTipShown) { voiceTipShown = true; setShowTip(true); setTimeout(() => setShowTip(false), 2500); } }} style={{ width: 36, height: 20, borderRadius: 10, background: enabled ? T : "#CBD5E1", cursor: "pointer", position: "relative", transition: "background .2s" }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: enabled ? 18 : 2, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
    </div>
    <span style={{ fontSize: 12, color: enabled ? TX : TG, fontWeight: 500 }}>Voice Profile {enabled ? "ON" : "OFF"}</span>
    {showTip && <span style={{ fontSize: 10, color: T, fontWeight: 600, animation: "su .2s ease" }}>Preview — full setup coming soon</span>}
  </div>;
}

// Fix #11: Tighter heading detection — must be ONLY bold on the line, not inline bold
function parse(text) {
  const s = [], l = text.split("\n"); let t = "", c = [];
  for (const x of l) {
    const isHeading = x.match(/^#{1,4}\s/);
    // Bold heading: must be **text** with nothing else on the line (no trailing content)
    const isBoldHeading = x.match(/^\*\*[^*]+\*\*$/) && x.length > 6;
    if (isHeading || isBoldHeading) {
      if (t || c.length) s.push({ title: t || "Result", content: c.join("\n").trim() });
      t = x.replace(/^#+\s*/, "").replace(/\*\*/g, "").trim(); c = [];
    } else c.push(x);
  }
  if (t || c.length) s.push({ title: t || "Result", content: c.join("\n").trim() });
  const filtered = s.filter(x => x.content.length > 0);
  if (filtered.length === 0 && text.trim().length > 0) {
    const blocks = text.split(/\n\n+/).filter(b => b.trim());
    if (blocks.length > 1) return blocks.map((b, i) => ({ title: `Section ${i + 1}`, content: b.trim() }));
    return [{ title: "Result", content: text.trim() }];
  }
  return filtered;
}

// Fix #8: R component passes genId to Cards for regen detection
// Strip markdown for clean copy-paste
function stripMd(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '$1').replace(/^#{1,4}\s*/gm, '').replace(/^[-•]\s*/gm, '- ');
}

function R({ data, onRegenerate, genId }) {
  if (!data) return null;
  // Issue 14: empty results
  if (data.length === 0) return <div style={{ textAlign: "center", padding: 30 }}>
    <p style={{ color: TG, fontSize: 13 }}>No results found. Try different inputs or more detail.</p>
    {onRegenerate && <button onClick={onRegenerate} style={{ marginTop: 10, background: "transparent", color: T, border: `1px solid ${T}`, borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>🔄 Try Again</button>}
  </div>;
  const allText = data.map(r => `${r.title}\n${stripMd(r.content)}`).join("\n\n");
  return <div style={{ marginTop: 20 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: TG }}>{data.length} sections</span>
      <div style={{ display: "flex", gap: 6 }}>
        <CopyBtn text={allText} label="Copy All" />
        {onRegenerate && <button onClick={onRegenerate} style={{ background: "transparent", color: TG, border: `1px solid ${BD}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>🔄 Regenerate</button>}
      </div>
    </div>
    {data.map((r, i) => <Card key={`${genId}-${i}`} title={r.title} content={r.content} i={i} genId={genId} />)}
  </div>;
}

// Fix #1: useTool with ref pattern to avoid stale closures. Fix #12: debounce via loading state
function useTool(promptFn, opts = {}) {
  const [ld, setLd] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const [genId, setGenId] = useState(0);
  const mounted = useRef(true);
  const promptRef = useRef(promptFn);
  promptRef.current = promptFn; // always latest
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const go = useCallback(async (...args) => {
    setErr(""); setLd(true); setRes(null);
    const prompt = promptRef.current(...args); // Fix #1: uses ref, always current
    const enhanced = opts.noSearch ? prompt : `IMPORTANT: You MUST use web search to find real, current data. Do NOT rely on training data alone.\n\n${prompt}`;
    const result = await ask(enhanced, null, opts.highTokens);
    if (!mounted.current) return;
    if (result.startsWith("⚠️")) { setErr(result); setLd(false); return; }
    setRes(parse(result)); setGenId(g => g + 1); setLd(false);
  }, [opts.noSearch, opts.highTokens]);
  return { ld, res, go, err, genId };
}

// ========== TOOLS ==========
function ReviewResponses() {
  const biz = useContext(BizCtx);
  const [n, setN] = useState(biz?.name || ""); const [l, setL] = useState(biz?.location || ""); const [link, setLink] = useState(biz?.googleLink || "");
  const [voice, setVoice] = useState(false); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((name, loc, glink) =>
    `You are an expert reputation management consultant.\n\nSearch Google reviews for "${name}"${loc ? ` in ${loc}` : ""}${glink ? `. Link: ${glink}` : ""}. You MUST find actual reviews.\n\nFor each (up to 10):\n\n## Review 1: [Name] — [Stars] ⭐\n**Original:** [text]\n**Response:** [thanks by name, addresses feedback, warm. Negative: acknowledge, apologize, resolve. Positive: gratitude, reinforce]\n\n## Summary\nTotal | Average | Positive themes | Negative themes | Response rate | Priority\n${voice ? "\nWarm conversational tone — not corporate." : ""}`);
  const handleGo = () => { if (!n.trim()) { setValErr("Business name required"); return; } setValErr(""); go(n, l, link); };
  return <div>
    <I label="Business Name" value={n} onChange={v => { setN(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <I label="Location" value={l} onChange={setL} placeholder="e.g. Austin, TX" />
    <I label="Google Review Link (optional)" value={link} onChange={setLink} placeholder="https://g.page/r/..." />
    <VoiceToggle enabled={voice} onToggle={() => setVoice(!voice)} />
    <B onClick={handleGo} loading={ld} label="⭐ Find Reviews & Write Responses" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Searching reviews..." />}
    <R data={res} onRegenerate={() => go(n, l, link)} genId={genId} />
  </div>;
}

function BrandPresence() {
  const biz = useContext(BizCtx);
  const [n, setN] = useState(biz?.name || ""); const [d, setD] = useState(""); const [ind, setInd] = useState(biz?.industry || "general");
  const [voice, setVoice] = useState(false); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((name, desc, industry) =>
    `Expert brand strategist + SEO copywriter.\n\nSearch "${name}". Industry: ${industry}. ${desc ? `Info: ${desc}` : ""}\n\n## Google Business Profile Description\n[Short 750 char + long version, keyword-rich]\n## GBP Audit\n[Score, fixes, 4 posts]\n## Instagram Bio\n[3 variations, 150 chars, emoji + CTA]\n## Facebook About\n[Short 155 char + long]\n## LinkedIn Company\n[1-2 professional paragraphs]\n## Website About\n[3-4 para, story-driven]\n## Meta Description\n[160 chars SEO]\n## Email Tagline\n[5 options, under 10 words]\n## Elevator Pitch\n[30-sec conversational]\n${voice ? "\nWarm tone." : ""}`, { highTokens: true });
  const handleGo = () => { if (!n.trim()) { setValErr("Required"); return; } setValErr(""); go(n, d, ind); };
  return <div><I label="Business Name" value={n} onChange={v => { setN(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <I label="About (optional)" value={d} onChange={setD} placeholder="e.g. Family dentistry since 2010" multi />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <VoiceToggle enabled={voice} onToggle={() => setVoice(!voice)} />
    <B onClick={handleGo} loading={ld} label="✍️ Optimize All Profiles" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Auditing..." long />}<R data={res} onRegenerate={() => go(n, d, ind)} genId={genId} /></div>;
}

// Fix #14: WebchatBot with message limit (last 20 turns)
function WebchatBot() {
  const biz = useContext(BizCtx);
  const { addLead } = useContext(LeadCtx);
  const [url, setUrl] = useState(biz?.url || ""); const [msgs, setMsgs] = useState([]); const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false); const [bizData, setBizData] = useState(""); const [ready, setReady] = useState(false);
  const [valErr, setValErr] = useState(""); const ref = useRef(null); const inputRef = useRef(null);
  const sysPr = (bd) => `You are a friendly AI assistant for this business. Use ONLY the data below. Be warm, concise (2-4 sentences). If unsure, offer to connect with team. Guide toward booking. Never invent info. Today's date: ${new Date().toLocaleDateString()}.\n\nBusiness Data:\n${bd}`;
  const scan = async () => {
    if (!url.trim()) { setValErr("URL required"); return; }
    setValErr(""); setLoading(true); setMsgs([]); setReady(false);
    const data = await ask(`You MUST search and analyze this business website: ${url.trim()}\n\nExtract ALL info: name, services/products with pricing, hours, location, phone, team, specialties, insurance, USPs, FAQs, booking. Return structured.`);
    if (data.startsWith("⚠️")) { setValErr(data); setLoading(false); return; }
    setBizData(data); setReady(true); setLoading(false);
    setMsgs([{ role: "assistant", content: "I've analyzed this business! Ask me anything — services, pricing, hours, etc.", display: true }]);
  };
  const send = async () => {
    if (!inp.trim() || loading) return;
    const userMsg = inp.trim(); setInp("");
    const newMsgs = [...msgs, { role: "user", content: userMsg }];
    setMsgs(newMsgs); setLoading(true);
    // Fix #14: Limit to last 20 real messages to avoid context overflow
    const realMsgs = newMsgs.filter(m => !m.display).map(m => ({ role: m.role, content: m.content }));
    const truncated = realMsgs.slice(-20);
    const reply = await askChat(truncated, sysPr(bizData));
    setMsgs(prev => [...prev, { role: "assistant", content: reply }]); setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 50);
    // Push lead to inbox on first user message
    if (newMsgs.filter(m => m.role === "user").length === 1) {
      addLead({ source: "chat", name: userMsg.length > 30 ? "Chat visitor" : "Chat visitor", summary: userMsg, contact: url });
    }
  };
  useEffect(() => { ref.current && (ref.current.scrollTop = ref.current.scrollHeight); }, [msgs]);
  if (!ready) return <div>
    <p style={{ color: TG, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>Enter a website. AI scans it and becomes a 24/7 customer assistant.</p>
    <I label="Website URL" value={url} onChange={v => { setUrl(v); setValErr(""); }} placeholder="https://example.com" required error={valErr} />
    <B onClick={scan} loading={loading} label="🤖 Scan & Build Chatbot" />
    {loading && <Ld msg="Scanning..." long />}
  </div>;
  return <div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", animation: "pulse 2s ease infinite" }} />
      <span style={{ fontSize: 11, color: TG, fontWeight: 600 }}>Live — {url}</span>
      <button onClick={() => { setReady(false); setBizData(""); setMsgs([]); }} style={{ marginLeft: "auto", fontSize: 10, color: TG, background: "none", border: `1px solid ${BD}`, borderRadius: 5, padding: "3px 8px", cursor: "pointer", fontFamily: "inherit" }}>Reset</button>
    </div>
    <div ref={ref} style={{ height: 300, overflowY: "auto", border: `1px solid ${BD}`, borderRadius: 10, padding: 14, marginBottom: 10, background: "#FAFBFC" }}>
      {msgs.map((m, i) => <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 8 }}>
        <div style={{ maxWidth: "78%", padding: "9px 13px", borderRadius: 10, fontSize: 13, lineHeight: 1.6, background: m.role === "user" ? T : CD, color: m.role === "user" ? "#fff" : TX, border: m.role === "user" ? "none" : `1px solid ${BD}` }}>{m.content}</div>
      </div>)}
      {loading && <div style={{ display: "flex", gap: 4, padding: 8 }}>{[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: TM, animation: `pulse 1s ease ${i*.2}s infinite` }} />)}</div>}
    </div>
    <div style={{ display: "flex", gap: 6 }}>
      <input ref={inputRef} value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask anything..."
        style={{ flex: 1, padding: "9px 12px", borderRadius: 7, border: `1.5px solid ${BD}`, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
      <button onClick={send} disabled={loading} style={{ padding: "9px 16px", background: T, color: "#fff", border: "none", borderRadius: 7, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>Send</button>
    </div>
  </div>;
}

function SocialVideo() {
  const bc = useContext(BizCtx);
  const [url, setUrl] = useState(bc?.url || ""); const [d, setD] = useState(bc?.name || ""); const [mode, setMode] = useState("posts");
  const [plat, setPlat] = useState("all"); const [tone, setTone] = useState("professional");
  const [voice, setVoice] = useState(false); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((u, desc, m, p, t) => {
    const src = u ? `Search: ${u}` : `Business: ${desc}`;
    return m === "posts"
      ? `Social media strategist.\n${src}\n7-day for ${p === "all" ? "FB, IG, LinkedIn" : p}. Tone: ${t}.\n\nPer day:\n## Day 1 — Monday\n**Platform:** **Type:** [carousel/reel/story]\n**Caption:** [COMPLETE, ready-to-post, with emoji]\n**Hashtags:** [10-15]\n**Time:** **Visual:** **Hook:**\n\nMix: educational, promo, behind-scenes, testimonial, engagement.\n${voice ? "Casual personal voice." : ""}`
      : `Video creator.\n${src}\n5 scripts (15-60s):\n\n## Script 1: [Title]\n**Duration:** **Hook (3s):** **Script:** [word-for-word]\n**Visuals:** **Caption:** **Hashtags:** **Audio:**`; }, { highTokens: true });
  const handleGo = () => { if (!url.trim() && !d.trim()) { setValErr("Enter URL or description"); return; } setValErr(""); go(url, d, mode, plat, tone); };
  return <div>
    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>{[["posts","📱 Posts"],["video","🎬 Video"]].map(([m,l]) => <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px", background: mode === m ? T : "transparent", color: mode === m ? "#fff" : TG, border: `1.5px solid ${mode === m ? T : BD}`, borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>)}</div>
    <I label="Website URL" value={url} onChange={v => { setUrl(v); setValErr(""); }} placeholder="https://..." error={!url && !d && valErr ? valErr : ""} />
    <I label="Or describe" value={d} onChange={v => { setD(v); setValErr(""); }} placeholder="e.g. Italian restaurant" multi />
    {mode === "posts" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><S label="Platform" value={plat} onChange={setPlat} options={[{v:"all",l:"All"},{v:"Facebook",l:"Facebook"},{v:"Instagram",l:"Instagram"},{v:"LinkedIn",l:"LinkedIn"},{v:"TikTok",l:"TikTok"}]} /><S label="Tone" value={tone} onChange={setTone} options={[{v:"professional",l:"Professional"},{v:"casual",l:"Casual"},{v:"witty",l:"Witty"},{v:"luxury",l:"Luxury"},{v:"local",l:"Local"}]} /></div>}
    <VoiceToggle enabled={voice} onToggle={() => setVoice(!voice)} />
    <B onClick={handleGo} loading={ld} label={mode === "posts" ? "📱 Create Calendar" : "🎬 Create Scripts"} />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Creating..." long />}<R data={res} onRegenerate={handleGo} genId={genId} /></div>;
}

function AdStudio() {
  const bc = useContext(BizCtx);
  const [u, setU] = useState(bc?.url || ""); const [d, setD] = useState(bc?.name || ""); const [g, setG] = useState("leads"); const [b, setBt] = useState("low");
  const [voice, setVoice] = useState(false); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((url, desc, goal, bgt) => {
    const src = url ? `Search: ${url}` : `Business: ${desc}`;
    return `FB/IG ad strategist.\n${src}\nGoal: ${goal}. Budget: ${bgt === "low" ? "$5-15/day" : bgt === "mid" ? "$15-50/day" : "$50+/day"}.\n\n5 ads:\n## Ad 1: Pain Point\n**Type:** **Text:** [2-4 sentences]\n**Headline:** [under 40 chars]\n**Description:** **CTA:** **Image:** **Targeting:** **Why:**\n\n## Ad 2: Social Proof\n## Ad 3: Offer\n## Ad 4: Educational\n## Ad 5: Emotional\n\n## Strategy\n${voice ? "Personal casual copy." : ""}`; }, { highTokens: true });
  const handleGo = () => { if (!u.trim() && !d.trim()) { setValErr("Enter URL or description"); return; } setValErr(""); go(u, d, g, b); };
  return <div>
    <I label="Website" value={u} onChange={v => { setU(v); setValErr(""); }} placeholder="https://..." error={!u && !d && valErr ? valErr : ""} />
    <I label="Or describe" value={d} onChange={v => { setD(v); setValErr(""); }} placeholder="e.g. Family dental, Austin TX" multi />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><S label="Goal" value={g} onChange={setG} options={[{v:"leads",l:"Leads"},{v:"sales",l:"Bookings"},{v:"awareness",l:"Awareness"},{v:"traffic",l:"Traffic"}]} /><S label="Budget" value={b} onChange={setBt} options={[{v:"low",l:"$5-15/day"},{v:"mid",l:"$15-50/day"},{v:"high",l:"$50+/day"}]} /></div>
    <VoiceToggle enabled={voice} onToggle={() => setVoice(!voice)} />
    <B onClick={handleGo} loading={ld} label="📣 Create Ads" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Creating ads..." long />}<R data={res} onRegenerate={handleGo} genId={genId} /></div>;
}

function EmailStudio() {
  const bc = useContext(BizCtx);
  const [u, setU] = useState(bc?.url || ""); const [d, setD] = useState(bc?.name || ""); const [t, setT] = useState("promotion"); const [a, setA] = useState("customers");
  const [voice, setVoice] = useState(false); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((url, desc, type, aud) => {
    const src = url ? `Search: ${url}` : `Business: ${desc}`;
    return `Email strategist.\n${src}\nType: ${type}. Audience: ${aud}.\n\n3-email sequence:\n## Email 1: [Name]\n**Subject:** [under 50]\n**Preview:** [under 90]\n**Timing:** **Body:** [COMPLETE, conversational]\n**CTA:**\n\n## Email 2/3: [same]\n\n## Strategy\n${voice ? "Write as owner personally." : ""}`; }, { highTokens: true });
  const handleGo = () => { if (!u.trim() && !d.trim()) { setValErr("Enter URL or description"); return; } setValErr(""); go(u, d, t, a); };
  return <div>
    <I label="Website" value={u} onChange={v => { setU(v); setValErr(""); }} placeholder="https://..." error={!u && !d && valErr ? valErr : ""} />
    <I label="Or describe" value={d} onChange={v => { setD(v); setValErr(""); }} placeholder="e.g. Yoga studio, Brooklyn" multi />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><S label="Type" value={t} onChange={setT} options={[{v:"promotion",l:"Promotion"},{v:"reactivation",l:"Win Back"},{v:"welcome",l:"Welcome"},{v:"seasonal",l:"Seasonal"},{v:"announcement",l:"Launch"}]} /><S label="Audience" value={a} onChange={setA} options={[{v:"customers",l:"Existing"},{v:"leads",l:"Leads"},{v:"dormant",l:"Dormant"}]} /></div>
    <VoiceToggle enabled={voice} onToggle={() => setVoice(!voice)} />
    <B onClick={handleGo} loading={ld} label="✉️ Create Campaign" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Crafting..." />}<R data={res} onRegenerate={handleGo} genId={genId} /></div>;
}

function CompetitorDeep() {
  const biz = useContext(BizCtx);
  const [n, setN] = useState(biz?.name || ""); const [l, setL] = useState(biz?.location || ""); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((name, loc) =>
    `Competitive analyst. Search "${name}"${loc ? ` in ${loc}` : ""}. Find this business + top 3-5 competitors.\n\n## Your Business: ${name}\n[rating, reviews, strengths, weaknesses, presence]\n## Competitor 1: [Name]\n[rating, reviews, better/worse, weakness]\n## Head-to-Head\n## Gaps & Opportunities\n## Action Plan [5 steps]`);
  const handleGo = () => { if (!n.trim()) { setValErr("Required"); return; } setValErr(""); go(n, l); };
  return <div><I label="Business" value={n} onChange={v => { setN(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <I label="Location" value={l} onChange={setL} placeholder="e.g. Austin, TX" />
    <B onClick={handleGo} loading={ld} label="🔍 Analyze" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Researching..." long />}<R data={res} onRegenerate={() => go(n, l)} genId={genId} /></div>;
}

function ProposalStudio() {
  const bc = useContext(BizCtx);
  const [bz, setBz] = useState(bc?.name || ""); const [cl, setCl] = useState(""); const [ind, setInd] = useState(bc?.industry || "general"); const [j, setJ] = useState(""); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((biz, client, industry, job) =>
    `Proposal writer.\nBusiness: ${biz||"[Business]"}. Client: ${client||"[Client]"}. Industry: ${industry}. Job: ${job}\n\n## Proposal Header\n## Executive Summary\n## Scope of Work\n## Timeline\n## Investment [itemized]\n## Payment Terms\n## Included / NOT Included\n## Why ${biz||"Us"}\n## Next Steps\n## Terms`, { highTokens: true, noSearch: true });
  const handleGo = () => { if (!j.trim()) { setValErr("Job description required"); return; } setValErr(""); go(bz, cl, ind, j); };
  return <div><I label="Your Business" value={bz} onChange={setBz} placeholder="e.g. Pro Plumbing" />
    <I label="Client" value={cl} onChange={setCl} placeholder="e.g. John Smith" />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <I label="Describe the job" value={j} onChange={v => { setJ(v); setValErr(""); }} placeholder="e.g. Bathroom renovation..." multi required error={valErr} />
    <B onClick={handleGo} loading={ld} label="📋 Create Proposal" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Building..." long />}<R data={res} onRegenerate={() => go(bz, cl, ind, j)} genId={genId} /></div>;
}

// Fix #3: Review Funnel with ★/☆ star display
function ReviewFunnel() {
  const bc = useContext(BizCtx);
  const [link, setLink] = useState(bc?.googleLink || ""); const [name, setName] = useState(bc?.name || ""); const [color, setColor] = useState("teal");
  const [generated, setGenerated] = useState(false); const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(""); const [submitted, setSubmitted] = useState(false);
  const colorMap = { teal: "#0D9488", blue: "#2563EB", purple: "#7C3AED", red: "#DC2626", orange: "#EA580C", green: "#16A34A" };
  const hex = colorMap[color]; const [valErr, setValErr] = useState("");
  if (!generated) return <div>
    <p style={{ color: TG, fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>Happy customers (4-5) → Google review. Unhappy (1-3) → private feedback.</p>
    <I label="Google Review Link" value={link} onChange={v => { setLink(v); setValErr(""); }} placeholder="https://g.page/r/..." required error={valErr} />
    <I label="Business Name" value={name} onChange={setName} placeholder="e.g. Sunrise Dental" required />
    <S label="Brand Color" value={color} onChange={setColor} options={[{v:"teal",l:"Teal"},{v:"blue",l:"Blue"},{v:"purple",l:"Purple"},{v:"red",l:"Red"},{v:"orange",l:"Orange"},{v:"green",l:"Green"}]} />
    <B onClick={() => { if (!link.trim() || !name.trim()) { setValErr("Both required"); return; } setGenerated(true); }} loading={false} label="⭐ Generate Funnel" />
  </div>;
  if (submitted) return <div style={{ textAlign: "center", padding: 40 }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
    <h3 style={{ color: TX, fontSize: 18, fontWeight: 800 }}>Thank you!</h3>
    <p style={{ color: TG, fontSize: 13, marginTop: 8 }}>{selected >= 4 ? "Redirecting to Google Reviews..." : "Feedback received."}</p>
    <button onClick={() => { setSubmitted(false); setSelected(null); setFeedback(""); }} style={{ marginTop: 16, padding: "8px 16px", fontSize: 11, color: TG, background: "none", border: `1px solid ${BD}`, borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>Reset Demo</button>
  </div>;
  return <div>
    <p style={{ color: TM, fontSize: 11, marginBottom: 12, fontWeight: 600 }}>⚡ LIVE PREVIEW — click to test</p>
    <div style={{ border: `1px solid ${BD}`, borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ background: hex, padding: "24px 20px", textAlign: "center" }}>
        <h2 style={{ margin: 0, color: "#fff", fontSize: 20, fontWeight: 800 }}>How was your experience at {name}?</h2>
      </div>
      <div style={{ padding: 24, textAlign: "center", background: "#FAFBFC" }}>
        {!selected ? <div>
          <p style={{ color: TG, fontSize: 13, marginBottom: 16 }}>Tap your rating:</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {[1,2,3,4,5].map(s => <div key={s} onClick={() => setSelected(s)}
              style={{ padding: "10px 4px", borderRadius: 10, background: s >= 4 ? `${hex}12` : "#FEF2F2",
                border: `2px solid ${s >= 4 ? hex : "#FECACA"}`, cursor: "pointer", transition: "transform .15s", textAlign: "center", minWidth: 54 }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              <div style={{ fontSize: 13, lineHeight: 1.2, color: s >= 4 ? hex : "#EF4444" }}>{"★".repeat(s)}<span style={{ opacity: .2 }}>{"★".repeat(5-s)}</span></div>
            </div>)}
          </div>
        </div> : selected >= 4 ? <div>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h3 style={{ color: TX, fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>Glad you had a great experience!</h3>
          <p style={{ color: TG, fontSize: 13, marginBottom: 16 }}>Share on Google?</p>
          <button onClick={() => { setSubmitted(true); try { window.open(link, '_blank'); } catch {} }} style={{ padding: "12px 24px", background: hex, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Leave Google Review →</button>
        </div> : <div>
          <h3 style={{ color: TX, fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>Sorry to hear that.</h3>
          <p style={{ color: TG, fontSize: 13, marginBottom: 16 }}>Tell us what happened:</p>
          <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} placeholder="Your feedback..." style={{ width: "100%", padding: 12, borderRadius: 8, border: `1.5px solid ${BD}`, fontSize: 13, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
          <button onClick={() => setSubmitted(true)} style={{ marginTop: 12, width: "100%", padding: "12px", background: hex, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Send Private Feedback</button>
        </div>}
      </div>
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      <CopyBtn text={`Review funnel: ${name}\nGoogle: ${link}\nColor: ${hex}`} />
      <button onClick={() => { setGenerated(false); setSelected(null); }} style={{ padding: "5px 12px", fontSize: 11, color: TG, background: "none", border: `1px solid ${BD}`, borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
    </div>
  </div>;
}

function AutoReviewKit() {
  const bc = useContext(BizCtx);
  const [name, setName] = useState(bc?.name || ""); const [link, setLink] = useState(bc?.googleLink || ""); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((biz, url) =>
    `Review generation specialist. Business: "${biz}". Link: ${url}\n\n## QR Poster Text\n## SMS Request (3, [Name] merge, under 160)\n## Email Request (2, subject+body)\n## Follow-Up (3 days)\n## Staff Script\n## Social Post\n## Receipt Insert`, { noSearch: true });
  const handleGo = () => { if (!name.trim() || !link.trim()) { setValErr("Both required"); return; } setValErr(""); go(name, link); };
  return <div><I label="Business" value={name} onChange={v => { setName(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={!name && valErr ? valErr : ""} />
    <I label="Google Review Link" value={link} onChange={v => { setLink(v); setValErr(""); }} placeholder="https://g.page/r/..." required error={!link && valErr ? valErr : ""} />
    <B onClick={handleGo} loading={ld} label="⭐ Generate Kit" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Creating..." />}<R data={res} onRegenerate={() => go(name, link)} genId={genId} /></div>;
}

function BlogWriter() {
  const bc = useContext(BizCtx);
  const [topic, setTopic] = useState(""); const [biz, setBiz] = useState(bc?.name || ""); const [kw, setKw] = useState("");
  const [voice, setVoice] = useState(false); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((t, b, k) =>
    `SEO writer. Business: ${b||"local business"}. Topic: ${t}. ${k ? `Keyword: ${k}` : ""}\n\n## Title\n## Meta Description [160 chars]\n## Article [800-1500 words, H2/H3, CTA]\n## Social Snippet\n## Internal Linking [3-5]\n## SEO Checklist\n${voice ? "Conversational." : ""}`, { highTokens: true, noSearch: true });
  const handleGo = () => { if (!topic.trim()) { setValErr("Topic required"); return; } setValErr(""); go(topic, biz, kw); };
  return <div><I label="Topic" value={topic} onChange={v => { setTopic(v); setValErr(""); }} placeholder="e.g. 5 Signs You Need a Root Canal" required error={valErr} />
    <I label="Business (optional)" value={biz} onChange={setBiz} placeholder="e.g. Sunrise Dental" />
    <I label="Keyword (optional)" value={kw} onChange={setKw} placeholder="e.g. root canal Austin TX" />
    <VoiceToggle enabled={voice} onToggle={() => setVoice(!voice)} />
    <B onClick={handleGo} loading={ld} label="📝 Write" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Writing..." long />}<R data={res} onRegenerate={handleGo} genId={genId} /></div>;
}

function SmartFAQ() {
  const bc = useContext(BizCtx);
  const [url, setUrl] = useState(bc?.url || ""); const [ind, setInd] = useState(bc?.industry || "general"); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((u, i) =>
    `FAQ specialist. Search: ${u}. Industry: ${i}.\n20 FAQs from THIS business's real data.\n\n## General\n**Q:** **A:**\n## Services & Pricing\n## Scheduling\n## Policies\n## Location\n\nEvery answer MUST use their actual data.`);
  const handleGo = () => { if (!url.trim()) { setValErr("URL required"); return; } setValErr(""); go(url, ind); };
  return <div><I label="Website URL" value={url} onChange={v => { setUrl(v); setValErr(""); }} placeholder="https://..." required error={valErr} />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <B onClick={handleGo} loading={ld} label="❓ Generate FAQ" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Generating..." long />}<R data={res} onRegenerate={() => go(url, ind)} genId={genId} /></div>;
}

function CampaignStudio() {
  const bc = useContext(BizCtx);
  const [mode, setMode] = useState("quick"); const [biz, setBiz] = useState(bc?.name || ""); const [event, setEvent] = useState(""); const [ind, setInd] = useState(bc?.industry || "general");
  const [voice, setVoice] = useState(false); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((m, b, e, i) => m === "quick"
    ? `Campaign strategist. Business: ${b}. Industry: ${i}. Event: ${e}\n\n## Overview\n## Social Posts (3)\n## Ad\n## Email [subject+body]\n## SMS [under 160]\n## Promotion\n${voice ? "Warm tone." : ""}`
    : `12-month planner. Business: ${b}. Industry: ${i}.\n\nPer month:\n## [Month]\n**Dates:** **Campaign:** **Social:** **Email:** **Local:** **Revenue Goal:**`,
    { highTokens: true, noSearch: true });
  const handleGo = () => {
    if (!biz.trim()) { setValErr("Required"); return; }
    if (mode === "quick" && !event.trim()) { setValErr("Event required"); return; }
    setValErr(""); go(mode, biz, event, ind); };
  return <div>
    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>{[["quick","⚡ Quick"],["plan","📅 12-Month"]].map(([m,l]) => <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px", background: mode === m ? T : "transparent", color: mode === m ? "#fff" : TG, border: `1.5px solid ${mode === m ? T : BD}`, borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>)}</div>
    <I label="Business" value={biz} onChange={v => { setBiz(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={!biz && valErr ? valErr : ""} />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    {mode === "quick" && <I label="Event" value={event} onChange={v => { setEvent(v); setValErr(""); }} placeholder="e.g. Mother's Day" required error={mode==="quick" && !event && valErr ? valErr : ""} />}
    <VoiceToggle enabled={voice} onToggle={() => setVoice(!voice)} />
    <B onClick={handleGo} loading={ld} label={mode === "quick" ? "⚡ Generate" : "📅 Plan Year"} />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Creating..." long />}<R data={res} onRegenerate={handleGo} genId={genId} /></div>;
}

function RevenueRadar() {
  const biz = useContext(BizCtx);
  const [name, setName] = useState(biz?.name || ""); const [loc, setLoc] = useState(biz?.location || ""); const [ind, setInd] = useState(biz?.industry || "dental"); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((n, l, i) =>
    `Revenue consultant. Search "${n}" in ${l}. Industry: ${i}.\n\n## Lost Revenue\nPer gap: data, % lost, $ with methodology.\n### Unanswered Reviews\n### Visibility Gaps\n### After-Hours\n### Review Gap vs Competitors\n### Social Inactivity\n### Total Monthly Loss: $X,XXX\n\n## Price Intelligence\nSearch competitor pricing:\n### Your vs Market\n### Underpriced\n### Overpriced\n### Top 3 Recommendations`, { highTokens: true });
  const handleGo = () => { if (!name.trim()) { setValErr("Required"); return; } setValErr(""); go(name, loc, ind); };
  return <div><I label="Business" value={name} onChange={v => { setName(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <I label="Location" value={loc} onChange={setLoc} placeholder="e.g. Austin, TX" />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <B onClick={handleGo} loading={ld} label="💰 Analyze" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Analyzing..." long />}<R data={res} onRegenerate={() => go(name, loc, ind)} genId={genId} /></div>;
}

function Reactivation() {
  const bc = useContext(BizCtx);
  const [biz, setBiz] = useState(bc?.name || ""); const [ind, setInd] = useState(bc?.industry || "dental"); const [avg, setAvg] = useState(""); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((b, i, a) =>
    `Retention specialist. Business: ${b}. Industry: ${i}. Avg value: ${a||"industry avg"}.\n\n## REACTIVATION\n### SMS Win-Back (3, [Name], under 160)\n### Email Win-Back (2)\n### WhatsApp\n\n## UPSELL\n### Bundles (3)\n### Post-Visit SMS (3)\n### Staff Scripts\n### Seasonal Campaign\n\n## ROI Estimate`, { highTokens: true, noSearch: true });
  const handleGo = () => { if (!biz.trim()) { setValErr("Required"); return; } setValErr(""); go(biz, ind, avg); };
  return <div><I label="Business" value={biz} onChange={v => { setBiz(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <I label="Avg Value (optional)" value={avg} onChange={setAvg} placeholder="e.g. $500" />
    <B onClick={handleGo} loading={ld} label="🔄 Generate" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Creating..." long />}<R data={res} onRegenerate={() => go(biz, ind, avg)} genId={genId} /></div>;
}

function MapsTracker() {
  const biz = useContext(BizCtx);
  const [bz, setBz] = useState(biz?.name || ""); const [loc, setLoc] = useState(biz?.location || ""); const [kw, setKw] = useState(""); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((b, l, k) =>
    `Local SEO analyst. Search Google for "${k || b}" in ${l} and analyze local search results.\n\n## Estimated Ranking\n**Search:** "${k || b + ' near ' + l}"\n**Position:** [estimate]\n\n## Top 5 Local Results\n[Name, rating, reviews]\n\n## Why You Rank Here\n## How to Move Up [3 actions]\n## What #1 Does Differently\n\nNote: Rankings estimated from web search, not live Maps API.`);
  const handleGo = () => { if (!bz.trim()) { setValErr("Required"); return; } setValErr(""); go(bz, loc, kw); };
  return <div><I label="Business" value={bz} onChange={v => { setBz(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <I label="Location" value={loc} onChange={setLoc} placeholder="e.g. Austin, TX" />
    <I label="Search Term (optional)" value={kw} onChange={setKw} placeholder="e.g. dentist near me" />
    <B onClick={handleGo} loading={ld} label="📍 Check" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Checking..." />}<R data={res} onRegenerate={() => go(bz, loc, kw)} genId={genId} /></div>;
}

function LeadEngine() {
  const bc = useContext(BizCtx);
  const [mode, setMode] = useState("magnet"); const [biz, setBiz] = useState(bc?.name || ""); const [ind, setInd] = useState(bc?.industry || "dental");
  const [avg, setAvg] = useState(""); const [count, setCount] = useState(""); const [voice, setVoice] = useState(false); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((m, b, i, a, ct) => m === "magnet"
    ? `Lead gen. Business: ${b}. Industry: ${i}.\n\n## Lead Magnet Concept\n## Landing Page Copy\n## 3-Email Nurture\n## Content Outline [8 sections]\n${voice ? "Warm." : ""}`
    : `Referral designer. Business: ${b}. Industry: ${i}. Avg: ${a||"N/A"}. Customers: ${ct||"N/A"}.\n\n## Structure\n## Messaging Kit\n## Tracking\n## ROI\n## Timeline`, { highTokens: true, noSearch: true });
  const handleGo = () => { if (!biz.trim()) { setValErr("Required"); return; } setValErr(""); go(mode, biz, ind, avg, count); };
  return <div>
    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>{[["magnet","🧲 Lead Magnet"],["referral","🤝 Referral"]].map(([m,l]) => <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px", background: mode === m ? T : "transparent", color: mode === m ? "#fff" : TG, border: `1.5px solid ${mode === m ? T : BD}`, borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>)}</div>
    <I label="Business" value={biz} onChange={v => { setBiz(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    {mode === "referral" && <><I label="Avg Value" value={avg} onChange={setAvg} placeholder="e.g. $500" /><I label="Customers" value={count} onChange={setCount} placeholder="e.g. 200" /></>}
    <VoiceToggle enabled={voice} onToggle={() => setVoice(!voice)} />
    <B onClick={handleGo} loading={ld} label={mode === "magnet" ? "🧲 Create" : "🤝 Design"} />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Creating..." long />}<R data={res} onRegenerate={handleGo} genId={genId} /></div>;
}

// Fix #4: PricingPro with industry-specific depth restored
function PricingPro() {
  const bc = useContext(BizCtx);
  const [ind, setInd] = useState(bc?.industry || "dental"); const [url, setUrl] = useState(bc?.url || ""); const [loc, setLoc] = useState(bc?.location || ""); const [desc, setDesc] = useState(""); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((i, u, l, d) => {
    const src = u ? `Search: ${u}` : `Info: ${d}`;
    const base = `Pricing consultant for ${i}. ${src}. Location: ${l}.\nSearch competitor pricing in ${l}.\n\n`;
    const p = {
      restaurant: base + `## Menu Assessment\n## Pricing Psychology (underpriced/overpriced/anchors)\n## Layout Optimization (golden triangle, placement)\n## Description Rewrites (5 items)\n## Bundle/Combo Ideas (3)\n## Estimated Revenue Impact`,
      dental: base + `## Current Pricing\n## Market Comparison (cleanings, fillings, crowns, implants, whitening, Invisalign)\n## Underpriced Services [+ new price + $ impact]\n## Insurance vs Cash-Pay Strategy\n## High-Margin Elective Opportunities\n## Package Ideas (3: New Patient, Smile Makeover, Family)\n## Fee Schedule Presentation Tips\n## Estimated Revenue Impact`,
      salon: base + `## Service Menu Assessment\n## Market Comparison\n## Tiered Pricing (junior/senior/master)\n## Package Ideas (3: Bridal, Monthly, First Visit)\n## Add-On Upsells (conditioning, scalp, etc.)\n## Seasonal Pricing Strategy\n## Estimated Revenue Impact`,
      legal: base + `## Fee Structure Assessment\n## Market Comparison (consultations, hourly, flat fees, retainers)\n## Hourly vs Flat Fee Analysis [which services]\n## Consultation Fee Strategy (free vs paid)\n## Retainer Packages (3)\n## Value-Based Pricing Opportunities\n## Payment Plans\n## Estimated Revenue Impact`,
      medical: base + `## Current Pricing\n## Market Comparison\n## Insurance vs Cash-Pay Optimization\n## Elective/Wellness Services to Promote\n## Membership/Concierge Models\n## Package Ideas\n## Estimated Revenue Impact`,
      homeservice: base + `## Current Rates\n## Market Comparison\n## Flat Fee vs Time & Materials [by job type]\n## Emergency/After-Hours Premiums\n## Minimum Service Call Fee\n## Service Tiers (Basic/Full/Premium with Warranty)\n## Maintenance Plan Upsells\n## Seasonal Strategy\n## Estimated Revenue Impact`,
      fitness: base + `## Membership Assessment\n## Market Comparison\n## Tier Optimization (Basic/Premium/VIP)\n## Class Pack vs Unlimited Analysis\n## Personal Training Rates\n## Add-Ons (nutrition, merch, specialty classes)\n## Retention Pricing (annual, family, corporate)\n## Estimated Revenue Impact`,
      retail: base + `## Current Pricing\n## Competitor Comparison\n## Pricing Psychology (charm, anchoring, decoys)\n## Bundle Opportunities (3)\n## Cross-Sell Recommendations\n## Promotional Strategy\n## Estimated Revenue Impact`,
      realestate: base + `## Commission Structure\n## Market Comparison\n## Service Tiers (Basic/Full/Concierge)\n## Value-Add Services (staging, photography, drone, virtual tours)\n## Referral Fee Structure\n## Estimated Revenue Impact`,
      general: base + `## Current Assessment\n## Market Comparison\n## Underpriced [+ new price + impact]\n## Overpriced\n## Package/Bundle Ideas (3)\n## Pricing Psychology\n## Upsell Opportunities\n## Estimated Revenue Impact`,
    };
    return p[i] || p.general;
  }, { highTokens: true });
  const [locWarn, setLocWarn] = useState(false);
  const handleGo = () => {
    if (!url.trim() && !desc.trim()) { setValErr("Enter URL or description"); return; }
    if (!loc.trim() && !locWarn) { setLocWarn(true); return; }
    setValErr(""); setLocWarn(false); go(ind, url, loc, desc); };
  return <div>
    <p style={{ color: TG, fontSize: 13, marginBottom: 14 }}>Industry-specific pricing analysis vs local competitors.</p>
    <S label="Business Type" value={ind} onChange={setInd} options={INDUSTRIES} />
    <I label="Website" value={url} onChange={v => { setUrl(v); setValErr(""); }} placeholder="https://..." error={!url && !desc && valErr ? valErr : ""} />
    <I label="Location" value={loc} onChange={v => { setLoc(v); setLocWarn(false); }} placeholder="e.g. Austin, TX" />
    {locWarn && <p style={{ color: "#EAB308", fontSize: 12, marginTop: -10, marginBottom: 14, padding: "8px 12px", background: "#FEFCE8", borderRadius: 6, border: "1px solid #FDE68A" }}>⚠️ Location helps find local competitor pricing. <button onClick={handleGo} style={{ background: T, color: "#fff", border: "none", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginLeft: 6 }}>Continue anyway</button></p>}
    <I label="Or describe pricing" value={desc} onChange={v => { setDesc(v); setValErr(""); }} placeholder="e.g. Cleanings $150, crowns $900..." multi />
    <B onClick={handleGo} loading={ld} label="💰 Optimize Pricing" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Analyzing..." long />}<R data={res} onRegenerate={handleGo} genId={genId} /></div>;
}

function CompActivity() {
  const bc = useContext(BizCtx);
  const [comps, setComps] = useState(bc?.competitors?.filter(c => c.trim()).join(", ") || ""); const [loc, setLoc] = useState(bc?.location || ""); const [ind, setInd] = useState(bc?.industry || "dental"); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((c, l, i) =>
    `Intel analyst. Search EACH competitor.\nCompetitors: ${c}. Location: ${l}. Industry: ${i}.\n\nPer competitor:\n### [Name]\n**FB Ads:** **Social:** **Promos:** **GBP:**\n\n## Opportunities\n## Counter-Campaigns`, { highTokens: true });
  const handleGo = () => { if (!comps.trim()) { setValErr("Enter names"); return; } setValErr(""); go(comps, loc, ind); };
  return <div><I label="Competitors (comma separated)" value={comps} onChange={v => { setComps(v); setValErr(""); }} placeholder="e.g. Valley Dental, Smile Center" required error={valErr} />
    <I label="Location" value={loc} onChange={setLoc} placeholder="e.g. Austin, TX" />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <B onClick={handleGo} loading={ld} label="📡 Track" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Monitoring..." long />}<R data={res} onRegenerate={() => go(comps, loc, ind)} genId={genId} /></div>;
}

function StealCustomers() {
  const bc = useContext(BizCtx);
  const [biz, setBiz] = useState(bc?.name || ""); const [loc, setLoc] = useState(bc?.location || ""); const [ind, setInd] = useState(bc?.industry || "dental");
  const [strengths, setStrengths] = useState(""); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((b, l, i, s) =>
    `Competitive strategist. Business: ${b}. Location: ${l}. Industry: ${i}.${s ? ` Strengths: ${s}` : ""}\n\nSearch for competitors with BAD reviews in ${l}.\n\nPer weak competitor:\n### [Name] — [Rating] ([Count])\n**Complaints:** **Your Advantage:** **Ad:** **Social Post:** **Google Ad:**\n\n## Top 3 Weaknesses [ranked]`, { highTokens: true });
  const handleGo = () => { if (!biz.trim()) { setValErr("Required"); return; } setValErr(""); go(biz, loc, ind, strengths); };
  return <div><I label="Your Business" value={biz} onChange={v => { setBiz(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <I label="Location" value={loc} onChange={setLoc} placeholder="e.g. Austin, TX" />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <I label="Your strengths (optional)" value={strengths} onChange={setStrengths} placeholder="e.g. Same-day appointments" />
    <B onClick={handleGo} loading={ld} label="🎯 Find Weaknesses" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Analyzing..." long />}<R data={res} onRegenerate={() => go(biz, loc, ind, strengths)} genId={genId} /></div>;
}

function HealthDash() {
  const bc = useContext(BizCtx);
  const [biz, setBiz] = useState(bc?.name || ""); const [loc, setLoc] = useState(bc?.location || ""); const [ind, setInd] = useState(bc?.industry || "dental");
  const [ld, setLd] = useState(false); const [data, setData] = useState(null); const [fallback, setFallback] = useState(null); const [valErr, setValErr] = useState("");
  const go = async () => {
    if (!biz.trim()) { setValErr("Required"); return; }
    setValErr(""); setLd(true); setData(null); setFallback(null);
    const raw = await ask(`Business health analyst. Search "${biz}" in ${loc}. Industry: ${ind}.\n\nReturn ONLY valid JSON:\n{"business":"${biz}","overall":72,"reputation":{"score":65,"detail":"..."},"visibility":{"score":58,"detail":"..."},"marketing":{"score":42,"detail":"..."},"competitive":{"score":71,"detail":"..."},"top_fixes":[{"fix":"action","impact":"$X/mo","engine":"Engine"}],"est_monthly_loss":"$3,800"}\n\nUse REAL data.`);
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      const m = clean.match(/\{[\s\S]*\}/);
      if (m) { const d = JSON.parse(m[0]); if (d.overall != null) { setData(d); setLd(false); return; } }
      setFallback(raw);
    } catch { setFallback(raw); }
    setLd(false);
  };
  const ScoreBar = ({ label, score, detail }) => {
    const s = score ?? 0;
    return <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, fontWeight: 600, color: TX }}>{label}</span><span style={{ fontSize: 13, fontWeight: 800, color: s >= 70 ? "#22C55E" : s >= 50 ? "#EAB308" : "#EF4444" }}>{s}/100</span></div>
      <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: `${s}%`, background: s >= 70 ? "#22C55E" : s >= 50 ? "#EAB308" : "#EF4444", borderRadius: 4, transition: "width 1s ease" }} /></div>
      <p style={{ fontSize: 11, color: TG, marginTop: 4, lineHeight: 1.5 }}>{detail || "No data"}</p></div>;
  };
  if (!data && !fallback) return <div>
    <p style={{ color: TG, fontSize: 13, marginBottom: 14 }}>Health score across 4 dimensions.</p>
    <I label="Business" value={biz} onChange={v => { setBiz(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <I label="Location" value={loc} onChange={setLoc} placeholder="e.g. Austin, TX" />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <B onClick={go} loading={ld} label="📊 Generate" />{ld && <Ld msg="Analyzing..." long />}</div>;
  if (fallback) return <div>
    <p style={{ color: "#EAB308", fontSize: 12, marginBottom: 12 }}>⚠️ Text analysis (visual unavailable):</p>
    <R data={parse(fallback)} onRegenerate={go} genId={0} />
    <button onClick={() => { setData(null); setFallback(null); }} style={{ marginTop: 12, padding: "8px 16px", fontSize: 11, color: TG, background: "none", border: `1px solid ${BD}`, borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>Retry</button></div>;
  return <div>
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 100, height: 100, borderRadius: "50%", border: `4px solid ${(data.overall??0) >= 70 ? "#22C55E" : (data.overall??0) >= 50 ? "#EAB308" : "#EF4444"}`, marginBottom: 8 }}><span style={{ fontSize: 32, fontWeight: 800, color: TX }}>{data.overall ?? "?"}</span></div>
      <p style={{ fontSize: 14, fontWeight: 700, color: TX, margin: "4px 0" }}>Health Score</p>
      {data.est_monthly_loss && <p style={{ fontSize: 12, color: TG }}>Est. loss: <strong style={{ color: "#EF4444" }}>{data.est_monthly_loss}</strong></p>}
    </div>
    <ScoreBar label="⭐ Reputation" score={data.reputation?.score} detail={data.reputation?.detail} />
    <ScoreBar label="👁️ Visibility" score={data.visibility?.score} detail={data.visibility?.detail} />
    <ScoreBar label="📱 Marketing" score={data.marketing?.score} detail={data.marketing?.detail} />
    <ScoreBar label="🏆 Competitive" score={data.competitive?.score} detail={data.competitive?.detail} />
    {data.top_fixes?.length > 0 && <><h3 style={{ margin: "20px 0 10px", fontSize: 14, fontWeight: 700, color: TX }}>Top Fixes</h3>
      {data.top_fixes.map((f, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: i === 0 ? `${T}08` : "#FAFBFC", borderRadius: 8, marginBottom: 8, border: `1px solid ${i === 0 ? T+"20" : BD}` }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: i === 0 ? T : "#E2E8F0", color: i === 0 ? "#fff" : TG, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i+1}</div>
        <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: TX }}>{f.fix}</div><div style={{ fontSize: 11, color: TG, marginTop: 2 }}>Potential: <strong style={{ color: "#22C55E" }}>{f.impact}</strong> · {f.engine}</div></div>
      </div>)}</>}
    <button onClick={() => { setData(null); setFallback(null); }} style={{ marginTop: 14, padding: "8px 16px", fontSize: 11, color: TG, background: "none", border: `1px solid ${BD}`, borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>New Scan</button></div>;
}

function TrendRadar() {
  const bc = useContext(BizCtx);
  const [loc, setLoc] = useState(bc?.location || ""); const [ind, setInd] = useState(bc?.industry || "dental"); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((l, i) =>
    `Market analyst. Search news and local activity for ${i} in ${l}.\n\n## Trending in ${i} — ${l}\n### Rising Topics [5-8]\n### Seasonal Opportunity [30 days]\n### Competitor Activity\n### Consumer Shifts\n### 3 Actions This Week\n### Content Ideas (5)\n### Promotion [ready copy]\n\nNote: Based on web search, not Google Trends.`);
  const handleGo = () => { if (!loc.trim()) { setValErr("Required"); return; } setValErr(""); go(loc, ind); };
  return <div><I label="Location" value={loc} onChange={v => { setLoc(v); setValErr(""); }} placeholder="e.g. Austin, TX" required error={valErr} />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <B onClick={handleGo} loading={ld} label="📡 Scan" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Scanning..." />}<R data={res} onRegenerate={() => go(loc, ind)} genId={genId} /></div>;
}

function IntegrationMgr() {
  const [clicked, setClicked] = useState({});
  const igs = [
    { name: "Google Business Profile", icon: "🔵", desc: "Reviews, ratings", tier: "Core" },
    { name: "Facebook", icon: "📘", desc: "Posts, DM bot, ads", tier: "Plus" },
    { name: "Instagram", icon: "📸", desc: "Posts, DM bot", tier: "Plus" },
    { name: "Analytics", icon: "📊", desc: "Traffic, behavior", tier: "Pro" },
    { name: "Stripe", icon: "💳", desc: "Payments", tier: "Pro" },
    { name: "GoHighLevel", icon: "⚡", desc: "Full automation", tier: "$500 MRR" },
    { name: "Calendar", icon: "📅", desc: "Appointments", tier: "Plus" },
    { name: "WhatsApp", icon: "💬", desc: "WhatsApp bot", tier: "Future" },
  ];
  return <div>
    <p style={{ color: TG, fontSize: 13, marginBottom: 18 }}>Connect accounts to unlock automation.</p>
    {igs.map((ig, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "#FAFBFC", borderRadius: 9, marginBottom: 8, border: `1px solid ${BD}` }}>
      <span style={{ fontSize: 22 }}>{ig.icon}</span>
      <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: TX }}>{ig.name}</div><div style={{ fontSize: 11, color: TG }}>{ig.desc}</div></div>
      <button onClick={() => setClicked(p => ({ ...p, [ig.name]: true }))} style={{ padding: "7px 14px", fontSize: 11, fontWeight: 600, background: CD, color: clicked[ig.name] ? T : TG, border: `1px solid ${clicked[ig.name] ? T : BD}`, borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>
        {clicked[ig.name] ? `At ${ig.tier}` : "Connect"}</button>
    </div>)}
  </div>;
}

function HireTrain() {
  const bc = useContext(BizCtx);
  const [mode, setMode] = useState("post"); const [biz, setBiz] = useState(bc?.name || ""); const [role, setRole] = useState(""); const [ind, setInd] = useState(bc?.industry || "dental");
  const [notes, setNotes] = useState(""); const [notes2, setNotes2] = useState(""); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((m, b, r, i, n, n2) => {
    if (m === "post") return `HR specialist. Business: ${b}. Industry: ${i}. Role: ${r}.\n\n## Job Posting\n## 10 Interview Questions [with good answers]\n## Red Flags (5)\n## Compensation Benchmark`;
    if (m === "assess") return `HR assessor. Role: ${r}. Industry: ${i}.\nCandidate 1:\n${n}\n${n2 ? `Candidate 2:\n${n2}\n\n## Comparison\n` : ""}## Assessment\n### Strengths/Concerns/Fit/Salary/Recommendation/Follow-Up`;
    return `Trainer. Business: ${b}. Industry: ${i}. Role: ${r}.\n\n## Day 1 Checklist\n## Policies (10 Q&As)\n## Scenarios (5)\n## Role Training\n## FAQ (10)\n## 30-Day Milestones\n## Quick Reference`;
  }, { highTokens: true, noSearch: true });
  const handleGo = () => {
    if (!role.trim()) { setValErr("Role required"); return; }
    if (mode === "assess" && !notes.trim()) { setValErr("Candidate notes required"); return; }
    setValErr(""); go(mode, biz, role, ind, notes, notes2); };
  return <div>
    <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>{[["post","📝 Job"],["assess","🎯 Assess"],["train","📚 Train"]].map(([m,l]) => <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px", background: mode === m ? T : "transparent", color: mode === m ? "#fff" : TG, border: `1.5px solid ${mode === m ? T : BD}`, borderRadius: 7, fontWeight: 600, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>)}</div>
    <I label="Business" value={biz} onChange={setBiz} placeholder="e.g. Sunrise Dental" />
    <I label="Role" value={role} onChange={v => { setRole(v); setValErr(""); }} placeholder="e.g. Front Desk" required error={valErr} />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    {mode === "assess" && <><I label="Candidate 1" value={notes} onChange={setNotes} placeholder="Notes..." multi required />
      <I label="Candidate 2 (optional)" value={notes2} onChange={setNotes2} placeholder="For comparison..." multi /></>}
    <B onClick={handleGo} loading={ld} label={mode === "post" ? "📝 Create" : mode === "assess" ? "🎯 Assess" : "📚 Guide"} />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Working..." long />}<R data={res} onRegenerate={handleGo} genId={genId} /></div>;
}

function StaffPlanner() {
  const bc = useContext(BizCtx);
  const [biz, setBiz] = useState(bc?.name || ""); const [ind, setInd] = useState(bc?.industry || "restaurant"); const [hours, setHours] = useState("");
  const [staff, setStaff] = useState(""); const [busy, setBusy] = useState(""); const [scratch, setScratch] = useState(false); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((b, i, h, s, bu, fs) =>
    `Staffing specialist. Business: ${b}. Industry: ${i}. Hours: ${h||"N/A"}\n${fs ? "NEW — build from norms." : `Staff: ${s||"N/A"}\nBusy: ${bu||"N/A"}`}\n\n## Traffic Patterns\n## Optimal Schedule [Mon-Sun]\n${fs ? "## Starting Team Recommendation" : "## Current vs Optimal"}\n## Cost Optimization\n## Shift Templates\n## Seasonal Adjustments`, { highTokens: true, noSearch: true });
  const handleGo = () => { if (!biz.trim()) { setValErr("Required"); return; } setValErr(""); go(biz, ind, hours, staff, busy, scratch); };
  return <div>
    <I label="Business" value={biz} onChange={v => { setBiz(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <div onClick={() => setScratch(!scratch)} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "8px 12px", background: scratch ? `${T}08` : "#FAFBFC", borderRadius: 8, border: `1px solid ${scratch ? T+"30" : BD}`, cursor: "pointer" }}>
      <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${scratch ? T : BD}`, background: scratch ? T : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{scratch && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}</div>
      <span style={{ fontSize: 12, color: TX }}>Starting from scratch</span>
    </div>
    <I label="Hours" value={hours} onChange={setHours} placeholder="e.g. Mon-Fri 8am-6pm" />
    {!scratch && <><I label="Staff" value={staff} onChange={setStaff} placeholder="e.g. 2 dentists, 3 hygienists" /><I label="Busy Times" value={busy} onChange={setBusy} placeholder="e.g. Monday mornings" /></>}
    <B onClick={handleGo} loading={ld} label="📅 Optimize" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Analyzing..." long />}<R data={res} onRegenerate={handleGo} genId={genId} /></div>;
}

function CrisisIntel() {
  const bc = useContext(BizCtx);
  const [mode, setMode] = useState("respond"); const [biz, setBiz] = useState(bc?.name || ""); const [situation, setSituation] = useState(""); const [ind, setInd] = useState(bc?.industry || "dental"); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((m, b, s, i) => m === "respond"
    ? `Crisis consultant. Business: ${b}. Industry: ${i}.\nCrisis: ${s}\n\n## Severity [1-10]\n## Immediate (2hr)\n## Public Statement [under 200 words]\n## Direct Response\n## Team Comms\n## Recovery (Day 1-7)\n## Prevention (3)\n## Legal Notes`
    : `Prevention analyst. Search ${b}. Industry: ${i}.\n\n## Reputation Risks\n## Operational Risks\n## Vulnerabilities\n## Warnings (5)\n## Prevention (10)\n## Contacts\n## Template`, { highTokens: true });
  const handleGo = () => {
    if (!biz.trim()) { setValErr("Required"); return; }
    if (mode === "respond" && !situation.trim()) { setValErr("Describe crisis"); return; }
    setValErr(""); go(mode, biz, situation, ind); };
  return <div>
    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>{[["respond","🚨 Respond"],["prevent","🛡️ Prevent"]].map(([m,l]) => <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px", background: mode === m ? T : "transparent", color: mode === m ? "#fff" : TG, border: `1.5px solid ${mode === m ? T : BD}`, borderRadius: 7, fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>{l}</button>)}</div>
    <I label="Business" value={biz} onChange={v => { setBiz(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={!biz && valErr ? valErr : ""} />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    {mode === "respond" && <I label="Crisis" value={situation} onChange={v => { setSituation(v); setValErr(""); }} placeholder="e.g. Hair in food, 400+ shares..." multi required error={mode==="respond" && !situation && valErr ? valErr : ""} />}
    <B onClick={handleGo} loading={ld} label={mode === "respond" ? "🚨 Plan" : "🛡️ Scan"} />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Working..." long />}<R data={res} onRegenerate={handleGo} genId={genId} /></div>;
}

function StrategySim() {
  const bc = useContext(BizCtx);
  const [biz, setBiz] = useState(bc?.name || ""); const [loc, setLoc] = useState(bc?.location || ""); const [ind, setInd] = useState(bc?.industry || "dental"); const [q, setQ] = useState(""); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((b, l, i, question) =>
    `Strategist. ${b ? `Business: ${b}.` : ""} ${l ? `Location: ${l}.` : ""} Industry: ${i}.\n\nOwner asks: "${question}"\n\nSearch for data.\n\n## Scenario: "${question}"\n### Current Situation\n### Best Case (25%)\n### Most Likely (50%)\n### Worst Case (25%)\n### Financial [cost, break-even, ROI]\n### Risks (3)\n### Competitors\n### Recommendation [yes/no + 3 steps]\n### Alternatives (2)\n\n**Disclaimer: AI-modeled. Not financial advice.**`, { highTokens: true });
  const handleGo = () => { if (!q.trim()) { setValErr("Required"); return; } setValErr(""); go(biz, loc, ind, q); };
  return <div>
    <p style={{ color: TG, fontSize: 13, marginBottom: 14 }}>Test decisions before risking money.</p>
    <I label="Business" value={biz} onChange={setBiz} placeholder="e.g. Sunrise Dental" />
    <I label="Location" value={loc} onChange={setLoc} placeholder="e.g. Austin, TX" />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <I label="What if...?" value={q} onChange={v => { setQ(v); setValErr(""); }} placeholder="e.g. Raise prices 15%?" multi required error={valErr} />
    <B onClick={handleGo} loading={ld} label="🔮 Simulate" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Modeling..." long />}<R data={res} onRegenerate={() => go(biz, loc, ind, q)} genId={genId} /></div>;
}

function PartnerFinder() {
  const bc = useContext(BizCtx);
  const [biz, setBiz] = useState(bc?.name || ""); const [loc, setLoc] = useState(bc?.location || ""); const [ind, setInd] = useState(bc?.industry || "dental"); const [valErr, setValErr] = useState("");
  const { ld, res, go, err, genId } = useTool((b, l, i) =>
    `Partnership strategist. Business: ${b}. Location: ${l}. Industry: ${i}.\n\nSearch for non-competing businesses sharing demographics.\n\nPer partner (5-8):\n### [Name] — [Type]\n**Match:** **Reach:** **Cross-Promo:** **Outreach Message:**\n\n## Top 3\n## Agreement Template\n## Campaign Ideas`, { highTokens: true });
  const handleGo = () => { if (!biz.trim()) { setValErr("Required"); return; } setValErr(""); go(biz, loc, ind); };
  return <div>
    <p style={{ color: TG, fontSize: 13, marginBottom: 14 }}>Find businesses sharing customers but not competing.</p>
    <I label="Business" value={biz} onChange={v => { setBiz(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <I label="Location" value={loc} onChange={setLoc} placeholder="e.g. Austin, TX" />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <B onClick={handleGo} loading={ld} label="🤝 Find" />
    {err && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 8 }}>{err}</p>}
    {ld && <Ld msg="Finding..." long />}<R data={res} onRegenerate={() => go(biz, loc, ind)} genId={genId} /></div>;
}

// ========== NEW PLATFORM TOOLS ==========

// Site Health Scanner — real SEO audit, structured JSON output
function SiteHealthScanner() {
  const biz = useContext(BizCtx);
  const proof = useContext(ProofCtx);
  const [url, setUrl] = useState(biz?.url || ""); const [ld, setLd] = useState(false);
  const [data, setData] = useState(null); const [fallback, setFallback] = useState(null); const [valErr, setValErr] = useState("");
  const go = async () => {
    if (!url.trim()) { setValErr("URL required"); return; }
    setValErr(""); setLd(true); setData(null); setFallback(null);
    const raw = await ask(`You are an SEO auditor. You MUST search and fetch the website at: ${url.trim()}

Analyze the ACTUAL HTML and return ONLY valid JSON (no markdown, no explanation):
{"url":"${url.trim()}","score":0,"checks":[
{"name":"Title Tag","status":"pass|warn|fail","found":"actual value or null","recommendation":"fix text"},
{"name":"Meta Description","status":"...","found":"...","recommendation":"..."},
{"name":"H1 Tag","status":"...","found":"...","recommendation":"..."},
{"name":"H2 Structure","status":"...","found":"count found","recommendation":"..."},
{"name":"Image Alt Text","status":"...","found":"X of Y missing","recommendation":"..."},
{"name":"HTTPS","status":"...","found":"yes/no","recommendation":"..."},
{"name":"Mobile Viewport","status":"...","found":"present/missing","recommendation":"..."},
{"name":"Schema Markup","status":"...","found":"type or none","recommendation":"..."},
{"name":"Sitemap.xml","status":"...","found":"exists/missing","recommendation":"..."},
{"name":"Robots.txt","status":"...","found":"exists/missing","recommendation":"..."},
{"name":"Open Graph Tags","status":"...","found":"present/missing","recommendation":"..."},
{"name":"Canonical Tag","status":"...","found":"present/missing","recommendation":"..."},
{"name":"Click-to-Call","status":"...","found":"tel: link present/missing","recommendation":"..."},
{"name":"Page Speed Indicators","status":"...","found":"HTML size, script count","recommendation":"..."},
{"name":"Internal Links","status":"...","found":"count","recommendation":"..."}
],"summary":"2-sentence overall assessment"}`);
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      const m = clean.match(/\{[\s\S]*\}/);
      if (m) { const d = JSON.parse(m[0]); if (d.checks) {
        // Pass = 1 point, Warn = 0.5 points, Fail = 0
        d.score = Math.round(d.checks.reduce((sum, c) => sum + (c.status === "pass" ? 1 : c.status === "warn" ? 0.5 : 0), 0) / d.checks.length * 100);
        setData(d); proof.bump("scans"); setLd(false); return;
      }}
      setFallback(raw);
    } catch { setFallback(raw); }
    setLd(false);
  };
  const statusIcon = (s) => s === "pass" ? "✅" : s === "warn" ? "⚠️" : "❌";
  const statusColor = (s) => s === "pass" ? "#22C55E" : s === "warn" ? "#EAB308" : "#EF4444";
  if (data) return <div>
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 90, height: 90, borderRadius: "50%", border: `4px solid ${data.score >= 70 ? "#22C55E" : data.score >= 50 ? "#EAB308" : "#EF4444"}`, marginBottom: 8 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: TX }}>{data.score}</span></div>
      <p style={{ fontSize: 14, fontWeight: 700, color: TX }}>SEO Health Score</p>
      <p style={{ fontSize: 12, color: TG }}>{data.summary}</p>
    </div>
    {data.checks.map((c, i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: i % 2 === 0 ? "#FAFBFC" : CD, borderRadius: 6, marginBottom: 4 }}>
      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{statusIcon(c.status)}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: TX }}>{c.name}</div>
        {c.found && <div style={{ fontSize: 11, color: TG, marginTop: 2 }}>Found: {c.found}</div>}
        {c.status !== "pass" && <div style={{ fontSize: 11, color: statusColor(c.status), marginTop: 2 }}>{c.recommendation}</div>}
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color: statusColor(c.status), textTransform: "uppercase", flexShrink: 0 }}>{c.status}</span>
    </div>)}
    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
      <button onClick={() => { setData(null); setFallback(null); }} style={{ flex: 1, padding: "10px", background: T, color: "#fff", border: "none", borderRadius: 7, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Scan Another</button>
      <CopyBtn text={data.checks.filter(c => c.status !== "pass").map(c => `${c.status.toUpperCase()}: ${c.name} — ${c.recommendation}`).join("\n")} label="Copy Issues" />
    </div>
  </div>;
  if (fallback) return <div>
    <p style={{ color: "#EAB308", fontSize: 12, marginBottom: 12 }}>Visual report unavailable. Text analysis:</p>
    <R data={parse(fallback)} onRegenerate={go} genId={0} />
    <button onClick={() => { setData(null); setFallback(null); }} style={{ marginTop: 12, padding: "8px 16px", fontSize: 11, color: TG, background: "none", border: `1px solid ${BD}`, borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>Retry</button></div>;
  return <div>
    <p style={{ color: TG, fontSize: 13, marginBottom: 14 }}>AI-powered SEO audit. Analyzes your website's structure, meta tags, schema, and more. Checks 15 technical factors.</p>
    <I label="Website URL" value={url} onChange={v => { setUrl(v); setValErr(""); }} placeholder="https://example.com" required error={valErr} />
    <B onClick={go} loading={ld} label="🔍 Scan Website" />{ld && <Ld msg="Fetching and analyzing HTML..." long />}
  </div>;
}


// ========== BIZSCORER v2 — Comprehensive Rule-Based Scoring Engine ==========
// Architecture: Claude/serverless fetches raw data → pure code scores everything
// Borrowed from: Birdeye (multi-dimension), BrightLocal (local SEO focus), Podium (conversion emphasis)

const IND_DATA = {
  dental:      { ltv: 4200, avgTicket: 350, monthlySearches: 2400, avgReviews: 85, avgRating: 4.4, topRating: 4.7, convRate: 0.035, label: "Patient", plural: "patients" },
  restaurant:  { ltv: 1800, avgTicket: 45,  monthlySearches: 8000, avgReviews: 150, avgRating: 4.2, topRating: 4.5, convRate: 0.045, label: "Customer", plural: "customers" },
  salon:       { ltv: 2400, avgTicket: 85,  monthlySearches: 3200, avgReviews: 65, avgRating: 4.5, topRating: 4.8, convRate: 0.04, label: "Client", plural: "clients" },
  medical:     { ltv: 3600, avgTicket: 250, monthlySearches: 1800, avgReviews: 55, avgRating: 4.3, topRating: 4.6, convRate: 0.03, label: "Patient", plural: "patients" },
  legal:       { ltv: 8000, avgTicket: 2000,monthlySearches: 1200, avgReviews: 35, avgRating: 4.2, topRating: 4.7, convRate: 0.025, label: "Client", plural: "clients" },
  fitness:     { ltv: 1500, avgTicket: 65,  monthlySearches: 4000, avgReviews: 75, avgRating: 4.3, topRating: 4.6, convRate: 0.04, label: "Member", plural: "members" },
  homeservice: { ltv: 3200, avgTicket: 450, monthlySearches: 2000, avgReviews: 45, avgRating: 4.4, topRating: 4.7, convRate: 0.035, label: "Customer", plural: "customers" },
  retail:      { ltv: 2000, avgTicket: 60,  monthlySearches: 5000, avgReviews: 55, avgRating: 4.1, topRating: 4.5, convRate: 0.03, label: "Customer", plural: "customers" },
  realestate:  { ltv: 12000,avgTicket: 8000,monthlySearches: 900,  avgReviews: 30, avgRating: 4.5, topRating: 4.8, convRate: 0.02, label: "Client", plural: "clients" },
  general:     { ltv: 2500, avgTicket: 150, monthlySearches: 2000, avgReviews: 50, avgRating: 4.3, topRating: 4.6, convRate: 0.03, label: "Customer", plural: "customers" },
};

function scoreBiz(raw, industry) {
  const D = IND_DATA[industry] || IND_DATA.general;
  const r = raw.reviews || {}; const s = raw.seo || {};
  const c = (raw.competitors || []).filter(x => (x.reviews > 0 || x.rating > 0));
  const hasWebsite = s.hasTitle != null;
  const hasReviews = r.count != null && r.count > 0;
  const hasGBP = r.count != null;

  const dims = {};
  const fixes = [];
  let totalLoss = 0;
  const addFix = (fix, lossAmt, engine, tier, priority) => {
    fixes.push({ fix, impact: Math.round(lossAmt), engine, tier: tier || "Core", priority: priority || "medium", impactLabel: `$${Math.round(lossAmt).toLocaleString()}/mo` });
    totalLoss += lossAmt;
  };

  // ---------- 1. REPUTATION (30% weight) ----------
  let rep = 0;
  if (hasGBP) {
    const volRatio = Math.min((r.count || 0) / D.avgReviews, 2);
    rep += Math.round(volRatio * 30);
    rep += (r.rating >= 4.8 ? 30 : r.rating >= 4.5 ? 25 : r.rating >= 4.2 ? 18 : r.rating >= 4.0 ? 12 : r.rating >= 3.5 ? 6 : 0);
    rep += ((r.responseRate || 0) >= 90 ? 20 : (r.responseRate || 0) >= 70 ? 16 : (r.responseRate || 0) >= 50 ? 12 : (r.responseRate || 0) >= 25 ? 6 : 0);
    const pos = r.recentPositive || 0; const neg = r.recentNegative || 0;
    rep += (neg === 0 && pos > 0 ? 20 : neg <= 1 && pos >= 3 ? 15 : pos > neg ? 10 : 5);

    if ((r.count || 0) < 10) addFix(`Only ${r.count || 0} reviews — new ${D.plural} need social proof. Most won't book under 20.`, D.ltv * 0.08, "Auto Review Kit", "Core", "critical");
    else if ((r.count || 0) < D.avgReviews) { const gap = D.avgReviews - r.count; addFix(`Get ${gap} more reviews to match average (${D.avgReviews}). Each review = ~$15/mo in trust.`, gap * 15, "Auto Review Kit", "Core", "high"); }
    if ((r.responseRate || 0) < 70) addFix(`Respond to all reviews — you're at ${r.responseRate || 0}%, top businesses hit 90%+. Unanswered reviews signal neglect.`, D.ltv * 0.03, "Review Responses", "Core", "high");
    if (r.rating && r.rating < D.topRating) addFix(`Improve ${r.rating} → ${D.topRating} rating with a review funnel that routes unhappy ${D.plural} to private feedback.`, D.ltv * 0.05, "Review Funnel", "Core", "high");
  } else {
    rep = 5;
    addFix(`Claim your Google Business Profile — you're invisible to local searchers. This is free and takes 10 minutes.`, D.ltv * 0.15, "Reputation Boost", "Core", "critical");
  }
  dims.reputation = Math.min(rep, 100);

  // ---------- 2. FINDABILITY (25% weight) ----------
  let seo = 0;
  if (hasWebsite) {
    const checks = [
      [s.hasTitle, 10, "Add SEO title tag — Google shows this as your headline in search results", 0.02],
      [s.hasMeta, 8, "Add meta description — this is your ad copy in search results. Without it, Google picks random text.", 0.015],
      [s.hasH1, 6, "Add a clear H1 heading — tells Google what your page is about", 0.01],
      [s.hasSchema, 14, "Add LocalBusiness schema — unlocks rich results with stars, hours, and phone in Google", 0.04],
      [s.isHttps, 10, "Switch to HTTPS — Google penalizes insecure sites and browsers show security warnings", 0.03],
      [s.hasMobile, 12, "Make your site mobile-friendly — 60%+ of local searches are on phones", 0.04],
      [s.hasSitemap, 6, "Add XML sitemap — helps Google find all your pages faster", 0.01],
      [s.hasAltText, 6, "Add alt text to images — improves SEO and accessibility", 0.01],
      [s.hasClickToCall, 10, "Add clickable phone number — mobile visitors can't copy-paste", 0.03],
      [s.hasCanonical, 4, "Add canonical tags to prevent duplicate content issues", 0.005],
      [s.hasRobotsTxt, 4, "Add robots.txt to control Google's crawling", 0.005],
      [s.hasInternalLinks, 5, "Improve internal linking to help Google understand site structure", 0.01],
      [s.hasFastLoad, 5, "Improve page speed — slow sites lose 53% of mobile visitors", 0.02],
    ];
    for (const [pass, pts, fix, mult] of checks) {
      if (pass) seo += pts; else addFix(fix, D.ltv * mult, "SEO Scanner", "Core", mult >= 0.03 ? "high" : "medium");
    }
  } else {
    seo = 3;
    addFix(`Build a website — ${D.monthlySearches.toLocaleString()} people search for ${industry} in your area monthly. Without a site, you capture zero.`, D.ltv * 0.15, "Zidly Pages", "Core", "critical");
  }
  dims.findability = Math.min(seo, 100);

  // ---------- 3. CONVERSION (20% weight) ----------
  let conv = 0;
  if (hasWebsite) {
    if (s.hasChatWidget) conv += 25; else addFix(`Install AI chatbot — at 10pm when ${D.plural} search, your competitors' sites are dead. Yours answers instantly.`, D.ltv * 0.08, "Webchat Bot", "Core", "critical");
    if (s.hasBookingLink) conv += 20; else addFix(`Add online booking — 67% of ${D.plural} prefer self-scheduling over calling`, D.ltv * 0.05, "Operations", "Core", "high");
    if (s.hasClickToCall) conv += 15;
    if (s.hasSocial) conv += 10;
    if ((r.rating || 0) >= 4.5) conv += 15; else if ((r.rating || 0) >= 4.0) conv += 8;
    if ((r.count || 0) >= 20) conv += 10; else if (hasReviews) addFix(`Under 20 reviews tanks conversion — 84% trust reviews as much as personal recommendations`, D.ltv * 0.04, "Auto Review Kit", "Core", "high");
    if (s.hasFormOrCTA) conv += 5;
  } else {
    conv = 5;
    addFix(`No website = no conversion funnel. Every searcher who can't find you goes to a competitor with one.`, D.ltv * 0.1, "Zidly Pages", "Core", "critical");
  }
  dims.conversion = Math.min(conv, 100);

  // ---------- 4. MARKETING (15% weight) ----------
  let mkt = 0;
  if (hasWebsite) {
    if (s.hasSocial) mkt += 18; else addFix("Link social profiles on your website — builds trust and keeps visitors in your ecosystem", D.ltv * 0.015, "Content Fuel", "Plus", "medium");
    if (s.hasOG) mkt += 12; else addFix("Add Open Graph tags — when someone shares your site, it looks broken without them", D.ltv * 0.01, "SEO Scanner", "Core", "low");
    if (s.hasBlog) mkt += 15; else addFix(`Start a blog — each post is a new page Google ranks. "${industry} tips" articles drive free long-tail traffic`, D.ltv * 0.02, "Blog Writer", "Plus", "medium");
    if (s.hasSchema) mkt += 15;
    if (s.hasVideo) mkt += 10;
  } else { mkt += 5; }
  if (hasReviews && (r.count || 0) > 20) mkt += 15; else if (hasReviews) mkt += 5;
  if (hasGBP) mkt += 10;
  dims.marketing = Math.min(mkt, 100);

  // ---------- 5. COMPETITIVE (10% weight) ----------
  let comp = 50;
  if (c.length > 0 && hasReviews) {
    comp = 0;
    const avgCR = c.reduce((s, x) => s + (x.reviews || 0), 0) / c.length;
    const avgCRt = c.reduce((s, x) => s + (x.rating || 0), 0) / c.length;
    const maxCR = Math.max(...c.map(x => x.reviews || 0));
    if ((r.count || 0) >= maxCR) comp += 40; else if ((r.count || 0) >= avgCR) comp += 28; else if ((r.count || 0) >= avgCR * 0.5) comp += 15;
    else { comp += 5; addFix(`Top competitor has ${maxCR} reviews vs your ${r.count || 0}. That gap costs rankings and trust.`, D.ltv * 0.06, "Auto Review Kit", "Core", "high"); }
    if ((r.rating || 0) > avgCRt + 0.2) comp += 30; else if ((r.rating || 0) >= avgCRt) comp += 22; else if ((r.rating || 0) >= avgCRt - 0.3) comp += 12;
    else addFix(`Competitors average ${avgCRt.toFixed(1)} stars vs your ${(r.rating || 0).toFixed(1)}. Higher-rated get 25% more clicks.`, D.ltv * 0.04, "Review Funnel", "Core", "high");
    if (hasWebsite) comp += 15;
    if (s.hasSchema) comp += 10;
    if (s.hasChatWidget) comp += 5;
  }
  dims.competitive = Math.min(comp, 100);

  // ---------- 6. AI VISIBILITY (new — 13% weight) ----------
  // How well positioned for Google AI Overviews, Gemini, "Ask Maps"
  // 45% of consumers now use AI for local recs. 60% zero-click searches. This is the future.
  const ai = raw.ai || {};
  let aiVis = 0;
  // GBP Completeness (0-25): description, categories, hours, attributes, photos, posts
  const gbpComplete = (ai.hasGBPDescription ? 5 : 0) + (ai.hasServiceCategories ? 4 : 0) + (ai.hasCompleteHours ? 4 : 0) + (ai.hasAttributes ? 3 : 0) + (ai.hasPhotos ? 4 : 0) + (ai.hasRecentPosts ? 5 : 0);
  aiVis += gbpComplete;
  if (gbpComplete < 15 && hasGBP) addFix(`Your Google Business Profile is ${Math.round(gbpComplete/25*100)}% complete. AI systems like Gemini prioritize rich profiles — fill in your description, services, photos, and post weekly.`, D.ltv * 0.04, "Brand Presence", "Core", "high");

  // Review AI-Readiness (0-25): volume, recency, response rate, keyword diversity
  const revAI = (hasReviews ? Math.min(Math.round(((r.count||0)/D.avgReviews)*10), 10) : 0) + ((r.recentPositive||0) >= 3 ? 5 : (r.recentPositive||0) >= 1 ? 3 : 0) + ((r.responseRate||0) >= 70 ? 5 : (r.responseRate||0) >= 40 ? 3 : 0) + (ai.hasKeywordDiverseReviews ? 5 : 0);
  aiVis += revAI;
  if (revAI < 15 && hasReviews) addFix(`Your reviews lack keyword diversity. When patients mention specific services ("teeth whitening", "emergency dental") in reviews, Gemini uses those exact phrases to recommend you. Ask patients to mention the service they received.`, D.ltv * 0.03, "Auto Review Kit", "Core", "medium");

  // Website AI-Readiness (0-25): FAQ schema, structured data, chunked content, FAQ page
  const webAI = hasWebsite ? ((s.hasSchema ? 8 : 0) + (ai.hasFAQSchema ? 7 : 0) + (ai.hasStructuredServices ? 5 : 0) + (s.hasH1 ? 3 : 0) + (s.hasMeta ? 2 : 0)) : 0;
  aiVis += webAI;
  if (hasWebsite && webAI < 15) addFix(`Your website isn't AI-ready. Add FAQ schema markup and structured service descriptions — this is the "official script" Gemini reads when generating answers about your business.`, D.ltv * 0.04, "Schema Generator", "Core", "high");
  if (!hasWebsite && hasGBP) addFix(`Without a website, Gemini can only pull from your GBP and reviews. Businesses with websites get 3x more AI mentions because there's more content to reference.`, D.ltv * 0.06, "Zidly Pages", "Core", "critical");

  // Cross-Platform Consistency (0-25): NAP consistency, linked social profiles
  const crossPlat = (ai.hasConsistentNAP ? 10 : 0) + (ai.hasLinkedSocial ? 8 : 0) + (hasWebsite && s.hasSocial ? 4 : 0) + (hasGBP ? 3 : 0);
  aiVis += crossPlat;
  if (crossPlat < 15) addFix(`Your business info is inconsistent across platforms. Gemini cross-references Google, Yelp, Facebook, and your website — inconsistencies reduce AI confidence in recommending you.`, D.ltv * 0.03, "Brand Presence", "Core", "medium");

  dims.aiVisibility = Math.min(aiVis, 100);

  // ---------- WEIGHTED OVERALL (6 dimensions) ----------
  const overall = Math.round(
    dims.reputation * 0.25 +
    dims.findability * 0.22 +
    dims.conversion * 0.18 +
    dims.marketing * 0.12 +
    dims.competitive * 0.10 +
    dims.aiVisibility * 0.13
  );

  // ---------- REVENUE LOSS (dual method — take higher) ----------
  const formulaLoss = Math.round(D.monthlySearches * D.convRate * D.avgTicket * ((100 - overall) / 100) * 0.4);
  const finalLoss = Math.max(totalLoss, formulaLoss);

  const prioOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  fixes.sort((a, b) => (prioOrder[a.priority] || 2) - (prioOrder[b.priority] || 2) || b.impact - a.impact);

  const grade = overall >= 90 ? "A+" : overall >= 80 ? "A" : overall >= 70 ? "B+" : overall >= 60 ? "B" : overall >= 50 ? "C+" : overall >= 40 ? "C" : overall >= 30 ? "D" : "F";

  return { overall, grade, dims, fixes: fixes.slice(0, 10), totalLoss: Math.round(finalLoss), industry: D, compData: c };
}

function BizScorer() {
  const biz = useContext(BizCtx);
  const proof = useContext(ProofCtx);
  const [name, setName] = useState(biz?.name || ""); const [loc, setLoc] = useState(biz?.location || "");
  const [url, setUrl] = useState(biz?.url || ""); const [ind, setInd] = useState(biz?.industry || "dental");
  const [ld, setLd] = useState(false); const [result, setResult] = useState(null); const [valErr, setValErr] = useState("");

  const go = async () => {
    if (!name.trim()) { setValErr("Business name required"); return; }
    setValErr(""); setLd(true); setResult(null);
    const raw = await ask(`You are a data extraction tool. Search for "${name.trim()}" in ${loc||"USA"}.${url ? ` Also fetch and analyze: ${url}` : ""}

Return ONLY valid JSON (no markdown):
{"reviews":{"count":0,"rating":0.0,"responseRate":0,"recentPositive":0,"recentNegative":0},
"seo":{"hasTitle":true,"hasMeta":true,"hasH1":true,"hasSchema":false,"isHttps":true,"hasMobile":true,"hasSitemap":false,"hasAltText":false,"hasClickToCall":false,"hasSocial":false,"hasOG":false,"hasBlog":false,"hasChatWidget":false,"hasBookingLink":false,"hasCanonical":false,"hasRobotsTxt":false,"hasInternalLinks":false,"hasFastLoad":false,"hasVideo":false,"hasFormOrCTA":false},
"competitors":[{"name":"Comp1","reviews":50,"rating":4.5},{"name":"Comp2","reviews":30,"rating":4.2}],
"ai":{"hasGBPDescription":false,"hasServiceCategories":false,"hasCompleteHours":false,"hasAttributes":false,"hasPhotos":false,"hasRecentPosts":false,"hasKeywordDiverseReviews":false,"hasFAQSchema":false,"hasStructuredServices":false,"hasConsistentNAP":false,"hasLinkedSocial":false},
"businessFound":true}

Rules:
- reviews: search Google for actual review count and rating. responseRate = estimated % with owner reply.
- seo: if no website, return seo as empty object {}. If website exists, check EACH boolean from actual HTML.
- competitors: find 2-4 nearby competitors in same industry. Use real data.
- ai: check Google Business Profile for description, service categories, hours, attributes, photos, recent posts. Check if reviews mention diverse services/keywords. Check website for FAQ schema. Check if business name/address/phone matches across Google and website. Check if social profiles are linked from GBP.
- businessFound=false ONLY if business doesn't appear in any search.`);

    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      const m = clean.match(/\{[\s\S]*\}/);
      if (m) {
        const data = JSON.parse(m[0]);
        if (data.businessFound !== false) {
          const scored = scoreBiz(data, ind);
          setResult({ ...scored, raw: data, bizName: name.trim(), bizLoc: loc.trim() });
          proof.bump("scans"); setLd(false); return;
        }
      }
      setResult({ error: "Couldn't find this business. Try adding your website URL or check spelling." });
    } catch { setResult({ error: "Analysis failed. Try again." }); }
    setLd(false);
  };

  const scoreColor = (sc) => sc >= 70 ? "#22C55E" : sc >= 50 ? "#EAB308" : "#EF4444";
  const gradeBg = (g) => g.startsWith("A") ? "#22C55E" : g.startsWith("B") ? "#3B82F6" : g.startsWith("C") ? "#EAB308" : "#EF4444";
  const prioColor = { critical: "#DC2626", high: "#F97316", medium: "#EAB308", low: "#94A3B8" };
  const prioLabel = { critical: "Fix Now", high: "High", medium: "Medium", low: "Low" };

  if (result && !result.error) {
    const D = result.industry; const hasWebsite = result.raw?.seo?.hasTitle != null;
    return <div>
    {/* Grade */}
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 100, height: 100, borderRadius: "50%", background: `${gradeBg(result.grade)}12`, border: `4px solid ${gradeBg(result.grade)}`, marginBottom: 10 }}>
        <span style={{ fontSize: 38, fontWeight: 900, color: gradeBg(result.grade) }}>{result.grade}</span>
      </div>
      <p style={{ fontSize: 14, fontWeight: 700, color: TX, margin: "4px 0" }}>{result.overall}/100 — {result.overall >= 80 ? "Strong" : result.overall >= 60 ? "Needs Attention" : result.overall >= 40 ? "Underperforming" : "Urgent Action Needed"}</p>
      <p style={{ fontSize: 13, color: TG }}>{result.bizName}{result.bizLoc ? ` · ${result.bizLoc}` : ""}</p>
    </div>

    {/* Revenue Loss */}
    {result.totalLoss > 0 && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: 16, marginBottom: 20, textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "#991B1B", fontWeight: 600, margin: "0 0 4px" }}>Estimated Revenue You're Missing</p>
      <p style={{ fontSize: 28, fontWeight: 900, color: "#DC2626", margin: "0 0 4px" }}>${result.totalLoss.toLocaleString()}<span style={{ fontSize: 14, fontWeight: 600 }}>/mo</span></p>
      <p style={{ fontSize: 11, color: "#B91C1C", margin: 0 }}>Based on {D.monthlySearches.toLocaleString()} monthly searches × {(D.convRate * 100).toFixed(1)}% conversion × ${D.avgTicket} avg value</p>
    </div>}

    {/* 5 Score Bars */}
    {[["⭐", "Reputation", result.dims.reputation, "Reviews, rating, responses"],["🔍", "Findability", result.dims.findability, "SEO, schema, mobile, speed"],["🎯", "Conversion", result.dims.conversion, "Chatbot, booking, CTAs"],["📱", "Marketing", result.dims.marketing, "Social, content, presence"],["🤖", "AI Visibility", result.dims.aiVisibility, "Gemini, AI Overviews, Ask Maps"],["🏆", "Competitive", result.dims.competitive, "vs local competitors"]].map(([icon, label, score, desc]) =>
      <div key={label} style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
          <div><span style={{ fontSize: 13 }}>{icon}</span> <span style={{ fontSize: 12, fontWeight: 700, color: TX }}>{label}</span> <span style={{ fontSize: 10, color: TM }}>{desc}</span></div>
          <span style={{ fontSize: 14, fontWeight: 800, color: scoreColor(score) }}>{score}</span>
        </div>
        <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${score}%`, background: `linear-gradient(90deg, ${scoreColor(score)}CC, ${scoreColor(score)})`, borderRadius: 4, transition: "width 1s ease" }} />
        </div>
      </div>
    )}

    {/* AI Visibility Warning */}
    {result.dims.aiVisibility < 50 && <div style={{ marginTop: 16, padding: 16, background: "#FFF7ED", borderRadius: 10, border: "1px solid #FED7AA" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>🤖</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#9A3412", margin: "0 0 4px" }}>AI Visibility Alert: Grade {result.dims.aiVisibility >= 40 ? "C" : result.dims.aiVisibility >= 25 ? "D" : "F"}</p>
          <p style={{ fontSize: 12, color: "#C2410C", lineHeight: 1.6, margin: 0 }}>When someone asks Google "best {industry} near me," Gemini's AI currently does NOT recommend your practice. 45% of consumers now use AI for local recommendations, and 60% of searches are zero-click. Without AI visibility, you're invisible to a growing majority of searchers — even if you rank well in traditional results.</p>
        </div>
      </div>
    </div>}

    {/* Competitor Table */}
    {result.compData.length > 0 && <div style={{ marginTop: 20, padding: 14, background: "#FAFBFC", borderRadius: 10, border: `1px solid ${BD}` }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: TX, margin: "0 0 10px" }}>Competitive Landscape</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "6px 12px", fontSize: 11 }}>
        <span style={{ fontWeight: 700, color: TX }}>Business</span><span style={{ fontWeight: 700, color: TX, textAlign: "right" }}>Reviews</span><span style={{ fontWeight: 700, color: TX, textAlign: "right" }}>Rating</span>
        <span style={{ color: T, fontWeight: 700 }}>→ {result.bizName}</span><span style={{ textAlign: "right", color: T, fontWeight: 700 }}>{result.raw.reviews?.count || "?"}</span><span style={{ textAlign: "right", color: T, fontWeight: 700 }}>{result.raw.reviews?.rating || "?"}</span>
        {result.compData.map((comp, i) => [
          <span key={`n${i}`} style={{ color: TG }}>{comp.name}</span>,
          <span key={`r${i}`} style={{ textAlign: "right", color: (comp.reviews || 0) > (result.raw.reviews?.count || 0) ? "#EF4444" : TG }}>{comp.reviews}</span>,
          <span key={`rt${i}`} style={{ textAlign: "right", color: (comp.rating || 0) > (result.raw.reviews?.rating || 0) ? "#EF4444" : TG }}>{comp.rating}</span>
        ])}
      </div>
    </div>}

    {/* Action Plan */}
    {result.fixes.length > 0 && <div style={{ marginTop: 20 }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 800, color: TX }}>Your Action Plan</h3>
      <p style={{ fontSize: 11, color: TG, margin: "0 0 14px" }}>Ranked by priority and revenue impact. Each fix maps to a Zidly tool.</p>
      {result.fixes.map((f, i) => <div key={i} style={{ display: "flex", gap: 12, padding: 14, background: f.priority === "critical" ? "#FEF2F2" : i < 3 ? `${T}05` : "#FAFBFC", borderRadius: 9, marginBottom: 8, border: `1px solid ${f.priority === "critical" ? "#FECACA" : i < 3 ? T+"18" : BD}` }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: f.priority === "critical" ? "#DC2626" : i < 3 ? T : "#E2E8F0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{i+1}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: TX, lineHeight: 1.5 }}>{f.fix}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 5, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#22C55E" }}>+{f.impactLabel}</span>
            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: `${prioColor[f.priority]}15`, color: prioColor[f.priority], fontWeight: 700 }}>{prioLabel[f.priority]}</span>
            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: `${T}10`, color: T, fontWeight: 600 }}>{f.engine}</span>
            {f.tier !== "Core" && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: `${TC[f.tier]}10`, color: TC[f.tier], fontWeight: 600 }}>{f.tier}</span>}
          </div>
        </div>
      </div>)}
    </div>}

    {/* Raw Data */}
    <div style={{ marginTop: 18, padding: 14, background: "#FAFBFC", borderRadius: 10, border: `1px solid ${BD}` }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: TX, margin: "0 0 10px" }}>Raw Data</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
        {[{v: result.raw.reviews?.count ?? "?", l: "Reviews"}, {v: result.raw.reviews?.rating ?? "?", l: "Rating"}, {v: result.compData.length, l: "Competitors"}, {v: hasWebsite ? "Yes" : "No", l: "Website"}].map(x =>
          <div key={x.l} style={{ textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 800, color: TX }}>{x.v}</div><div style={{ fontSize: 9, color: TG }}>{x.l}</div></div>
        )}
      </div>
    </div>

    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
      <button onClick={() => setResult(null)} style={{ flex: 1, padding: "10px", background: T, color: "#fff", border: "none", borderRadius: 7, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Scan Another</button>
      <CopyBtn text={`BizScore: ${result.bizName}\nGrade: ${result.grade} (${result.overall}/100)\n\nReputation: ${result.dims.reputation}/100\nFindability: ${result.dims.findability}/100\nConversion: ${result.dims.conversion}/100\nMarketing: ${result.dims.marketing}/100\nAI Visibility: ${result.dims.aiVisibility}/100\nCompetitive: ${result.dims.competitive}/100\n\nEst. Loss: $${result.totalLoss.toLocaleString()}/mo\n\nAction Plan:\n${result.fixes.map((f,i) => `${i+1}. [${prioLabel[f.priority]}] ${f.fix} (+${f.impactLabel})`).join("\n")}`} label="Copy Report" />
    </div>
    <p style={{ fontSize: 9, color: TM, textAlign: "center", marginTop: 10 }}>Revenue based on {D.monthlySearches.toLocaleString()} monthly searches, ${D.avgTicket} avg ticket, {(D.convRate*100).toFixed(1)}% conversion</p>
  </div>;}

  if (result?.error) return <div style={{ textAlign: "center", padding: 30 }}>
    <p style={{ color: "#EAB308", fontSize: 13 }}>{result.error}</p>
    <button onClick={() => setResult(null)} style={{ marginTop: 12, padding: "8px 16px", fontSize: 12, color: T, background: "none", border: `1px solid ${T}`, borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Try Again</button>
  </div>;

  return <div>
    <p style={{ color: TG, fontSize: 13, marginBottom: 14 }}>Free business health audit. Scores 5 dimensions. Calculates revenue you're losing. Shows exactly what to fix.</p>
    <I label="Business Name" value={name} onChange={v => { setName(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <I label="Location" value={loc} onChange={setLoc} placeholder="e.g. Austin, TX" />
    <I label="Website URL (recommended)" value={url} onChange={setUrl} placeholder="https://..." />
    <S label="Industry" value={ind} onChange={setInd} options={INDUSTRIES} />
    <B onClick={go} loading={ld} label="📊 Run BizScore Audit" />
    {ld && <Ld msg="Scanning business, website, and competitors..." long />}
    <p style={{ fontSize: 10, color: TM, marginTop: 8, textAlign: "center" }}>Scores from real data. Revenue estimates based on industry benchmarks.</p>
  </div>;
}

function SchemaGenerator() {
  const biz = useContext(BizCtx);
  const [name, setName] = useState(biz?.name || ""); const [type, setType] = useState(biz?.industry || "dental");
  const [addr, setAddr] = useState(""); const [phone, setPhone] = useState(biz?.phone || "");
  const [hours, setHours] = useState("Mo-Fr 08:00-18:00"); const [desc, setDesc] = useState("");
  const [url, setUrl] = useState(biz?.url || ""); const [generated, setGenerated] = useState(null);
  const typeMap = { dental:"Dentist", restaurant:"Restaurant", salon:"BeautySalon", medical:"MedicalClinic", legal:"LegalService", fitness:"HealthClub", homeservice:"HomeAndConstructionBusiness", retail:"Store", realestate:"RealEstateAgent", general:"LocalBusiness" };
  const [valErr, setValErr] = useState("");
  const generate = () => {
    if (!name.trim()) { setValErr("Business name required"); return; }
    setValErr("");
    const schema = {
      "@context": "https://schema.org", "@type": typeMap[type] || "LocalBusiness",
      name: name.trim(),
      ...(url && { url: url.trim() }),
      ...(phone && { telephone: phone.trim() }),
      ...(addr && { address: { "@type": "PostalAddress", streetAddress: addr.trim() } }),
      ...(desc && { description: desc.trim() }),
      ...(hours && { openingHours: hours.split(",").map(h => h.trim()) }),
    };
    setGenerated(JSON.stringify(schema, null, 2));
  };
  if (generated) return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: TX }}>Your Schema Markup</span>
      <div style={{ display: "flex", gap: 6 }}>
        <CopyBtn text={`<script type="application/ld+json">\n${generated}\n</script>`} label="Copy Code" />
        <button onClick={() => setGenerated(null)} style={{ padding: "4px 10px", fontSize: 11, color: TG, background: "none", border: `1px solid ${BD}`, borderRadius: 6, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
      </div>
    </div>
    <pre style={{ background: "#0F172A", color: "#22C55E", padding: 16, borderRadius: 8, fontSize: 11, lineHeight: 1.6, overflow: "auto", maxHeight: 300 }}>{`<script type="application/ld+json">\n${generated}\n</script>`}</pre>
    <div style={{ marginTop: 14, padding: 14, background: `${T}08`, borderRadius: 8, border: `1px solid ${T}20` }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: TX, margin: "0 0 6px" }}>How to install:</p>
      <p style={{ fontSize: 11, color: TG, margin: "0 0 4px" }}>WordPress: Appearance → Theme Editor → header.php → paste before &lt;/head&gt;</p>
      <p style={{ fontSize: 11, color: TG, margin: "0 0 4px" }}>Wix: Settings → Custom Code → Add Code → Head → paste</p>
      <p style={{ fontSize: 11, color: TG, margin: 0 }}>Squarespace: Settings → Advanced → Code Injection → Header → paste</p>
    </div>
  </div>;
  return <div>
    <p style={{ color: TG, fontSize: 13, marginBottom: 14 }}>Generate JSON-LD structured data for Google rich results. Zero AI — pure code.</p>
    <I label="Business Name" value={name} onChange={v => { setName(v); setValErr(""); }} placeholder="e.g. Sunrise Dental" required error={valErr} />
    <S label="Business Type" value={type} onChange={setType} options={INDUSTRIES} />
    <I label="Website URL" value={url} onChange={setUrl} placeholder="https://..." />
    <I label="Phone" value={phone} onChange={setPhone} placeholder="e.g. (512) 555-0123" />
    <I label="Address" value={addr} onChange={setAddr} placeholder="e.g. 123 Main St, Austin TX 78701" />
    <I label="Hours (comma-separated)" value={hours} onChange={setHours} placeholder="Mo-Fr 08:00-18:00, Sa 09:00-14:00" />
    <p style={{ fontSize: 10, color: TM, marginTop: -10, marginBottom: 14 }}>Format: Mo Tu We Th Fr Sa Su + 24hr time. Example: Mo-Fr 08:00-18:00, Sa 09:00-14:00</p>
    <I label="Description" value={desc} onChange={setDesc} placeholder="Brief business description..." multi />
    <B onClick={generate} loading={false} label="⚡ Generate Schema" />
  </div>;
}

// QR Code Kit — generates branded QR codes using free API
function QRCodeKit() {
  const biz = useContext(BizCtx);
  const [mode, setMode] = useState("review"); const [url, setUrl] = useState("");
  const [bizName, setBizName] = useState(biz?.name || ""); const [qr, setQr] = useState(null);
  const presets = { review: { label: "⭐ Review Link", placeholder: "https://g.page/r/...", cta: "Loved your visit? Scan to review!" },
    website: { label: "🌐 Website", placeholder: "https://...", cta: "Learn more about us" },
    booking: { label: "📅 Booking", placeholder: "https://calendly.com/...", cta: "Book your appointment" },
    menu: { label: "📋 Menu/Services", placeholder: "https://...", cta: "View our menu" },
    contact: { label: "📞 Contact", placeholder: "https://...", cta: "Get in touch" } };
  const p = presets[mode];
  const [valErr, setValErr] = useState("");
  const generate = () => { if (!url.trim()) { setValErr("URL required"); return; } setValErr(""); setQr(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url.trim())}&color=0D9488`); };
  return <div>
    <p style={{ color: TG, fontSize: 13, marginBottom: 14 }}>Generate printable QR codes for your business. Print and place at your front desk, on receipts, or business cards.</p>
    <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
      {Object.entries(presets).map(([k, v]) => <button key={k} onClick={() => { setMode(k); setQr(null); setValErr(""); }} style={{ padding: "6px 10px", background: mode === k ? T : "transparent", color: mode === k ? "#fff" : TG, border: `1.5px solid ${mode === k ? T : BD}`, borderRadius: 6, fontWeight: 600, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{v.label}</button>)}
    </div>
    <I label="Business Name" value={bizName} onChange={setBizName} placeholder="e.g. Sunrise Dental" />
    <I label={p.label + " URL"} value={url} onChange={v => { setUrl(v); setValErr(""); }} placeholder={p.placeholder} required error={valErr} />
    <B onClick={generate} loading={false} label="📱 Generate QR Code" />
    {qr && <div style={{ marginTop: 20, textAlign: "center" }}>
      <div style={{ display: "inline-block", border: `1px solid ${BD}`, borderRadius: 12, padding: 20, background: CD }}>
        <p style={{ fontWeight: 700, fontSize: 14, color: TX, margin: "0 0 4px" }}>{bizName || "Your Business"}</p>
        <p style={{ fontSize: 11, color: TG, margin: "0 0 14px" }}>{p.cta}</p>
        <img src={qr} alt="QR Code" style={{ width: 200, height: 200, borderRadius: 4 }} />
        <p style={{ fontSize: 9, color: TM, margin: "10px 0 0" }}>Powered by Zidly.ai</p>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
        <button onClick={() => window.open(qr, "_blank")} style={{ padding: "8px 16px", background: T, color: "#fff", borderRadius: 6, fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer", fontFamily: "inherit" }}>Download PNG</button>
        <CopyBtn text={url} label="Copy URL" />
      </div>
    </div>}
  </div>;
}

// Lead Inbox — unified view of all leads (structure ready for Supabase)
function LeadInbox() {
  const { leads, updateLeadStatus } = useContext(LeadCtx);
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? leads : leads.filter(l => l.source === filter);
  const statusColors = { new: "#3B82F6", contacted: "#EAB308", booked: "#22C55E", closed: "#94A3B8" };
  const statusFlow = ["new", "contacted", "booked", "closed"];
  const cycleStatus = (i) => {
    const current = leads[i]?.status || "new";
    const next = statusFlow[(statusFlow.indexOf(current) + 1) % statusFlow.length];
    updateLeadStatus(i, next);
  };
  if (leads.length === 0) return <div style={{ textAlign: "center", padding: 40 }}>
    <div style={{ fontSize: 40, marginBottom: 12 }}>📥</div>
    <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: TX }}>No leads yet</h3>
    <p style={{ color: TG, fontSize: 13 }}>Leads from your chatbot, missed calls, review funnel, and QR codes will appear here.</p>
    <p style={{ color: TM, fontSize: 11, marginTop: 8 }}>Try the Webchat Bot to capture your first lead.</p>
  </div>;
  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: TX }}>{leads.length} leads</span>
      <div style={{ display: "flex", gap: 4 }}>{["all","chat","call","review","qr"].map(f =>
        <button key={f} onClick={() => setFilter(f)} style={{ padding: "4px 8px", fontSize: 10, fontWeight: 600, background: filter === f ? T : "transparent", color: filter === f ? "#fff" : TG, border: `1px solid ${filter === f ? T : BD}`, borderRadius: 5, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>{f}</button>
      )}</div>
    </div>
    {filtered.map((lead, i) => {
      const realIdx = leads.indexOf(lead);
      const st = lead.status || "new";
      return <div key={i} style={{ display: "flex", gap: 12, padding: 14, background: i === 0 ? `${T}06` : "#FAFBFC", borderRadius: 9, marginBottom: 8, border: `1px solid ${i === 0 ? T+"20" : BD}` }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: lead.source === "chat" ? `${T}15` : lead.source === "call" ? "#DBEAFE" : lead.source === "review" ? "#FEF9C3" : "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
        {lead.source === "chat" ? "💬" : lead.source === "call" ? "📞" : lead.source === "review" ? "⭐" : "📱"}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: TX }}>{lead.name || "Unknown"}</span>
          <span style={{ fontSize: 9, color: TM }}>{lead.time}</span>
        </div>
        <p style={{ fontSize: 11, color: TG, margin: "3px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.summary}</p>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          <button onClick={() => cycleStatus(realIdx)} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, background: `${statusColors[st]}15`, color: statusColors[st], fontWeight: 600, textTransform: "capitalize", border: `1px solid ${statusColors[st]}30`, cursor: "pointer", fontFamily: "inherit" }}>{st} ↻</button>
          {lead.contact && <span style={{ fontSize: 9, color: TM }}>{lead.contact}</span>}
        </div>
      </div>
    </div>;})}
  </div>;
}

// Onboarding Wizard — 5-min guided setup
const SUGGESTED_KW = { dental: ["dentist","emergency dentist","teeth whitening","dental implants","dentist near me"], restaurant: ["restaurant","best restaurant","food delivery","catering","restaurant near me"], salon: ["hair salon","nail salon","spa","beauty salon","salon near me"], medical: ["doctor","clinic","urgent care","medical clinic","doctor near me"], legal: ["lawyer","attorney","legal advice","personal injury lawyer","lawyer near me"], fitness: ["gym","personal trainer","fitness center","yoga","gym near me"], homeservice: ["plumber","electrician","HVAC","roofer","handyman near me"], retail: ["store","shop","buy","online store","store near me"], realestate: ["realtor","real estate agent","homes for sale","real estate","realtor near me"], general: ["business near me","services","local business","best rated","near me"] };

function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState({ name: "", url: "", phone: "", industry: "dental", location: "", googleLink: "", competitors: ["", "", ""], keywords: [], brandColor: T, tone: "professional" });
  const [kws, setKws] = useState([]);
  useEffect(() => {
    const base = SUGGESTED_KW[d.industry] || SUGGESTED_KW.general;
    setKws(base.map(k => {
      // Don't append location to "near me" keywords — Google localizes those automatically
      const isNearMe = k.includes("near me");
      const text = (!isNearMe && d.location) ? `${k} ${d.location}` : k;
      return { text, on: true };
    }));
  }, [d.industry, d.location]);

  const steps = [
    // Step 0: Business basics
    <div key={0}>
      <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, color: TX }}>Welcome to Zidly 🎯</h3>
      <p style={{ color: TG, fontSize: 13, marginBottom: 18 }}>Let's set up your business in 5 minutes. Everything activates automatically.</p>
      <I label="Business Name" value={d.name} onChange={v => setD(p => ({...p, name: v}))} placeholder="e.g. Sunrise Dental" required />
      <I label="Website URL" value={d.url} onChange={v => setD(p => ({...p, url: v}))} placeholder="https://... (or leave blank if none)" />
      <I label="Phone Number" value={d.phone} onChange={v => setD(p => ({...p, phone: v}))} placeholder="(512) 555-0123" />
      <S label="Industry" value={d.industry} onChange={v => setD(p => ({...p, industry: v}))} options={INDUSTRIES} />
      <I label="Location" value={d.location} onChange={v => setD(p => ({...p, location: v}))} placeholder="e.g. Austin, TX" />
    </div>,
    // Step 1: Google presence
    <div key={1}>
      <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, color: TX }}>Your Google Presence</h3>
      <p style={{ color: TG, fontSize: 13, marginBottom: 18 }}>This helps us monitor your reviews and respond automatically.</p>
      <I label="Google Review Link (optional)" value={d.googleLink} onChange={v => setD(p => ({...p, googleLink: v}))} placeholder="https://g.page/r/... or search.google.com/local/..." />
      <p style={{ fontSize: 11, color: TM, marginTop: -8, marginBottom: 14 }}>Don't have it? Go to Google Maps → your business → "Write a review" → copy the URL.</p>
    </div>,
    // Step 2: Competitors
    <div key={2}>
      <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, color: TX }}>Your Competitors</h3>
      <p style={{ color: TG, fontSize: 13, marginBottom: 18 }}>We'll track these weekly and alert you when anything changes.</p>
      {d.competitors.map((c, i) => <I key={i} label={`Competitor ${i + 1}${i === 0 ? "" : " (optional)"}`} value={c} onChange={v => { const nc = [...d.competitors]; nc[i] = v; setD(p => ({...p, competitors: nc})); }} placeholder={`e.g. ${["Valley Dental","Smile Center","Elite Dentistry"][i]}`} />)}
    </div>,
    // Step 3: Keywords
    <div key={3}>
      <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, color: TX }}>Keywords to Track</h3>
      <p style={{ color: TG, fontSize: 13, marginBottom: 18 }}>We'll check your Google ranking for these every week.</p>
      {kws.map((k, i) => <div key={i} onClick={() => { const nk = [...kws]; nk[i] = {...nk[i], on: !nk[i].on}; setKws(nk); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: k.on ? `${T}08` : "#FAFBFC", borderRadius: 7, marginBottom: 6, border: `1px solid ${k.on ? T+"30" : BD}`, cursor: "pointer" }}>
        <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${k.on ? T : BD}`, background: k.on ? T : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{k.on && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}</div>
        <span style={{ fontSize: 12, color: TX }}>{k.text}</span>
      </div>)}
    </div>,
    // Step 4: Preferences
    <div key={4}>
      <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 800, color: TX }}>Almost Done!</h3>
      <p style={{ color: TG, fontSize: 13, marginBottom: 18 }}>Pick your style and we'll activate everything.</p>
      <S label="Communication Tone" value={d.tone} onChange={v => setD(p => ({...p, tone: v}))} options={[{v:"professional",l:"Professional"},{v:"friendly",l:"Friendly"},{v:"casual",l:"Casual"}]} />
      <p style={{ fontSize: 12, fontWeight: 600, color: TX, marginBottom: 8 }}>Brand Color</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>{["#0D9488","#2563EB","#7C3AED","#DC2626","#EA580C","#16A34A"].map(c =>
        <div key={c} onClick={() => setD(p => ({...p, brandColor: c}))} style={{ width: 32, height: 32, borderRadius: 8, background: c, cursor: "pointer", border: d.brandColor === c ? "3px solid #0F172A" : "3px solid transparent" }} />
      )}</div>
    </div>
  ];
  const canNext = step === 0 ? d.name.trim() : true;
  return <div style={{ maxWidth: 520, margin: "0 auto" }}>
    <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>{[0,1,2,3,4].map(s =>
      <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? T : BD }} />
    )}</div>
    {steps[step]}
    <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
      {step > 0 && <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: "11px", background: "transparent", color: TG, border: `1.5px solid ${BD}`, borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Back</button>}
      <button onClick={() => {
        if (step < 4) { setStep(step + 1); return; }
        const activeKws = kws.filter(k => k.on).map(k => k.text);
        onComplete({ ...d, keywords: activeKws });
      }} disabled={!canNext} style={{ flex: 1, padding: "11px", background: canNext ? `linear-gradient(135deg,${TD},${TL})` : TM, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: canNext ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
        {step < 4 ? "Continue →" : "🚀 Launch Zidly"}</button>
    </div>
    <p style={{ textAlign: "center", fontSize: 10, color: TM, marginTop: 12 }}>Step {step + 1} of 5</p>
  </div>;
}

function Soon({ name, engine, tier }) {
  return <div style={{ textAlign: "center", padding: "55px 28px" }}><div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
    <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: TX }}>{name}</h3>
    <p style={{ color: TG, fontSize: 13, marginBottom: 18 }}>Coming soon to {engine}.</p>
    {tier && <div style={{ display: "inline-block", padding: "7px 14px", background: `${TC[tier]||T}10`, borderRadius: 6, color: TC[tier]||T, fontWeight: 600, fontSize: 12 }}>Requires {tier}</div>}
  </div>;
}

function CmdHome({ onNavigate }) {
  const biz = useContext(BizCtx);
  const { leads } = useContext(LeadCtx);
  const proof = useContext(ProofCtx);
  const newLeads = leads.filter(l => l.status === "new").length;
  return <div>
    {biz && <div style={{ background: `linear-gradient(135deg, ${TD}06, ${TL}06)`, borderRadius: 12, padding: 22, marginBottom: 18, border: `1px solid ${T}18` }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800, color: TX }}>Welcome{biz.name ? `, ${biz.name}` : ""} 🎯</h2>
      <p style={{ color: TG, fontSize: 13, margin: 0 }}>{biz.location || "Your business intelligence hub"}</p>
    </div>}
    {!biz && <div style={{ background: `linear-gradient(135deg, ${TD}06, ${TL}06)`, borderRadius: 12, padding: 22, marginBottom: 18, border: `1px solid ${T}18` }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800, color: TX }}>Command Center 🎯</h2>
      <p style={{ color: TG, fontSize: 13, margin: 0 }}>Your business intelligence hub.</p>
    </div>}
    {/* Wall of Proof */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
      {[{n: proof.counts.scans || 0, l: "Sites Scanned", i: "🔍"}, {n: proof.counts.reviews || 0, l: "Reviews Analyzed", i: "⭐"}, {n: leads.length, l: "Leads Captured", i: "📥"}].map(s =>
        <div key={s.l} style={{ textAlign: "center", padding: "14px 8px", background: CD, borderRadius: 9, border: `1px solid ${BD}` }}>
          <div style={{ fontSize: 18 }}>{s.i}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: TX }}>{s.n.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: TG }}>{s.l}</div>
        </div>)}
    </div>
    {/* Lead Alert */}
    {newLeads > 0 && <div onClick={() => onNavigate?.("cmd", "inbox")} style={{ padding: 14, background: `${T}08`, borderRadius: 9, border: `1px solid ${T}20`, marginBottom: 18, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: T, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>{newLeads}</div>
      <div><div style={{ fontSize: 13, fontWeight: 700, color: TX }}>New leads waiting</div>
        <div style={{ fontSize: 11, color: TG }}>Tap to view your lead inbox</div></div>
    </div>}
    {/* Quick Actions */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
      {[{t:"Lead Inbox",s:`${leads.length} total leads`,i:"📥",e:"cmd",f:"inbox"},{t:"BizScorer",s:"Free business audit",i:"📊",e:"cmd",f:"bizscorer"},{t:"SEO Scanner",s:"Audit your website",i:"🔍",e:"cmd",f:"seoscan"},{t:"Reviews",s:"Manage reputation",i:"⭐",e:"rep",f:"reviews"},{t:"Chatbot",s:"24/7 assistant",i:"🤖",e:"comm",f:"webchat"},{t:"Competitors",s:"Intel",i:"🎯",e:"comp",f:"deep"}].map(c =>
        <div key={c.t} onClick={() => onNavigate?.(c.e, c.f)} style={{ background: CD, borderRadius: 9, border: `1px solid ${BD}`, padding: 16, cursor: "pointer", transition: "border-color .15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = T} onMouseLeave={e => e.currentTarget.style.borderColor = BD}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>{c.i}</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: TX, marginBottom: 2 }}>{c.t}</div>
          <div style={{ fontSize: 11, color: TG }}>{c.s}</div></div>)}
    </div>
  </div>;
}

const NAV = [
  { id: "cmd", name: "Command Center", icon: "🎯", tier: "Core", tag: "Your business, 60 seconds.", features: [
    { id: "home", name: "Dashboard", built: true },{ id: "inbox", name: "Lead Inbox", built: true },
    { id: "bizscorer", name: "BizScorer", built: true },{ id: "seoscan", name: "SEO Scanner", built: true },{ id: "brief", name: "Daily Brief", built: false },
    { id: "roi", name: "Weekly ROI Report", built: false, tier: "Plus" },{ id: "maps", name: "Maps Rank Tracker", built: true, tier: "Plus" },
    { id: "trends", name: "Local Trend Radar", built: true, tier: "Plus" },{ id: "health", name: "Health Dashboard", built: true, tier: "Pro" },
    { id: "crisis", name: "Crisis Intelligence", built: true, tier: "Elite" },{ id: "strategy", name: "Strategy Simulator", built: true, tier: "Elite" },
  ]},
  { id: "rep", name: "Reputation Boost", icon: "⭐", tier: "Core", tag: "More 5-star reviews.", features: [
    { id: "reviews", name: "Review Responses", built: true },{ id: "funnel", name: "Review Funnel", built: true },
    { id: "monitor", name: "Review Monitoring", built: false },{ id: "brand", name: "Brand Presence", built: true },{ id: "revkit", name: "Auto Review Kit", built: true },
  ]},
  { id: "comm", name: "Always On", icon: "🤖", tier: "Core", tag: "Your 24/7 AI front desk.", features: [
    { id: "webchat", name: "Webchat Bot", built: true },{ id: "socbot", name: "Social Media Bot", built: false, tier: "Plus" },
    { id: "voice", name: "Voice Receptionist", built: false, tier: "Pro" },{ id: "missedcall", name: "Missed Call Text-Back", built: false, tier: "Pro" },
  ]},
  { id: "content", name: "Content Fuel", icon: "📱", tier: "Plus", tag: "Marketing on autopilot.", features: [
    { id: "social", name: "Social & Video", built: true },{ id: "ads", name: "Ad Studio", built: true },
    { id: "blog", name: "Blog & Articles", built: true },{ id: "faq", name: "Smart FAQ", built: true },
    { id: "email", name: "Email Studio", built: true },{ id: "campaign", name: "Campaign Studio", built: true },{ id: "images", name: "Image Sourcing", built: false },
  ]},
  { id: "grow", name: "Growth Accelerator", icon: "📈", tier: "Plus", tag: "More revenue.", features: [
    { id: "revenue", name: "Revenue Radar", built: true },{ id: "react", name: "Reactivation & Upsells", built: true },
    { id: "leads", name: "Lead Engine", built: true },{ id: "menu", name: "Pricing Pro", built: true },
  ]},
  { id: "comp", name: "Competitor Radar", icon: "🔍", tier: "Pro", tag: "Know before they do.", features: [
    { id: "deep", name: "Deep Analysis", built: true },{ id: "activity", name: "Activity Tracking", built: true },
    { id: "steal", name: "Steal Their Customers", built: true },{ id: "partners", name: "Partnership Finder", built: true, tier: "Elite" },
  ]},
  { id: "ops", name: "Operations", icon: "⚙️", tier: "Pro", tag: "Run smarter.", features: [
    { id: "proposal", name: "Proposal Studio", built: true },{ id: "hire", name: "Hire & Train", built: true },
    { id: "staff", name: "Staff Planner", built: true },{ id: "schema", name: "Schema Generator", built: true },
    { id: "qr", name: "QR Code Kit", built: true },{ id: "integrations", name: "Integrations", built: true },
  ]},
];

const FMAP = {
  reviews: ReviewResponses, brand: BrandPresence, webchat: WebchatBot,
  social: SocialVideo, ads: AdStudio, email: EmailStudio, deep: CompetitorDeep, proposal: ProposalStudio,
  funnel: ReviewFunnel, revkit: AutoReviewKit, blog: BlogWriter, faq: SmartFAQ,
  campaign: CampaignStudio, revenue: RevenueRadar, react: Reactivation, maps: MapsTracker,
  leads: LeadEngine, menu: PricingPro, activity: CompActivity, steal: StealCustomers,
  health: HealthDash, trends: TrendRadar, integrations: IntegrationMgr,
  hire: HireTrain, staff: StaffPlanner, crisis: CrisisIntel, strategy: StrategySim, partners: PartnerFinder,
  inbox: LeadInbox, seoscan: SiteHealthScanner, bizscorer: BizScorer, schema: SchemaGenerator, qr: QRCodeKit,
};

// Fix #6, #7: Mobile-responsive app with resize listener
export default function Zidly() {
  // Onboarding + business context — persist via storage
  const [biz, setBiz] = useState(null);
  const [onboarded, setOnboarded] = useState(false);
  useEffect(() => {
    (async () => { try { const r = await window.storage.get("biz-data"); if (r?.value) { setBiz(JSON.parse(r.value)); setOnboarded(true); } } catch {} })();
  }, []);

  // Lead store — persist via storage
  const [leads, setLeads] = useState([]);
  useEffect(() => {
    (async () => { try { const r = await window.storage.get("leads"); if (r?.value) setLeads(JSON.parse(r.value)); } catch {} })();
  }, []);
  const addLead = useCallback((lead) => {
    setLeads(prev => {
      const next = [{ ...lead, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: "new" }, ...prev];
      try { window.storage.set("leads", JSON.stringify(next.slice(0, 200))); } catch {} // cap at 200
      return next;
    });
  }, []);
  const updateLeadStatus = useCallback((idx, newStatus) => {
    setLeads(prev => {
      const next = [...prev]; next[idx] = { ...next[idx], status: newStatus };
      try { window.storage.set("leads", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // Proof counters — persist via storage
  const [proofCounts, setProofCounts] = useState({ scans: 0, reviews: 0, seo: 0 });
  useEffect(() => {
    (async () => { try { const r = await window.storage.get("proof-counts"); if (r?.value) setProofCounts(JSON.parse(r.value)); } catch {} })();
  }, []);
  const bumpProof = useCallback((key) => {
    setProofCounts(prev => {
      const next = { ...prev, [key]: (prev[key] || 0) + 1 };
      try { window.storage.set("proof-counts", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // Nav state
  const [aEng, setAEng] = useState("cmd"); const [aFeat, setAFeat] = useState("home");
  const [exp, setExp] = useState({ cmd: true });
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth <= 768);
  const [sb, setSb] = useState(!isMobile);
  const eng = NAV.find(e => e.id === aEng); const feat = eng?.features.find(f => f.id === aFeat);
  const Comp = aFeat === "home" ? null : FMAP[aFeat];
  const mainRef = useRef(null);

  useEffect(() => {
    const handler = () => { const m = window.innerWidth <= 768; setIsMobile(m); if (m) setSb(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const sel = (eId, fId) => { setAEng(eId); setAFeat(fId); setExp(p => ({ ...p, [eId]: true }));
    if (isMobile) setSb(false);
    setTimeout(() => mainRef.current?.scrollTo(0, 0), 10); };

  const handleOnboardingComplete = (data) => {
    setBiz(data); setOnboarded(true);
    try { window.storage.set("biz-data", JSON.stringify(data)); } catch {}
  };

  // Wrap everything in context providers
  return <BizCtx.Provider value={biz}>
    <LeadCtx.Provider value={{ leads, addLead, updateLeadStatus }}>
    <ProofCtx.Provider value={{ counts: proofCounts, bump: bumpProof }}>
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", overflow: "hidden" }}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
      @keyframes pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.12);opacity:1}}
      @keyframes su{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      *{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#475569;border-radius:3px}`}</style>

    {/* Onboarding wizard (shown once, before dashboard) */}
    {!onboarded ? <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: PG, padding: 20 }}>
      <div style={{ background: CD, borderRadius: 16, border: `1px solid ${BD}`, padding: 32, maxWidth: 560, width: "100%", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      </div>
    </div> : <>

    {/* Mobile backdrop */}
    {isMobile && sb && <div onClick={() => setSb(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 99 }} />}

    {/* Sidebar */}
    {(sb || !isMobile) && <div style={{ width: sb ? 260 : 56, minWidth: sb ? 260 : 56, background: SB, display: "flex", flexDirection: "column", transition: "all .25s", overflow: "hidden", borderRight: "1px solid #1E293B",
      ...(isMobile ? { position: "fixed", zIndex: 100, height: "100vh" } : {}) }}>
      <div style={{ padding: sb ? "18px 16px" : "18px 9px", borderBottom: "1px solid #1E293B", display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
        <div onClick={() => !isMobile && setSb(!sb)} style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${T},${TL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 14, flexShrink: 0, cursor: "pointer" }}>Z</div>
        {sb && <div style={{ flex: 1 }}><div style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: -.5 }}>Zidly</div><div style={{ color: TM, fontSize: 9 }}>AI BUSINESS PARTNER</div></div>}
        {sb && isMobile && <button onClick={() => setSb(false)} style={{ background: "none", border: "none", color: TM, fontSize: 18, cursor: "pointer", padding: "4px 8px" }}>✕</button>}
      </div>
      <div style={{ padding: "8px 5px", flex: 1, overflowY: "auto" }}>
        {NAV.map(e => {
          const isA = aEng === e.id, isE = exp[e.id];
          return <div key={e.id}>
            <div onClick={() => { setExp(p => ({ ...p, [e.id]: !p[e.id] })); if (!isE) sel(e.id, e.features[0].id); }}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: sb ? "9px 11px" : "9px 0", justifyContent: sb ? "flex-start" : "center",
                borderRadius: 6, cursor: "pointer", background: isA ? `${T}10` : "transparent", marginBottom: 1 }}
              onMouseEnter={v => { if(!isA) v.currentTarget.style.background=SH }} onMouseLeave={v => { if(!isA) v.currentTarget.style.background=isA?`${T}10`:"transparent" }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{e.icon}</span>
              {sb && <><span style={{ flex: 1, color: isA ? TL : "#CBD5E1", fontSize: 12, fontWeight: isA ? 700 : 500 }}>{e.name}</span>
                <span style={{ fontSize: 7, fontWeight: 700, padding: "2px 4px", borderRadius: 3, background: `${TC[e.tier]||T}15`, color: TC[e.tier]||T, textTransform: "uppercase" }}>{e.tier}</span>
                <span style={{ color: TM, fontSize: 9, transform: isE ? "rotate(180deg)" : "", transition: "transform .2s" }}>▾</span></>}
            </div>
            {sb && isE && <div style={{ marginLeft: 16, borderLeft: "1.5px solid #1E293B", paddingLeft: 9, marginBottom: 5 }}>
              {e.features.map(f => { const isAF = aFeat === f.id, ft = f.tier || e.tier;
                return <div key={f.id} onClick={() => sel(e.id, f.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", borderRadius: 5, cursor: "pointer", background: isAF ? `${T}15` : "transparent", marginBottom: 1 }}
                  onMouseEnter={v => { if(!isAF) v.currentTarget.style.background=SH }} onMouseLeave={v => { if(!isAF) v.currentTarget.style.background=isAF?`${T}15`:"transparent" }}>
                  <span style={{ color: isAF ? TL : TM, fontSize: 11, fontWeight: isAF ? 600 : 400 }}>{f.name}</span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {!f.built && <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: "#1E293B", color: TM, fontWeight: 600 }}>SOON</span>}
                    {ft !== e.tier && <span style={{ fontSize: 7, padding: "1px 4px", borderRadius: 3, background: `${TC[ft]||T}15`, color: TC[ft]||T, fontWeight: 600 }}>{ft}</span>}
                  </div></div>; })}
            </div>}
          </div>; })}
      </div>
      {sb && <div style={{ padding: "12px 12px 16px", borderTop: "1px solid #1E293B" }}>
        <div style={{ background: `linear-gradient(135deg,${TD}25,${T}15)`, borderRadius: 8, padding: "11px 12px", border: `1px solid ${T}25` }}>
          <div style={{ color: TL, fontSize: 11, fontWeight: 700 }}>Need help?</div>
          <div style={{ color: TM, fontSize: 10, marginTop: 2 }}>support@zidly.ai</div>
        </div>
      </div>}
    </div>}

    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", background: PG }}>
      <div style={{ background: CD, borderBottom: `1px solid ${BD}`, padding: "13px 16px 13px 26px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isMobile && <button onClick={() => setSb(true)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 0 }}>☰</button>}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 18 }}>{eng?.icon}</span>
              <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: TX }}>{eng?.name}</h1>
              {feat?.id !== "home" && <><span style={{ color: TG, fontSize: 12 }}>›</span><span style={{ fontSize: 12, color: TG }}>{feat?.name}</span></>}
            </div>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: TG }}>{eng?.tag}</p>
          </div>
        </div>
        {feat && !feat.built && feat.id !== "home" && <span style={{ fontSize: 10, padding: "4px 10px", borderRadius: 5, background: `${T}10`, color: T, fontWeight: 600 }}>Soon</span>}
      </div>
      <div ref={mainRef} style={{ flex: 1, overflow: "auto", padding: isMobile ? 16 : 26 }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ background: CD, borderRadius: 12, border: `1px solid ${BD}`, padding: isMobile ? 16 : 24, boxShadow: "0 1px 3px rgba(0,0,0,.03)" }}>
            {aFeat === "home" ? <CmdHome onNavigate={sel} /> : Comp ? <Comp /> : <Soon name={feat?.name||""} engine={eng?.name||""} tier={feat?.tier||eng?.tier} />}
          </div>
        </div>
      </div>
    </div>
    </>}
    </div>
    </ProofCtx.Provider>
    </LeadCtx.Provider>
  </BizCtx.Provider>;
}
