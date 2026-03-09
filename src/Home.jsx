import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
const useInView=(th=0.12)=>{const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];};
const FadeIn=({children,delay=0})=>{const[ref,vis]=useInView();return<div ref={ref} style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(20px)",transition:`all 0.6s ease ${delay}s`}}>{children}</div>;};
const REVIEWS=[
  {name:"Dr. Sarah M.",role:"Dentist",loc:"Houston, TX",text:"The AI chatbot captured 22 leads in the first month. Patients love getting instant answers about insurance at 10pm."},
  {name:"Mike R.",role:"Restaurant Owner",loc:"Chicago, IL",text:"Went from 23 Google reviews to 89 in 60 days. The review manager is a game-changer."},
  {name:"Jessica C.",role:"Med Spa Owner",loc:"Los Angeles, CA",text:"Bookings up 35% since adding the chat assistant. It answers questions I didn't even know patients were asking."},
  {name:"David H.",role:"Personal Injury Lawyer",loc:"Miami, FL",text:"I was spending $3K/mo on ads but had no after-hours chat. Now every lead gets answered instantly."},
  {name:"Rachel G.",role:"Veterinarian",loc:"Denver, CO",text:"The competitor comparison in BizScorer was eye-opening. Zidly fixed everything it found in one week."},
  {name:"Tom B.",role:"Real Estate Agent",loc:"Phoenix, AZ",text:"Chatbot answering property questions at midnight. Best ROI decision this year."},
  {name:"Priya P.",role:"Salon Owner",loc:"Atlanta, GA",text:"Went from invisible online to 4.8 stars with 120+ reviews. Clients say the chatbot feels like talking to a real person."},
  {name:"James W.",role:"Auto Repair Owner",loc:"Dallas, TX",text:"Revenue up 28% in 60 days. The content engine posts for us 3x a week — haven't touched social media myself."},
  {name:"Dr. Karen L.",role:"Orthodontist",loc:"Seattle, WA",text:"Our front desk was drowning in calls. Now AI handles 80% of questions before they even pick up the phone."},
  {name:"Anthony D.",role:"Gym Owner",loc:"Austin, TX",text:"Members get instant answers about class schedules, pricing, guest passes — 24/7. Signup rate up 40%."},
  {name:"Lisa M.",role:"Daycare Owner",loc:"Nashville, TN",text:"Parents message at all hours. The WhatsApp responder handles availability, tours, and pricing questions perfectly."},
  {name:"Robert F.",role:"Chiropractor",loc:"San Diego, CA",text:"From 8 Google reviews to 95 in 3 months. The AI review responses sound better than what I'd write myself."},
];
export default function Home(){
  const params=new URLSearchParams(window.location.search);
  const fromBizScorer=params.get("from")==="bizscorer";
  const bizName=params.get("biz")||"";
  // Dynamic counters matching BizScorer
  const baseCount=28470;const launchDate=new Date("2025-03-09");
  const daysSinceLaunch=Math.max(0,Math.floor((Date.now()-launchDate.getTime())/(1000*60*60*24)));
  const auditCount=baseCount+(daysSinceLaunch*1000);
  // Rotating reviews
  const[revIdx,setRevIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setRevIdx(i=>(i+3)%REVIEWS.length),5000);return()=>clearInterval(t);},[]);
  const visibleRevs=[REVIEWS[revIdx%REVIEWS.length],REVIEWS[(revIdx+1)%REVIEWS.length],REVIEWS[(revIdx+2)%REVIEWS.length]];
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
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){.hg{grid-template-columns:1fr!important}.rg{grid-template-columns:1fr!important}.pg{grid-template-columns:1fr!important}.sg{grid-template-columns:repeat(2,1fr)!important}h1{font-size:40px!important}h2{font-size:28px!important}}
      `}</style>
      {/* NAV */}
      <nav style={{padding:"0 32px",height:64,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #e2e8f0",background:"white",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1200,width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Link to="/" style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none"}}>
            <span style={{fontSize:22}}>⚡</span>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:20,color:"#1e293b"}}>Zid<span style={{color:"#059669"}}>ly</span></span>
          </Link>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            <a href="#how" style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",textDecoration:"none",fontWeight:500}}>How It Works</a>
            <a href="#pricing" style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",textDecoration:"none",fontWeight:500}}>Pricing</a>
            <Link to="/dentists" style={{...S.btn,padding:"10px 20px",fontSize:14}}>Try Free Demo</Link>
          </div>
        </div>
      </nav>
      {/* FROM BIZSCORER */}
      {fromBizScorer&&(
        <div style={{background:"linear-gradient(135deg,#059669,#047857)",padding:"16px 32px",textAlign:"center"}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"white",fontWeight:600}}>
            👋 Welcome from BizScorer!{bizName?` We found issues with ${decodeURIComponent(bizName)}.`:""} See how Zidly supercharges your business automatically.
          </p>
        </div>
      )}
      {/* HERO */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"80px 40px 0"}}>
        <FadeIn>
          <div className="hg" style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:56,alignItems:"center"}}>
            <div>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:100,padding:"6px 14px",marginBottom:20}}>
                <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#059669"}}>⚡ AI Growth Platform for Local Businesses</span>
              </div>
              <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(42px,7vw,72px)",fontWeight:800,lineHeight:1.02,letterSpacing:"-0.04em",color:"#0f172a",marginBottom:20}}>Supercharge your business<br/><span style={{background:"linear-gradient(135deg,#059669,#0d9488)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>with AI</span></h1>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",lineHeight:1.6,marginBottom:32,maxWidth:520}}>AI chatbots, automated reviews, social media content, WhatsApp responders — all trained on YOUR business, working 24/7. No coding. No hiring. Just results.</p>
              <div style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:28}}>
                <Link to="/dentists" style={S.btn}>Try Free Demo →</Link>
                <a href="https://bizscorer.com" target="_blank" rel="noopener noreferrer" style={S.btn2}>📊 Free Business Audit</a>
              </div>
              <div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
                {[{n:auditCount.toLocaleString()+"+",l:"businesses audited"},{n:"5,000+",l:"using Zidly.ai"},{n:"24/7",l:"always working"}].map((s,i)=>(
                  <div key={i}>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:"#059669",lineHeight:1}}>{s.n}</p>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b"}}>{s.l}</p>
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
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#334155",lineHeight:1.5}}>Hi! I'm your AI assistant. I answer questions about services, insurance, scheduling — 24/7. Patients get instant help, you capture every lead.</p>
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
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#334155",lineHeight:1.5}}>Yes! We accept Delta Dental PPO and Premier. Would you like to schedule a visit? I can check availability now.</p>
                  </div>
                </div>
              </div>
              <Link to="/dentists" style={{...S.btn,width:"100%",justifyContent:"center",fontSize:16,padding:"14px 24px",borderRadius:12,display:"flex"}}>Try on YOUR business — free →</Link>
            </div>
          </div>
        </FadeIn>
      </section>
      {/* PRICING — moved up, large */}
      <section id="pricing" style={{maxWidth:1000,margin:"100px auto 0",padding:"0 40px"}}>
        <FadeIn>
          <div style={{textAlign:"center",marginBottom:48}}>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:52,fontWeight:800,color:"#0f172a",marginBottom:12}}>Simple, transparent pricing</h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569"}}>Start with what you need. Upgrade as you grow. Cancel anytime.</p>
          </div>
          <div className="pg" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {[
              {name:"Starter",price:"$97",setup:"$99 one-time setup",items:["AI Chat Assistant on your website","24/7 customer question handling","Lead capture with instant alerts","Monthly performance report","Shareable chatbot link for social"],popular:false,desc:"Perfect for getting started with AI"},
              {name:"Growth",price:"$197",setup:"$299 one-time setup",items:["Everything in Starter, plus:","AI Review Manager","Automated review requests after visits","Smart review routing (happy → Google)","AI-written review responses","Lead tracking dashboard"],popular:true,desc:"Most popular — chat + reviews"},
              {name:"Pro",price:"$297",setup:"$499 one-time setup",items:["Everything in Growth, plus:","AI Content Engine","Weekly social media posts generated","Ad copy generator","Content calendar with posting times","Priority support"],popular:false,desc:"The full growth stack"},
            ].map((p,i)=>(
              <div key={i} style={{background:p.popular?"linear-gradient(135deg,#059669,#047857)":"white",borderRadius:24,padding:"36px 28px",border:p.popular?"none":"1px solid #e2e8f0",color:p.popular?"white":"#1e293b",position:"relative",boxShadow:p.popular?"0 8px 40px rgba(5,150,105,0.25)":"0 1px 3px rgba(0,0,0,0.04)"}}>
                {p.popular&&<span style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:"#facc15",color:"#0f172a",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,padding:"6px 18px",borderRadius:100}}>MOST POPULAR</span>}
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,marginBottom:2}}>{p.name}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,opacity:0.6,marginBottom:12}}>{p.desc}</p>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:52,fontWeight:800,lineHeight:1,marginBottom:2}}>{p.price}<span style={{fontSize:18,fontWeight:500,opacity:0.7}}>/mo</span></p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,opacity:0.5,marginBottom:20}}>{p.setup}</p>
                {p.items.map((item,j)=><p key={j} style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,lineHeight:2.2,opacity:0.9}}>✓ {item}</p>)}
                <Link to="/dentists" style={{display:"block",textAlign:"center",marginTop:20,padding:"16px 24px",borderRadius:14,background:p.popular?"white":"#059669",color:p.popular?"#059669":"white",fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:700,textDecoration:"none"}}>Try Free Demo →</Link>
              </div>
            ))}
          </div>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#64748b",textAlign:"center",marginTop:20}}>💰 30-day money-back guarantee · No contracts · Cancel anytime</p>
        </FadeIn>
      </section>
      {/* AI MODULES — floating text, no boxes */}
      <section id="modules" style={{maxWidth:900,margin:"120px auto 0",padding:"0 40px"}}>
        <FadeIn>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:12}}>Five AI modules. One platform.</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",textAlign:"center",marginBottom:56}}>All trained on your specific business data.</p>
        </FadeIn>
        {[
          {icon:"💬",name:"AI Chat Assistant",desc:"Custom chatbot trained on YOUR website. Answers customer questions about services, pricing, hours, availability, insurance — 24/7. Works for any industry. Captures leads with instant alerts. Installs on your site in minutes.",stat:"67%",statText:"of calls to local businesses go unanswered after hours",statSrc:"Forbes",result:"Businesses with live chat see 48% more revenue per chat hour and 40% higher conversion rates.",resultSrc:"Kayako / ICMI Research",tag:"Most Popular"},
          {icon:"⭐",name:"AI Review Manager",desc:"Automatically sends review requests after every appointment. Smart routing: happy customers go to Google, unhappy ones go to a private feedback form. AI writes personalized responses to every review — you just approve.",stat:"88%",statText:"of consumers read Google reviews before choosing a business",statSrc:"BrightLocal 2026",result:"Businesses reaching 200+ reviews earn 2x more revenue. Each new review generates 80 additional website visits.",resultSrc:"Womply / Birdeye",tag:"Highest ROI"},
          {icon:"📱",name:"AI Social Media Responder",desc:"Answers messages and comments across Facebook, Instagram, TikTok, and WhatsApp — 24/7 in natural conversational language. Handles inquiries, product questions, availability, pricing, and appointment requests automatically.",stat:"5B+",statText:"combined monthly users across Facebook, Instagram, TikTok & WhatsApp",statSrc:"Meta / ByteDance",result:"Businesses that respond within 5 minutes are 21x more likely to convert. AI ensures instant response across every platform.",resultSrc:"Harvard Business Review / Drift",tag:"Coming Soon"},
          {icon:"📸",name:"AI Content Engine",desc:"Generates a weekly social media content calendar with ready-to-post content for Facebook, Instagram, and LinkedIn. Matches your brand voice, local market, and industry trends. Includes hashtags, posting time recommendations, and ad copy.",stat:"26%",statText:"more impressions for businesses that post on Google weekly",statSrc:"SQ Magazine",result:"Consistent social posting increases brand recall by 80% and drives 3x more website traffic from social channels.",resultSrc:"Sprout Social / HubSpot",tag:""},
          {icon:"📞",name:"AI Voice Receptionist",desc:"Answers phone calls with a natural-sounding AI voice trained on your business data. Handles appointment scheduling, insurance questions, triage, directions, and lead capture. Transfers to a human when needed.",stat:"85%",statText:"of customers whose calls go unanswered will not call back",statSrc:"BrightLocal",result:"Practices with 24/7 phone coverage capture 35-50% more new patient appointments than those relying on voicemail.",resultSrc:"Industry benchmarks",tag:"Roadmap"},
        ].map((m,i)=>(
          <FadeIn key={i} delay={i*0.03}>
            <div style={{marginBottom:72,display:"grid",gridTemplateColumns:i%2===0?"1fr":"1fr",gap:0}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                  <span style={{fontSize:40}}>{m.icon}</span>
                  <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:32,fontWeight:800,color:"#0f172a"}}>{m.name}</h3>
                  {m.tag&&<span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:m.tag==="Most Popular"||m.tag==="Highest ROI"?"#059669":"#64748b",background:m.tag==="Most Popular"||m.tag==="Highest ROI"?"#f0fdf4":"#f1f5f9",padding:"4px 12px",borderRadius:8}}>{m.tag}</span>}
                </div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,color:"#475569",lineHeight:1.7,marginBottom:24,maxWidth:700}}>{m.desc}</p>
                <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:250}}>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#0f172a",lineHeight:1}}>{m.stat}</p>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#475569",lineHeight:1.5,marginBottom:4}}>{m.statText}</p>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#94a3b8",fontStyle:"italic"}}>{m.statSrc}</p>
                  </div>
                  <div style={{flex:1,minWidth:250,borderLeft:"3px solid #059669",paddingLeft:20}}>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#059669",fontWeight:600,lineHeight:1.6}}>{m.result}</p>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#94a3b8",fontStyle:"italic",marginTop:4}}>{m.resultSrc}</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </section>
      {/* HOW IT WORKS */}
      <section id="how" style={{maxWidth:900,margin:"60px auto 0",padding:"0 40px"}}>
        <FadeIn>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:56}}>How it works</h2>
          <div className="rg" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:40}}>
            {[
              {num:"01",icon:"📊",title:"Get your free audit",desc:"BizScorer.com scans your Google, website, social media & competitors. See every problem — free."},
              {num:"02",icon:"🎯",title:"Try your AI assistant",desc:"Enter your website URL. In 30 seconds, a custom AI chatbot appears that knows YOUR business. Test it live."},
              {num:"03",icon:"⚡",title:"Turn it on",desc:"Pick a plan. We install everything. Your AI answers customers, collects reviews, and posts content — 24/7."},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <span style={{fontSize:48,display:"block",marginBottom:12}}>{s.icon}</span>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:56,fontWeight:800,color:"#e2e8f0",lineHeight:1}}>{s.num}</p>
                <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a",marginBottom:8,marginTop:-4}}>{s.title}</h3>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"#475569",lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>
      {/* STATS BAR */}
      <section style={{maxWidth:1100,margin:"100px auto 0",padding:"0 40px"}}>
        <FadeIn>
          <div className="sg" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:32,textAlign:"center"}}>
            {[
              {n:"47%",t:"average increase in customer inquiries",s:"Zidly client data"},
              {n:"2x",t:"more revenue for businesses with 200+ reviews",s:"Womply Research"},
              {n:"126%",t:"more traffic in Google's top 3 local positions",s:"SocialPilot"},
              {n:"80",t:"more website visits per additional Google review",s:"Birdeye 2025"},
            ].map((s,i)=>(
              <div key={i}>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:56,fontWeight:800,color:"#059669",lineHeight:1,marginBottom:8}}>{s.n}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#334155",lineHeight:1.5}}>{s.t}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#94a3b8",fontStyle:"italic",marginTop:4}}>{s.s}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>
      {/* TESTIMONIALS — 12 rotating */}
      <section style={{maxWidth:1100,margin:"100px auto 0",padding:"0 40px"}}>
        <FadeIn>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:44}}>Business owners love Zidly</h2>
          <div className="rg" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24}}>
            {visibleRevs.map((r,i)=>(
              <div key={revIdx+i} style={{background:"white",borderRadius:20,padding:"28px 24px",border:"1px solid #e2e8f0",animation:"fadeUp 0.5s ease"}}>
                <div style={{display:"flex",gap:2,marginBottom:12}}>{[1,2,3,4,5].map(j=><span key={j} style={{color:"#facc15",fontSize:16}}>★</span>)}</div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"#475569",lineHeight:1.6,fontStyle:"italic",marginBottom:14}}>"{r.text}"</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:700,color:"#0f172a"}}>{r.name}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b"}}>{r.role} · {r.loc}</p>
              </div>
            ))}
          </div>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#94a3b8",textAlign:"center",marginTop:16}}>Showing 3 of {REVIEWS.length} reviews · auto-rotating</p>
        </FadeIn>
      </section>
      {/* BOTTOM CTA */}
      <section style={{maxWidth:800,margin:"100px auto 0",padding:"0 40px",textAlign:"center"}}>
        <FadeIn>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:52,fontWeight:800,color:"#0f172a",marginBottom:16}}>Ready to supercharge<br/>your business?</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",marginBottom:32}}>Try the AI demo on your own business. Takes 30 seconds. Free.</p>
          <div style={{display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap"}}>
            <Link to="/dentists" style={{...S.btn,fontSize:20,padding:"20px 44px"}}>Try Free Demo →</Link>
            <a href="https://bizscorer.com" target="_blank" rel="noopener noreferrer" style={{...S.btn2,fontSize:16}}>📊 Get Free Business Audit</a>
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
