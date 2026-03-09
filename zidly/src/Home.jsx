import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
const useInView=(th=0.12)=>{const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];};
const FadeIn=({children,delay=0})=>{const[ref,vis]=useInView();return<div ref={ref} style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(20px)",transition:`all 0.6s ease ${delay}s`}}>{children}</div>;};
const MODULES=[
  {icon:"💬",name:"AI Chat Assistant",desc:"Custom chatbot trained on YOUR business. Answers customer questions 24/7 on your website. Captures leads while you sleep.",tag:"Most Popular",verticals:["Dentists","Med Spas","Lawyers","Vets"]},
  {icon:"⭐",name:"AI Review Manager",desc:"Automatically requests reviews after appointments. Routes happy customers to Google, catches unhappy ones privately. AI writes response drafts.",tag:"High ROI",verticals:["All Industries"]},
  {icon:"📱",name:"AI WhatsApp Responder",desc:"Answers customer WhatsApp messages 24/7 in natural language. Handles menu questions, availability, pricing, delivery zones.",tag:"Coming Soon",verticals:["Restaurants","Retail","Clinics"]},
  {icon:"📸",name:"AI Content Engine",desc:"Generates weekly social media posts, ad copy, and product descriptions. Matches your brand voice and local market.",tag:"",verticals:["All Industries"]},
  {icon:"📞",name:"AI Voice Receptionist",desc:"Answers phone calls with a natural AI voice trained on your business. Schedules appointments, handles triage, captures leads.",tag:"Roadmap",verticals:["Dentists","Clinics","Lawyers"]},
];
const REVIEWS=[
  {name:"Dr. Sarah M.",role:"Dentist",loc:"Houston, TX",text:"The AI chatbot captured 22 leads in the first month. Patients love getting instant answers about insurance at 10pm.",stars:5},
  {name:"Mike R.",role:"Restaurant Owner",loc:"Chicago, IL",text:"Went from 23 Google reviews to 89 in 60 days. The automated review requests are a game-changer.",stars:5},
  {name:"Jessica C.",role:"Med Spa Owner",loc:"Los Angeles, CA",text:"Bookings up 35% since adding the chat assistant. It answers questions I didn't even know patients were asking.",stars:5},
];
export default function Home(){
  const params=new URLSearchParams(window.location.search);
  const fromBizScorer=params.get("from")==="bizscorer";
  const bizName=params.get("biz")||"";
  const bizType=params.get("type")||"";
  const S={
    btn:{background:"linear-gradient(135deg,#059669,#047857)",color:"white",border:"none",borderRadius:14,padding:"18px 36px",fontSize:18,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:10,boxShadow:"0 4px 14px rgba(5,150,105,0.3)",textDecoration:"none"},
    btn2:{background:"#f1f5f9",color:"#1e293b",border:"1px solid #e2e8f0",borderRadius:14,padding:"16px 28px",fontSize:16,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8,textDecoration:"none"},
  };
  return(
    <div style={{background:"#f8fafc",minHeight:"100vh",color:"#1e293b"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        ::selection{background:rgba(5,150,105,.2)}
        @media(max-width:768px){.home-grid{grid-template-columns:1fr!important}.home-modules{grid-template-columns:1fr!important}.home-reviews{grid-template-columns:1fr!important}h1{font-size:42px!important}h2{font-size:28px!important}}
      `}</style>
      {/* NAV */}
      <nav style={{padding:"0 32px",height:64,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #e2e8f0",background:"white",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1200,width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link to="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
            <span style={{fontSize:22}}>⚡</span>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:20,color:"#1e293b"}}>Zid<span style={{color:"#059669"}}>ly</span></span>
          </Link>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <a href="#modules" style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",textDecoration:"none",fontWeight:500}}>Modules</a>
            <a href="#pricing" style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",textDecoration:"none",fontWeight:500}}>Pricing</a>
            <Link to="/dentists" style={{...S.btn,padding:"10px 20px",fontSize:14}}>Try Free Demo</Link>
          </div>
        </div>
      </nav>
      {/* FROM BIZSCORER BANNER */}
      {fromBizScorer&&(
        <div style={{background:"linear-gradient(135deg,#059669,#047857)",padding:"16px 32px",textAlign:"center"}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"white",fontWeight:600}}>
            👋 Welcome from BizScorer!{bizName?` We found issues with ${decodeURIComponent(bizName)}.`:" We found issues in your audit."} See how Zidly fixes them automatically.
          </p>
        </div>
      )}
      {/* HERO */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"80px 40px 0"}}>
        <FadeIn>
          <div style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:56,alignItems:"center"}} className="home-grid">
            <div>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:100,padding:"6px 14px",marginBottom:20}}>
                <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#059669"}}>⚡ AI Growth Platform for Local Businesses</span>
              </div>
              <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(42px,7vw,72px)",fontWeight:800,lineHeight:1.02,letterSpacing:"-0.04em",color:"#0f172a",marginBottom:20}}>Supercharge your business<br/><span style={{background:"linear-gradient(135deg,#059669,#0d9488)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>with AI</span></h1>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",lineHeight:1.6,marginBottom:32,maxWidth:520}}>AI chatbots, automated reviews, social media content, WhatsApp responders — all trained on YOUR business, working 24/7. No coding. No hiring. Just results.</p>
              <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                <Link to="/dentists" style={S.btn}>Try Free Demo →</Link>
                <a href="https://bizscorer.com" target="_blank" rel="noopener noreferrer" style={S.btn2}>📊 Free Business Audit</a>
              </div>
              <div style={{display:"flex",gap:24,marginTop:28}}>
                {[{n:"28,470+",l:"businesses audited"},{n:"50+",l:"AI data points"},{n:"24/7",l:"always working"}].map((s,i)=>(
                  <div key={i}>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:"#059669",lineHeight:1}}>{s.n}</p>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#64748b"}}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"white",borderRadius:24,padding:"32px",border:"1px solid #e2e8f0",boxShadow:"0 8px 40px rgba(0,0,0,0.06)"}}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#059669",fontWeight:600,marginBottom:12}}>💬 Live AI Chat — Try it now</p>
              <div style={{background:"#f8fafc",borderRadius:16,padding:20,marginBottom:16}}>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <div style={{width:32,height:32,borderRadius:10,background:"#059669",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:14,flexShrink:0}}>AI</div>
                  <div style={{background:"white",borderRadius:12,padding:"10px 14px",border:"1px solid #e2e8f0",maxWidth:"80%"}}>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#334155",lineHeight:1.5}}>Hi! I'm the AI assistant for your practice. I can answer questions about your services, insurance, scheduling — 24/7. Patients get instant help, you capture every lead.</p>
                  </div>
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginBottom:12}}>
                  <div style={{background:"#059669",borderRadius:12,padding:"10px 14px",maxWidth:"75%"}}>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"white",lineHeight:1.5}}>Do you accept Delta Dental insurance?</p>
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <div style={{width:32,height:32,borderRadius:10,background:"#059669",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:14,flexShrink:0}}>AI</div>
                  <div style={{background:"white",borderRadius:12,padding:"10px 14px",border:"1px solid #e2e8f0",maxWidth:"80%"}}>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#334155",lineHeight:1.5}}>Yes! We accept Delta Dental PPO and Premier plans. Would you like to schedule a visit? I can check availability right now.</p>
                  </div>
                </div>
              </div>
              <Link to="/dentists" style={{...S.btn,width:"100%",justifyContent:"center",fontSize:16,padding:"14px 24px",borderRadius:12}}>Try on YOUR business — free →</Link>
            </div>
          </div>
        </FadeIn>
      </section>
      {/* MODULES */}
      <section id="modules" style={{maxWidth:1100,margin:"100px auto 0",padding:"0 40px"}}>
        <FadeIn>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:12}}>Everything your business needs</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",textAlign:"center",marginBottom:48,maxWidth:560,margin:"0 auto 48px"}}>One platform. Five AI modules. All trained on your specific business.</p>
        </FadeIn>
        <div className="home-modules" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {MODULES.map((m,i)=>(
            <FadeIn key={i} delay={i*0.05}>
              <div style={{background:"white",borderRadius:20,padding:"28px 24px",border:"1px solid #e2e8f0",height:"100%",position:"relative"}}>
                {m.tag&&<span style={{position:"absolute",top:16,right:16,fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:m.tag==="Most Popular"?"#059669":m.tag==="High ROI"?"#d97706":"#64748b",background:m.tag==="Most Popular"?"#f0fdf4":m.tag==="High ROI"?"#fffbeb":"#f1f5f9",padding:"4px 10px",borderRadius:8}}>{m.tag}</span>}
                <span style={{fontSize:36,display:"block",marginBottom:14}}>{m.icon}</span>
                <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:8}}>{m.name}</h3>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#475569",lineHeight:1.6,marginBottom:12}}>{m.desc}</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {m.verticals.map((v,j)=><span key={j} style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b",background:"#f1f5f9",padding:"3px 8px",borderRadius:6}}>{v}</span>)}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
      {/* HOW IT WORKS WITH BIZSCORER */}
      <section style={{maxWidth:900,margin:"100px auto 0",padding:"0 40px"}}>
        <FadeIn>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:44,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:48}}>How it works</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:40}} className="home-reviews">
            {[
              {num:"01",icon:"📊",title:"Get your free audit",desc:"BizScorer scans your Google, website, social media & competitors. You see every problem — free."},
              {num:"02",icon:"🎯",title:"Try your AI assistant",desc:"Enter your website URL. In 30 seconds, a custom AI chatbot appears that knows YOUR business. Test it live."},
              {num:"03",icon:"⚡",title:"Turn it on",desc:"Pick a plan. We install everything. Your AI starts answering customers, collecting reviews, and posting content — 24/7."},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <span style={{fontSize:48,display:"block",marginBottom:12}}>{s.icon}</span>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:56,fontWeight:800,color:"#e2e8f0",lineHeight:1}}>{s.num}</p>
                <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:8,marginTop:-4}}>{s.title}</h3>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#475569",lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>
      {/* TESTIMONIALS */}
      <section style={{maxWidth:1100,margin:"100px auto 0",padding:"0 40px"}}>
        <FadeIn>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:44,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:44}}>Business owners love Zidly</h2>
          <div className="home-reviews" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
            {REVIEWS.map((r,i)=>(
              <div key={i} style={{background:"white",borderRadius:20,padding:"28px 24px",border:"1px solid #e2e8f0"}}>
                <div style={{display:"flex",gap:2,marginBottom:12}}>{[1,2,3,4,5].map(j=><span key={j} style={{color:"#facc15",fontSize:16}}>★</span>)}</div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#475569",lineHeight:1.6,fontStyle:"italic",marginBottom:14}}>"{r.text}"</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,color:"#0f172a"}}>{r.name}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b"}}>{r.role} · {r.loc}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>
      {/* PRICING */}
      <section id="pricing" style={{maxWidth:800,margin:"100px auto 0",padding:"0 40px",textAlign:"center"}}>
        <FadeIn>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:44,fontWeight:800,color:"#0f172a",marginBottom:12}}>Simple pricing</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",marginBottom:40}}>Start with what you need. Upgrade as you grow.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}} className="home-reviews">
            {[
              {name:"Starter",price:"$97",setup:"$99 setup",items:["AI Chat Assistant","24/7 lead capture","Monthly report","Website installation"],popular:false},
              {name:"Growth",price:"$197",setup:"$299 setup",items:["Everything in Starter","AI Review Manager","Review routing system","Lead dashboard"],popular:true},
              {name:"Pro",price:"$297",setup:"$499 setup",items:["Everything in Growth","AI Content Engine","Social media calendar","Priority support"],popular:false},
            ].map((p,i)=>(
              <div key={i} style={{background:p.popular?"linear-gradient(135deg,#059669,#047857)":"white",borderRadius:20,padding:"28px 24px",border:p.popular?"none":"1px solid #e2e8f0",color:p.popular?"white":"#1e293b",position:"relative"}}>
                {p.popular&&<span style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"#facc15",color:"#0f172a",fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,padding:"4px 14px",borderRadius:100}}>MOST POPULAR</span>}
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,marginBottom:4}}>{p.name}</p>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:40,fontWeight:800,marginBottom:2}}>{p.price}<span style={{fontSize:16,fontWeight:500,opacity:0.7}}>/mo</span></p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,opacity:0.6,marginBottom:16}}>{p.setup}</p>
                {p.items.map((item,j)=><p key={j} style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,lineHeight:2,opacity:0.9}}>✓ {item}</p>)}
                <Link to="/dentists" style={{display:"block",textAlign:"center",marginTop:16,padding:"12px 20px",borderRadius:12,background:p.popular?"white":"#059669",color:p.popular?"#059669":"white",fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,textDecoration:"none"}}>Try Free Demo</Link>
              </div>
            ))}
          </div>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",marginTop:16}}>30-day money-back guarantee · No contracts · Cancel anytime</p>
        </FadeIn>
      </section>
      {/* BOTTOM CTA */}
      <section style={{maxWidth:800,margin:"100px auto 0",padding:"0 40px",textAlign:"center"}}>
        <FadeIn>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#0f172a",marginBottom:16}}>Ready to supercharge<br/>your business?</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",marginBottom:32}}>Try the AI demo on your own business. Takes 30 seconds. Free.</p>
          <div style={{display:"flex",justifyContent:"center",gap:14}}>
            <Link to="/dentists" style={{...S.btn,fontSize:20,padding:"20px 44px"}}>Try Free Demo →</Link>
          </div>
        </FadeIn>
      </section>
      {/* FOOTER */}
      <footer style={{maxWidth:1200,margin:"100px auto 0",padding:"32px 40px 24px",borderTop:"1px solid #e2e8f0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>⚡</span>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:16,color:"#1e293b"}}>Zid<span style={{color:"#059669"}}>ly</span></span>
          </div>
          <div style={{display:"flex",gap:20}}>
            <a href="https://bizscorer.com" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b",textDecoration:"none"}}>Free Business Audit</a>
            <a href="mailto:hello@zidly.ai" style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b",textDecoration:"none"}}>Contact</a>
          </div>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#94a3b8"}}>© 2025 Zidly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
