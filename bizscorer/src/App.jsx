import { useState, useEffect, useRef, useCallback } from "react";
import { REVIEWS, HERO_STATS, STEPS, FAQS, RotatingReviews, FAQSection, PRIVACY_TEXT, TERMS_TEXT } from "./landing.jsx";

/* ═══════════════════════════════════════════════════════════
   MARKET CONFIGS
   ═══════════════════════════════════════════════════════════ */
const MARKETS = {
  US:{id:"US",label:"United States",cur:"$",curCode:"USD",lang:"en",weights:{google:25,website:20,social:15,responsive:15,competitive:15,seo:10},platforms:["Google","Yelp","Facebook","Instagram","Website"],ltv:"$3,000-5,000",pricing:{starter:"$97/mo",growth:"$197/mo",pro:"$297/mo"},scanPrice:"$4.99",unlimitedPrice:"$29.99/mo",whatsappPrimary:false,captureType:"email",captureLabel:"Email",capturePh:"you@email.com",platformChecks:"Yelp, Healthgrades (if healthcare), BBB, Angi (if home services), NextDoor",showLetterGrade:true},
  EG:{id:"EG",label:"Egypt",cur:"EGP ",curCode:"EGP",lang:"ar-eg",weights:{google:15,website:10,social:20,responsive:25,competitive:15,seo:15},platforms:["WhatsApp","Facebook","Instagram","Google"],ltv:"10,000-50,000 EGP",pricing:{starter:"1,500 EGP/mo",growth:"2,500 EGP/mo",pro:"4,000 EGP/mo"},scanPrice:"79 EGP",unlimitedPrice:"449 EGP/mo",whatsappPrimary:true,captureType:"tel",captureLabel:"WhatsApp",capturePh:"+20 1XX XXX XXXX",platformChecks:"Elmenus/Talabat (restaurants), OLX/Dubizzle (real estate), Jumia/Noon (e-commerce), Facebook Marketplace",showLetterGrade:false},
  GULF:{id:"GULF",label:"Gulf Region",cur:"$",curCode:"USD",lang:"ar",weights:{google:20,website:15,social:20,responsive:20,competitive:15,seo:10},platforms:["WhatsApp","Instagram","Google","Snapchat"],ltv:"$1,500-10,000",pricing:{starter:"$99/mo",growth:"$199/mo",pro:"$299/mo"},scanPrice:"$4.99",unlimitedPrice:"$29.99/mo",whatsappPrimary:true,captureType:"tel",captureLabel:"WhatsApp",capturePh:"+971 XX XXX XXXX",platformChecks:"Talabat/Deliveroo/Careem (restaurants), Snapchat presence, Zomato (UAE), Apple Maps, noon.com/Amazon.ae (e-commerce)",showLetterGrade:false},
  WEST:{id:"WEST",label:"Western",cur:"$",curCode:"USD",lang:"en",weights:{google:25,website:20,social:15,responsive:15,competitive:15,seo:10},platforms:["Google","Facebook","Instagram","Website","Trustpilot"],ltv:"$2,000-8,000",pricing:{starter:"$97/mo",growth:"$197/mo",pro:"$297/mo"},scanPrice:"$4.99",unlimitedPrice:"$29.99/mo",whatsappPrimary:false,captureType:"email",captureLabel:"Email",capturePh:"you@email.com",platformChecks:"Trustpilot (UK), Google Reviews, GDPR compliance check",showLetterGrade:true},
  OTHER:{id:"OTHER",label:"International",cur:"$",curCode:"USD",lang:"en",weights:{google:20,website:20,social:20,responsive:15,competitive:15,seo:10},platforms:["Google","Facebook","Instagram","WhatsApp","Website"],ltv:"$1,000-5,000",pricing:{starter:"$97/mo",growth:"$197/mo",pro:"$297/mo"},scanPrice:"$4.99",unlimitedPrice:"$29.99/mo",whatsappPrimary:false,captureType:"email",captureLabel:"Email",capturePh:"you@email.com",platformChecks:"Google Reviews, major social platforms",showLetterGrade:false},
};
const GULF_CODES=["AE","SA","QA","KW","BH","OM"];
const WEST_CODES=["CA","GB","AU","NZ","DE","FR","ES","IT","NL","BE","AT","CH","SE","NO","DK","FI","IE","PT","PL","CZ","GR"];
const detectMarket=c=>c==="US"?MARKETS.US:c==="EG"?MARKETS.EG:GULF_CODES.includes(c)?MARKETS.GULF:WEST_CODES.includes(c)?MARKETS.WEST:MARKETS.OTHER;
const BIZ_TYPES=[{id:"dental",label:"Dental / Medical Practice",icon:"🦷"},{id:"restaurant",label:"Restaurant / Cafe",icon:"🍽️"},{id:"salon",label:"Salon / Med Spa / Beauty",icon:"💇"},{id:"realestate",label:"Real Estate",icon:"🏠"},{id:"retail",label:"Retail / E-commerce",icon:"🛍️"},{id:"legal",label:"Legal Services",icon:"⚖️"},{id:"auto",label:"Automotive",icon:"🚗"},{id:"homeservice",label:"Home Services",icon:"🔧"},{id:"fitness",label:"Fitness / Gym",icon:"💪"},{id:"education",label:"Education / Tutoring",icon:"📚"},{id:"other",label:"Other",icon:"🏢"}];
const COUNTRIES=[{code:"US",name:"United States"},{code:"CA",name:"Canada"},{code:"GB",name:"United Kingdom"},{code:"AU",name:"Australia"},{code:"NZ",name:"New Zealand"},{code:"IE",name:"Ireland"},{code:"ZA",name:"South Africa"},{code:"SG",name:"Singapore"},{code:"PH",name:"Philippines"},{code:"IN",name:"India"}];
const SCAN_MSGS=["Initializing advanced AI analysis...","Scanning Google Business Profile...","Analyzing website structure & performance...","Checking social media presence across platforms...","Running competitive intelligence algorithms...","Cross-referencing 50+ data points...","Identifying revenue opportunities...","Generating your personalized action plan...","Finalizing your business score..."];

/* ═══ HELPERS ═══ */
const letterGrade=s=>s>=90?"A+":s>=80?"A":s>=70?"B":s>=60?"C":s>=50?"D":s>=40?"D-":"F";
const wordLabel=s=>s>=80?"Excellent":s>=65?"Good":s>=50?"Average":s>=35?"Needs Work":"Critical";
const scoreColor=s=>s>=70?"#059669":s>=50?"#d97706":s>=35?"#ea580c":"#dc2626";

/* ═══ WHAT-IF SIMULATOR IMPACTS ═══ */
const WHATIF_TOGGLES=[
  {id:"reviews",label:"Get to 50+ Google Reviews",points:12,module:"Review Manager",icon:"⭐"},
  {id:"chatbot",label:"Add 24/7 AI Chat Assistant",points:10,module:"Chat Assistant",icon:"💬"},
  {id:"whatsapp",label:"Add WhatsApp Auto-Responder",points:10,module:"WhatsApp Responder",icon:"📱"},
  {id:"social",label:"Post on Social Media Weekly",points:8,module:"Content Engine",icon:"📸"},
  {id:"website",label:"Optimize Website with CTAs",points:7,module:"Website Builder",icon:"🌐"},
  {id:"booking",label:"Add Online Booking",points:6,module:"Booking (Coming Soon)",icon:"📅"},
  {id:"video",label:"Add Video Content",points:5,module:"Content Engine",icon:"🎥"},
];


/* ═══ PROMPTS ═══ */
const J="\n\nRESPOND WITH ONLY VALID JSON. No markdown, no backticks, no commentary.";
function buildPrompt(phase,inp,mkt,bType){
  const info=`Business: ${inp.name}\nCity: ${inp.city}\nCountry: ${COUNTRIES.find(c=>c.code===inp.country)?.name||inp.country}\nType: ${bType||"Unknown"}\n${inp.website?`Website: ${inp.website}\n`:""}${inp.facebook?`Facebook: ${inp.facebook}\n`:""}${inp.instagram?`Instagram: ${inp.instagram}\n`:""}${inp.tiktok?`TikTok: ${inp.tiktok}\n`:""}${inp.twitter?`X: ${inp.twitter}\n`:""}${inp.youtube?`YouTube: ${inp.youtube}\n`:""}${inp.linkedin?`LinkedIn: ${inp.linkedin}\n`:""}`;
  const ctx=`Market: ${mkt.label}. Platforms: ${mkt.platforms.join(",")}. ${mkt.whatsappPrimary?"WhatsApp is PRIMARY channel.":""} Also check: ${mkt.platformChecks}`;
  const P={
    detect:`Search for this business online and identify it. Also find ALL their online profiles:\n${info}\n\nSearch for their website, Google Business Profile, Facebook page, Instagram, TikTok, YouTube channel, LinkedIn, X/Twitter, and any other relevant profiles.\n\nReturn JSON: {"businessType":"TYPE_ID_FROM(dental,restaurant,salon,realestate,retail,legal,auto,homeservice,fitness,education,other)","businessName":"FULL_OFFICIAL_NAME","address":"FULL_ADDRESS","confidence":"HIGH_MEDIUM_LOW","profiles":{"website":"URL_OR_EMPTY","google":"GOOGLE_MAPS_URL_OR_EMPTY","facebook":"FULL_FB_URL_OR_EMPTY","instagram":"FULL_IG_URL_OR_EMPTY","tiktok":"FULL_TT_URL_OR_EMPTY","youtube":"FULL_YT_URL_OR_EMPTY","twitter":"FULL_X_URL_OR_EMPTY","linkedin":"FULL_LI_URL_OR_EMPTY","yelp":"FULL_YELP_URL_OR_EMPTY"}}${J}`,

    google:`Analyze Google Business Profile for:\n${info}\n${ctx}\n\nReturn JSON: {"score":NUM_0_100,"reviewCount":NUM,"avgRating":NUM,"ownerResponseRate":"PCT_OR_UNKNOWN","recentReviewDate":"DATE_OR_UNKNOWN","photoCount":NUM,"hasDescription":BOOL,"descriptionQuality":"GOOD_POOR_EMPTY","hasGooglePosts":BOOL,"lastPostDate":"DATE_OR_UNKNOWN","hoursListed":BOOL,"categoriesSet":BOOL,"qAndACount":NUM,"findings":["finding1","finding2","finding3"],"positives":["pos1","pos2"],"evidence":{"reviewCountDetail":"str","ratingDetail":"str","photoDetail":"str","competitorAvgReviews":"str"}}${J}`,

    website:`Analyze website for:\n${info}\n${ctx}\nType: ${bType}\n\nCheck: mobile-friendly, SSL, CTAs, online booking, chatbot, contact form, clickable phone, blog, testimonials, video, load speed. ${mkt.id==="US"?"Also check ADA/accessibility compliance indicators.":""} Check if competitors run Google Ads for this business category in this area.\n\nReturn JSON: {"score":NUM_0_100,"exists":BOOL,"url":"URL_OR_NONE","mobileFriendly":"YES_NO_UNKNOWN","hasSSL":BOOL,"hasCTA":BOOL,"hasOnlineBooking":BOOL,"hasChatbot":BOOL,"hasContactForm":BOOL,"hasClickablePhone":BOOL,"hasBlog":BOOL,"hasTestimonials":BOOL,"hasVideo":BOOL,"loadSpeed":"FAST_MED_SLOW","adaCompliance":"GOOD_POOR_UNKNOWN","competitorsRunAds":BOOL,"competitorAdKeywords":["keyword1"],"findings":["f1","f2","f3"],"positives":["p1","p2"],"evidence":{"urlChecked":"url","featuresFound":"list","missingFeatures":"list"}}${J}`,

    social:`Analyze ALL social media + YouTube deep dive for:\n${info}\n${ctx}\nType: ${bType}\n\nDo a DEEP YouTube analysis if channel exists. Also check platform-specific: ${mkt.platformChecks}\n\nReturn JSON: {"score":NUM_0_100,"facebook":{"exists":BOOL,"followers":"NUM_OR_UNK","lastPost":"DATE_OR_UNK","frequency":"DAILY_WEEKLY_MONTHLY_RARE_NEVER"},"instagram":{"exists":BOOL,"followers":"NUM_OR_UNK","lastPost":"DATE_OR_UNK","frequency":"STR","usesReels":BOOL},"tiktok":{"exists":BOOL,"followers":"NUM_OR_UNK","videoCount":"NUM_OR_0"},"youtube":{"exists":BOOL,"subscribers":"NUM_OR_UNK","videoCount":"NUM_OR_0","lastUpload":"DATE_OR_UNK"},"whatsapp":{"exists":BOOL,"businessVerified":BOOL},"twitter":{"exists":BOOL,"active":BOOL},"linkedin":{"exists":BOOL},"findings":["f1","f2","f3"],"positives":["p1","p2"],"evidence":{"platformsFound":"list","platformsMissing":"list"}}${J}`,

    competitive:`Find 3-5 real competitors and compare:\n${info}\n${ctx}\nType: ${bType}\n\nName REAL competitors with REAL data. Also describe what a potential customer sees at 10pm on each site.\n\nReturn JSON: {"score":NUM_0_100,"competitors":[{"name":"REAL_NAME","reviewCount":NUM,"avgRating":NUM,"hasWebsite":BOOL,"hasChatbot":BOOL,"hasBooking":BOOL,"socialPresence":"STRONG_MOD_WEAK","estimatedScore":NUM_0_100}],"marketPosition":"TOP_MID_BOTTOM","areaAvgReviews":NUM,"areaAvgRating":NUM,"afterHoursComparison":{"thisBusiness":"WHAT_CUSTOMER_SEES_AT_10PM","topCompetitor":"WHAT_COMPETITOR_SITE_SHOWS","competitorName":"NAME"},"findings":["f1","f2","f3"],"positives":["p1"],"evidence":{"searchQuery":"query","competitorsFound":NUM}}${J}`,

    recommendations:`Generate prioritized recommendations:\n${info}\n${ctx}\nType: ${bType}\nPricing: Starter ${mkt.pricing.starter}, Growth ${mkt.pricing.growth}, Pro ${mkt.pricing.pro}\nCustomer LTV: ${mkt.ltv}\n\nFor EACH fix: specific free copy-paste content + DIY time vs automated time. Include revenue math using real industry percentages (e.g. "a 0.5 star increase = 20% revenue lift"). ${mkt.id==="EG"?"Write Arabic content in Egyptian Arabic (ammeya), NOT fusha.":mkt.id==="GULF"?"Write Arabic in formal Arabic with English translation.":""}\n\nReturn JSON: {"overallScore":NUM_0_100,"potentialScore":NUM_0_100,"monthlyLossPercent":"X-Y%","monthlyGainPercent":"X-Y%","revenueMath":"STEP_BY_STEP_USING_REAL_PERCENTAGES","topFixes":[{"priority":NUM,"title":"TITLE","impact":"HIGH_MED_LOW","difficulty":"EASY_MED_HARD","diyTime":"TIME","zidlyTime":"TIME","freeContent":"ACTUAL_COPY_PASTE_CONTENT","zidlyModule":"MODULE_OR_NONE","zidlyDescription":"ONE_SENTENCE","explanation":"WHY_WITH_DATA"}],"quickWins":["qw1","qw2","qw3"],"industryAvgScore":NUM_0_100,"percentile":"BOTTOM_X_PERCENT_IN_CITY"}${J}`
  };
  return P[phase];
}

/* ═══ SCAN LIMITING ═══ */
function getScanCount(){try{const d=JSON.parse(document.cookie.split(";").find(c=>c.trim().startsWith("bsScans="))?.split("=")?.[1]||"{}");if(Date.now()-d.ts>30*24*3600000)return 0;return d.count||0;}catch{return 0;}}
function incScanCount(){try{const c=getScanCount();document.cookie=`bsScans=${JSON.stringify({count:c+1,ts:Date.now()})};path=/;max-age=${30*24*3600}`;}catch{}}
function hasEmail(){try{return document.cookie.includes("bsEmail=1");}catch{return false;}}
function setHasEmail(){try{document.cookie=`bsEmail=1;path=/;max-age=${365*24*3600}`;}catch{}}
function getLastScore(){try{return JSON.parse(localStorage.getItem("bsLastScore")||"null");}catch{return null;}}
function saveLastScore(r){try{localStorage.setItem("bsLastScore",JSON.stringify({biz:r.name,score:r.overall,date:new Date().toLocaleDateString()}));}catch{}}


/* ═══ ICONS (inline SVG) ═══ */
const I={
  search:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  spark:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9 12l-7 1 5 5-2 7 7-4 7 4-2-7 5-5-7-1z"/></svg>,
  check:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  alert:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  arrow:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  mail:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  x:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  copy:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  share:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  trend:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  zap:<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  clock:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  chev:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  lock:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

/* ═══ SMALL COMPONENTS ═══ */
const CopyBtn=({text})=>{const[c,s]=useState(false);return<button onClick={()=>{navigator.clipboard.writeText(text);s(true);setTimeout(()=>s(false),2e3);}} style={{display:"inline-flex",alignItems:"center",gap:4,background:c?"#f0fdf4":"#f1f5f9",border:"1px solid",borderColor:c?"#bbf7d0":"#e2e8f0",borderRadius:8,padding:"5px 10px",color:c?"#059669":"#64748b",fontSize:11,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",fontWeight:600}}>{I.copy}{c?" Copied!":" Copy"}</button>;};

const ScoreGauge=({score,potential,size=160,label,market})=>{
  const d=Math.max(0,Math.min(100,Math.round(score||0)));const r=size/2-8;const circ=2*Math.PI*r;
  const col=scoreColor;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="7"/>
        {potential&&<circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(5,150,105,0.15)" strokeWidth="7" strokeDasharray={circ} strokeDashoffset={circ-(potential/100)*circ} strokeLinecap="round" style={{transition:"stroke-dashoffset 1.5s ease"}}/>}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col(d)} strokeWidth="7" strokeDasharray={circ} strokeDashoffset={circ-(d/100)*circ} strokeLinecap="round" style={{transition:"stroke-dashoffset 1.5s ease"}}/>
      </svg>
      <div style={{position:"relative",marginTop:-size+8,height:size-16,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:"'Outfit',sans-serif",fontSize:size>120?44:26,fontWeight:800,color:col(d),lineHeight:1}}>{d}<span style={{fontSize:size>120?16:10,color:"#94a3b8",fontWeight:600}}>/100</span></span>
        {market?.showLetterGrade&&size>120&&<span style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:800,color:col(d),marginTop:2}}>{letterGrade(d)}</span>}
        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:size>120?13:10,fontWeight:700,color:col(d),marginTop:2}}>{wordLabel(d)}</span>
      </div>
      {label&&<span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#64748b",textAlign:"center",marginTop:size>120?8:2}}>{label}</span>}
    </div>
  );
};

const QualityMeter=({inputs})=>{
  const n=[inputs.website,inputs.facebook,inputs.instagram,inputs.tiktok,inputs.twitter,inputs.youtube,inputs.linkedin].filter(Boolean).length;
  const p=Math.min(((n+3)/10)*100,100);const c=p<30?"#dc2626":p<60?"#d97706":"#059669";
  return(
    <div style={{marginTop:14,padding:"12px 16px",borderRadius:10,background:"#f8fafc",border:"1px solid #e2e8f0"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#64748b"}}>Report Depth</span>
        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:c}}>{Math.round(p)}%</span>
      </div>
      <div style={{width:"100%",height:4,borderRadius:100,background:"#e2e8f0",overflow:"hidden"}}><div style={{height:"100%",borderRadius:100,background:c,width:`${p}%`,transition:"width 0.5s"}}/></div>
    </div>
  );
};

const ScanItem=({label,status,score})=>(
  <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
    {status==="done"?<span style={{color:"#059669"}}>{I.check}</span>:status==="active"?<div style={{width:14,height:14,border:"2px solid #059669",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>:<div style={{width:14,height:14,borderRadius:"50%",background:"#e2e8f0"}}/>}
    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:500,color:status==="pending"?"#94a3b8":"#1e293b",flex:1}}>{label}</span>
    {status==="done"&&score!=null&&<span style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:800,color:scoreColor(score)}}>{score}<span style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>/100</span></span>}
  </div>
);

const WhatIfSimulator=({currentScore,market})=>{
  const[toggles,setToggles]=useState({});
  const bonus=Object.entries(toggles).filter(([,v])=>v).reduce((s,[k])=>{const t=WHATIF_TOGGLES.find(x=>x.id===k);return s+(t?.points||0);},0);
  const projected=Math.min(100,currentScore+bonus);
  return(
    <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:20,padding:"24px 22px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
      <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:700,color:"#1e293b",marginBottom:6,display:"flex",alignItems:"center",gap:6}}>{I.zap} What-If Simulator</h3>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b",marginBottom:16}}>Toggle improvements to see your projected score</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8,marginBottom:20}}>
        <div>{WHATIF_TOGGLES.map(t=>(
          <label key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",cursor:"pointer",borderBottom:"1px solid #f1f5f9"}}>
            <input type="checkbox" checked={!!toggles[t.id]} onChange={()=>setToggles(p=>({...p,[t.id]:!p[t.id]}))} style={{accentColor:"#059669"}}/>
            <span style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",color:toggles[t.id]?"#1e293b":"#64748b"}}>{t.icon} {t.label}</span>
            <span style={{marginLeft:"auto",fontSize:12,fontFamily:"'Outfit',sans-serif",fontWeight:700,color:"#059669"}}>+{t.points}</span>
          </label>
        ))}</div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingLeft:16}}>
          <ScoreGauge score={projected} size={120} label="Projected"/>
          {bonus>0&&<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#059669",fontWeight:600,marginTop:4}}>+{bonus} points</p>}
        </div>
      </div>
    </div>
  );
};

const useInView=(th=0.12)=>{const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];};
// Animated counter on scroll
const AnimNum=({target,suffix=""})=>{
  const[ref,vis]=useInView(0.3);const[n,setN]=useState(0);
  useEffect(()=>{if(!vis)return;let start=0;const end=parseInt(String(target).replace(/[^0-9]/g,""));const dur=1200;const step=Math.max(1,Math.floor(end/60));const t=setInterval(()=>{start+=step;if(start>=end){setN(end);clearInterval(t);}else setN(start);},dur/60);return()=>clearInterval(t);},[vis,target]);
  return <span ref={ref}>{vis?n.toLocaleString():0}{suffix}</span>;
};
// Expandable section
const Expandable=({title,children,defaultOpen=false})=>{
  const[open,setOpen]=useState(defaultOpen);
  return(
    <div style={{borderBottom:"1px solid #e2e8f0"}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 0",background:"none",border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:700,color:"#0f172a",textAlign:"left"}}>
        {title}<span style={{fontSize:24,color:"#94a3b8",transform:open?"rotate(45deg)":"rotate(0)",transition:"transform 0.2s"}}>+</span>
      </button>
      {open&&<div style={{paddingBottom:20,animation:"fadeUp 0.3s"}}>{children}</div>}
    </div>
  );
};
const FadeIn=({children,delay=0})=>{const[ref,vis]=useInView();return<div ref={ref} style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(16px)",transition:`opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`}}>{children}</div>;};

const AfterHoursComparison=({data})=>{
  const ah=data?.afterHoursComparison;if(!ah)return null;
  return(
    <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:20,padding:"24px 22px"}}>
      <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:700,color:"#991b1b",marginBottom:14}}>🌙 What Your Customers See at 10pm</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #fecaca"}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#dc2626",textTransform:"uppercase",marginBottom:6}}>Your Business</p>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#991b1b",lineHeight:1.5}}>{ah.thisBusiness}</p>
        </div>
        <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #bbf7d0"}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#059669",textTransform:"uppercase",marginBottom:6}}>{ah.competitorName||"Top Competitor"}</p>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#166534",lineHeight:1.5}}>{ah.topCompetitor}</p>
        </div>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════ */
export default function App(){
  const[inputs,setInputs]=useState({name:"",city:"",country:"US",website:"",facebook:"",instagram:"",tiktok:"",twitter:"",youtube:"",linkedin:""});
  const[market,setMarket]=useState(MARKETS.US);
  const[phase,setPhase]=useState("input"); // input|detecting|confirm|emailGate|scanning|scoreReveal|report|upgrade
  const[bizType,setBizType]=useState(null);
  const[detectedProfiles,setDetectedProfiles]=useState({});
  const[scanPhases,setScanPhases]=useState([
    {id:"google",label:"Google Business Profile",status:"pending",score:null,data:null},
    {id:"website",label:"Website & Ads Analysis",status:"pending",score:null,data:null},
    {id:"social",label:"Social Media & YouTube",status:"pending",score:null,data:null},
    {id:"competitive",label:"Competitive Intelligence",status:"pending",score:null,data:null},
    {id:"recommendations",label:"AI Action Plan",status:"pending",score:null,data:null},
  ]);
  const[report,setReport]=useState(null);
  const[scanMsgIdx,setScanMsgIdx]=useState(0);
  const[showCapture,setShowCapture]=useState(false);
  const[showShare,setShowShare]=useState(false);
  const[captured,setCaptured]=useState(hasEmail());
  const[captureVal,setCaptureVal]=useState("");
  const[lastScore]=useState(()=>getLastScore());
  const[animScore,setAnimScore]=useState(0);
  // Dynamic counters — auto-increment
  const baseCount=78257;const launchDate=new Date("2026-03-09");
  const daysSinceLaunch=Math.max(0,Math.floor((Date.now()-launchDate.getTime())/(1000*60*60*24)));
  const[auditCount,setAuditCount]=useState(baseCount+(daysSinceLaunch*1000));
  const[hourlyCount,setHourlyCount]=useState(50);
  useEffect(()=>{
    // Main counter: +3 every 90 seconds
    const mainT=setInterval(()=>setAuditCount(c=>c+3),90000);
    // Hourly counter: +2 every 60 seconds
    const hourT=setInterval(()=>setHourlyCount(c=>c+2),60000);
    return()=>{clearInterval(mainT);clearInterval(hourT);};
  },[]);
  const nameRef=useRef(null);
  const[showPrivacy,setShowPrivacy]=useState(false);
  const[showContact,setShowContact]=useState(false);
  const[contactMsg,setContactMsg]=useState({name:"",email:"",msg:""});
  const[contactSent,setContactSent]=useState(false);
  const[showTerms,setShowTerms]=useState(false);
  const upd=(k,v)=>setInputs(p=>({...p,[k]:v}));
  useEffect(()=>setMarket(detectMarket(inputs.country)),[inputs.country]);
  useEffect(()=>{const p=new URLSearchParams(window.location.search);if(p.get("biz"))upd("name",p.get("biz"));if(p.get("city"))upd("city",p.get("city"));if(p.get("country"))upd("country",p.get("country"));
    if(p.get("demo")==="1"){
      const dn="Remote Midtown Dentistry";
      setInputs(prev=>({...prev,name:dn,city:"Houston, TX",country:"US",website:"midtowndentistryhouston.com"}));
      setBizType("dental");
      setScanPhases([{id:"google",label:"Google Business Profile",status:"done",score:52,data:null},{id:"website",label:"Website & Ads Analysis",status:"done",score:61,data:null},{id:"social",label:"Social Media & YouTube",status:"done",score:28,data:null},{id:"competitive",label:"Competitive Intelligence",status:"done",score:44,data:null},{id:"recommendations",label:"AI Action Plan",status:"done",score:null,data:null}]);
      setReport({name:dn,overall:43,potential:81,monthlyLossPercent:"18-28%",monthlyGainPercent:"25-45%",
        revenueMath:"Average dental patient lifetime value: $3,000-5,000\nYour Google rating: 3.8 stars (competitor avg: 4.6)\nEstimated missed patients/month from lower rating: 8-12\nAt $3,500 avg LTV: $28,000-42,000/month in lost potential\nAfter-hours inquiries with no response: ~15/month\nAt 30% conversion rate: 4-5 lost patients = $14,000-17,500/month\n\nTotal estimated monthly opportunity loss: $42,000-59,500\nAs percentage of potential revenue: 18-28%",
        google:{score:52,reviewCount:23,avgRating:3.8,ownerResponseRate:"12%",recentReviewDate:"6 weeks ago",photoCount:8,hasDescription:true,descriptionQuality:"POOR",hasGooglePosts:false,lastPostDate:"Never",hoursListed:true,categoriesSet:true,qAndACount:0,
          findings:["Only 23 Google reviews — top competitor Smile Design Dental has 187","Average rating 3.8 stars — below the 4.2-4.5 trust sweet spot","Owner responded to only 12% of reviews — 97% of consumers read responses","No Google Posts in 12 months — weekly posting increases impressions 26%","Zero Q&A entries — competitors have 8-15 answered questions","Only 8 photos — top dental practices have 250+ on their profile"],
          positives:["Business hours listed and accurate","Google Business Profile verified","Categories properly set","Description exists"]},
        website:{score:61,exists:true,url:"midtowndentistryhouston.com",mobileFriendly:"YES",hasSSL:true,hasCTA:true,hasOnlineBooking:false,hasChatbot:false,hasContactForm:true,hasClickablePhone:true,hasBlog:false,hasTestimonials:false,hasVideo:false,loadSpeed:"MED",adaCompliance:"POOR",competitorsRunAds:true,competitorAdKeywords:["dentist houston","emergency dentist near me","dental implants houston"],
          findings:["No online booking — patients want to take action immediately, 2/3 competitors have it","No chatbot — patients at 10pm have no way to get answers, competitor has AI chat","No blog — dental keyword blogs improve local SEO rankings significantly","No video content — office tour videos get 2x more engagement","No testimonials page — 88% trust reviews as much as personal recommendations","Competitors running Google Ads for 'dentist houston' and 'emergency dentist near me'","ADA compliance poor — missing alt text, low contrast"],
          positives:["Website loads properly","SSL active","Mobile-friendly","Contact form present","Clickable phone number"]},
        social:{score:28,
          findings:["Facebook: no posts in 47 days — competitor posts 3x/week","Instagram: only 12 posts — competitors average 200+","No TikTok — dental TikTok gets massive organic reach","YouTube: 0 videos — competitors have tours and testimonials","No LinkedIn company page"],
          positives:["Facebook page exists","Instagram account set up"]},
        competitive:{score:44,
          afterHoursComparison:{thisBusiness:"Visitor sees a contact form and phone number to voicemail. No instant response. No chat. No AI. No online booking. Patient waits until morning — if they don't call next dentist first.",competitorName:"Smile Design Dental",topCompetitor:"Instant AI chat: 'Hi! Welcome to Smile Design Dental. I can help schedule an appointment, check insurance, or answer questions.' Plus online booking, emergency number, and 4.7 stars with 187 reviews."},
          competitors:[
            {name:"Smile Design Dental",reviewCount:187,avgRating:4.7,estimatedScore:82,hasChatbot:true,hasBooking:true,hasWebsite:true},
            {name:"Houston Family Dentistry",reviewCount:134,avgRating:4.5,estimatedScore:74,hasChatbot:false,hasBooking:true,hasWebsite:true},
            {name:"Pearl Dentistry Midtown",reviewCount:96,avgRating:4.4,estimatedScore:68,hasChatbot:false,hasBooking:true,hasWebsite:true}],
          findings:["Smile Design Dental: 8x more reviews (187 vs 23), 0.9 stars higher","2/3 competitors offer online booking","1 competitor has 24/7 AI chatbot","All 3 competitors run Google Ads","Competitors post on social 3-5x/week vs 0 in 47 days"],
          positives:["Your website loads faster than 2/3 competitors","Contact form is clean and functional"]},
        topFixes:[
          {priority:1,title:"Launch Google Review Campaign",impact:"HIGH",difficulty:"EASY",diyTime:"2 hrs setup + ongoing",zidlyTime:"15 min, automated",
            freeContent:"Hi [Patient Name],\n\nThank you for choosing Midtown Dentistry! We'd love to hear about your experience. Would you mind leaving a quick Google review? Takes less than 60 seconds and helps other patients find quality care.\n\n[YOUR GOOGLE REVIEW LINK]\n\nThank you!\n— The Midtown Dentistry Team",
            zidlyModule:"Review Manager",zidlyDescription:"Automates review requests, routes happy patients to Google, catches unhappy ones privately.",
            explanation:"23 reviews vs competitor's 187. Each review = ~80 more website visits (Birdeye). Getting to 50+ reviews = 266% more clicks. Highest ROI action available."},
          {priority:2,title:"Install 24/7 AI Chat Assistant",impact:"HIGH",difficulty:"EASY",diyTime:"N/A",zidlyTime:"30 min setup",
            freeContent:"NONE",zidlyModule:"Chat Assistant",zidlyDescription:"AI chatbot trained on your practice. Answers insurance, services, hours, captures leads 24/7.",
            explanation:"67% of dental calls go unanswered after hours. Competitor has chatbot responding at 10pm while your patients hit voicemail. AI chat captures avg 18 leads/month."},
          {priority:3,title:"Add Online Booking",impact:"HIGH",difficulty:"MEDIUM",diyTime:"4-6 hours",zidlyTime:"1 hr integration",
            freeContent:"Free options: Google Reserve integration, Calendly free tier, or your PMS built-in booking (Dentrix, Eaglesoft, Open Dental all have it).",
            zidlyModule:"NONE",zidlyDescription:"",
            explanation:"2/3 competitors have online booking. Without it, 10pm patients can't schedule until morning — by then they've booked elsewhere."},
          {priority:4,title:"Respond to ALL Reviews",impact:"MEDIUM",difficulty:"EASY",diyTime:"30 min/week",zidlyTime:"Automated",
            freeContent:"5-star response:\n'Thank you so much, [Name]! We're thrilled you had a great experience. Your smile is our priority — see you next visit!'\n\n3-star response:\n'Thank you for the feedback, [Name]. We'd love to hear more about how we can improve. Please reach out to us at [PHONE].'",
            zidlyModule:"Review Manager",zidlyDescription:"AI generates personalized responses to every review within hours.",
            explanation:"Only 12% response rate. 97% of consumers read responses. Responding within 24hrs to negatives = 33% more likely to be updated. Free and immediate."},
          {priority:5,title:"Start Weekly Social Posting",impact:"MEDIUM",difficulty:"MEDIUM",diyTime:"3-4 hrs/week",zidlyTime:"15 min/week review",
            freeContent:"Monday: 'Did you know? Regular checkups can detect early signs of diabetes and heart disease. Book yours today! 🦷'\nWednesday: 'Meet our team! [Photo] has been with us X years and specializes in [specialty].'\nFriday: 'Replace your toothbrush every 3-4 months! Your teeth will thank you 😊'",
            zidlyModule:"Content Engine",zidlyDescription:"AI generates weekly content calendar based on your practice.",
            explanation:"Facebook silent 47 days. Competitor posts 3x/week. Weekly Google posting = 26% more impressions."}
        ],
        quickWins:["Respond to 3 most recent Google reviews today — 10 minutes, shows engagement to 97% of future readers","Add 10 photos to Google Business Profile — you have 8, top practices have 250+","Update Google description with keywords: 'Houston dentist', 'family dentistry', 'emergency dental care'","Add 5 Q&A to Google profile (insurance, hours, services, parking, emergencies)","Post one Google Business update today: 'Now accepting new patients!' — instant visibility boost"],
        industryAvg:47,percentile:"Bottom 38% of dental practices in Houston",timestamp:new Date().toLocaleString()
      });
      setPhase("report");
    }
  },[]);
  useEffect(()=>{if(phase==="scanning"){const t=setInterval(()=>setScanMsgIdx(i=>(i+1)%SCAN_MSGS.length),3e3);return()=>clearInterval(t);}},[phase]);

  // Google Places Autocomplete
  useEffect(()=>{
    const init=()=>{
      try{
        if(!nameRef.current||!window.google?.maps?.places)return;
        const ac=new window.google.maps.places.Autocomplete(nameRef.current,{types:["establishment"]});
        ac.setFields(["name","formatted_address","address_components","website"]);
        ac.addListener("place_changed",()=>{
          try{
            const p=ac.getPlace();if(!p?.name)return;
            upd("name",p.name);
            if(p.formatted_address){const parts=p.formatted_address.split(",");if(parts.length>=2)upd("city",parts.slice(0,-1).join(",").trim());}
            if(p.address_components){const cc=p.address_components.find(c=>c.types.includes("country"));if(cc){const found=COUNTRIES.find(c=>c.code===cc.short_name);if(found)upd("country",cc.short_name);}}
            if(p.website)upd("website",p.website.replace(/^https?:\/\//,""));
          }catch(e){console.log("Places error:",e);}
        });
      }catch(e){console.log("Google Places unavailable — manual entry works fine:",e);}
    };
    if(window.__gmapsReady)init();
    else window.addEventListener("google-places-ready",init);
    return()=>window.removeEventListener("google-places-ready",init);
  },[]);

  const callAPI=async(prompt)=>{
    const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]})});
    const d=await r.json();if(d.error)throw new Error(d.error.message||"API error");
    const t=d.content?.filter(b=>b.type==="text")?.map(b=>b.text)?.join("")||"";
    try{return JSON.parse(t.replace(/```json|```/g,"").trim());}catch{return null;}
  };

  /* ═══ STEP 1: Detect business + find profiles ═══ */
  const startDetect=async()=>{
    if(!inputs.name.trim()||!inputs.city.trim())return;
    setPhase("detecting");
    try{
      const res=await callAPI(buildPrompt("detect",inputs,market,null));
      if(res){
        setBizType(res.businessType||"other");
        if(res.profiles){
          setDetectedProfiles(res.profiles);
          setInputs(p=>({...p,
            website:res.profiles.website||p.website||"",
            facebook:res.profiles.facebook||p.facebook||"",
            instagram:res.profiles.instagram||p.instagram||"",
            tiktok:res.profiles.tiktok||p.tiktok||"",
            youtube:res.profiles.youtube||p.youtube||"",
            twitter:res.profiles.twitter||p.twitter||"",
            linkedin:res.profiles.linkedin||p.linkedin||"",
          }));
        }
        if(res.businessName)setInputs(p=>({...p,name:res.businessName}));
        setPhase("confirm");
      }else{setPhase("confirm");setBizType("other");}
    }catch(e){console.error(e);setPhase("confirm");setBizType("other");}
  };

  /* ═══ STEP 2: After confirm, check gate ═══ */
  const afterConfirm=()=>{
    if(hasEmail()){
      const sc=getScanCount();
      if(sc>=2){setPhase("upgrade");return;}
      runFullScan(bizType||"other");
    }else{
      setPhase("emailGate");
    }
  };

  /* ═══ STEP 3: After email capture ═══ */
  const handleGateCapture=(v)=>{
    setHasEmail();setCaptured(true);setCaptureVal(v);
    fetch("https://formspree.io/f/mzdjddjj",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"lead",contact:v,business:inputs.name,city:inputs.city,country:inputs.country})}).catch(()=>{});
    console.log("Lead captured:",v);
    const sc=getScanCount();
    if(sc>=2){setPhase("upgrade");return;}
    runFullScan(bizType||"other");
  };

  /* ═══ STEP 4: Run full scan ═══ */
  const runFullScan=async(bType)=>{
    setPhase("scanning");incScanCount();setScanMsgIdx(0);
    const w=market.weights;
    const phases=["google","website","social","competitive","recommendations"];
    let gs=0,ws=0,ss=0,cs=0;
    const results={};
    for(let i=0;i<phases.length;i++){
      const pid=phases[i];
      setScanPhases(p=>p.map(x=>x.id===pid?{...x,status:"active"}:x));
      try{
        const res=await callAPI(buildPrompt(pid,inputs,market,bType));
        const sc=res?.score||res?.overallScore||0;
        if(pid==="google")gs=sc;if(pid==="website")ws=sc;if(pid==="social")ss=sc;if(pid==="competitive")cs=sc;
        results[pid]=res;
        setScanPhases(p=>p.map(x=>x.id===pid?{...x,status:"done",score:pid==="recommendations"?null:sc,data:res}:x));
      }catch(e){
        results[pid]=null;
        setScanPhases(p=>p.map(x=>x.id===pid?{...x,status:"done",score:0,data:null}:x));
      }
    }
    const recData=results.recommendations;
    const overall=recData?.overallScore||Math.round((gs*w.google+ws*w.website+ss*w.social+Math.floor((ws+ss)/2)*w.responsive+cs*w.competitive+Math.floor((gs+ws)/2)*w.seo)/100);
    const rData={
      name:inputs.name,overall,potential:recData?.potentialScore||Math.min(100,overall+30),
      monthlyLossPercent:recData?.monthlyLossPercent||"15-25%",monthlyGainPercent:recData?.monthlyGainPercent||"20-40%",
      revenueMath:recData?.revenueMath||"",
      google:results.google,website:results.website,social:results.social,competitive:results.competitive,
      topFixes:recData?.topFixes||[],quickWins:recData?.quickWins||[],
      industryAvg:recData?.industryAvgScore,percentile:recData?.percentile||"",
      timestamp:new Date().toLocaleString()
    };
    setReport(rData);saveLastScore(rData);
    setPhase("scoreReveal");
    let count=0;const target=rData.overall;
    const interval=setInterval(()=>{count+=2;if(count>=target){setAnimScore(target);clearInterval(interval);}else setAnimScore(count);},30);
    setTimeout(()=>setPhase("report"),3000);
  };

  const handleCapture=v=>{setCaptured(true);setHasEmail();setCaptureVal(v);setShowCapture(false);
    fetch("https://formspree.io/f/mzdjddjj",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"lead",contact:v,business:inputs.name,city:inputs.city,country:inputs.country})}).catch(()=>{});
    console.log("Captured:",v);};
  const shareUrl=`https://bizscorer.com?biz=${encodeURIComponent(inputs.name)}&city=${encodeURIComponent(inputs.city)}&country=${inputs.country}`;
  const zidlyUrl=`https://zidly.ai?from=bizscorer&biz=${encodeURIComponent(inputs.name)}&city=${encodeURIComponent(inputs.city)}&type=${bizType}`;

  const S={card:{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:20,padding:"32px 28px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"},btn:{background:"linear-gradient(135deg,#059669,#047857)",color:"white",border:"none",borderRadius:14,padding:"18px 36px",fontSize:18,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:10,boxShadow:"0 4px 14px rgba(5,150,105,0.3)",transition:"transform 0.15s, box-shadow 0.15s"},btn2:{background:"#f1f5f9",color:"#1e293b",border:"1px solid #e2e8f0",borderRadius:14,padding:"16px 28px",fontSize:16,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8},inp:{width:"100%",background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:12,padding:"16px 18px",color:"#1e293b",fontSize:16,fontFamily:"'DM Sans',sans-serif"},lbl:{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:7,display:"block"}};


  /* ═══ RENDER ═══ */
  return(
    <div style={{background:"#f8fafc",minHeight:"100vh",color:"#1e293b",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes countUp{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
        ::selection{background:rgba(5,150,105,.2)}
        input::placeholder,select::placeholder{color:#94a3b8}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(5,150,105,.2);border-radius:4px}
        input:focus,select:focus{border-color:#059669!important;outline:none;box-shadow:0 0 0 3px rgba(5,150,105,0.1)!important}
        select option{background:white;color:#1e293b}
        @media print{nav,.no-print{display:none!important}}
        @media(max-width:900px){.input-grid-3col{grid-template-columns:1fr!important}.sidebar-col{display:none!important}}
        .pac-container{border-radius:12px!important;border:1px solid #e2e8f0!important;box-shadow:0 8px 30px rgba(0,0,0,0.08)!important;margin-top:4px!important;font-family:'DM Sans',sans-serif!important;z-index:10000!important}
        .pac-item{padding:10px 16px!important;border-top:1px solid #f1f5f9!important;cursor:pointer!important;font-size:14px!important}
        .pac-item:hover{background:#f0fdf4!important}
        .pac-item-query{font-size:14px!important;font-weight:600!important;color:#0f172a!important}
        .pac-icon,.pac-icon-marker{display:none!important}
        .pac-item::before{content:"📍";margin-right:8px;font-size:14px}
        .pac-matched{font-weight:700!important;color:#059669!important}
        /* TABLET */
        @media(max-width:1024px){
          .hero-grid{grid-template-columns:1fr!important;gap:32px!important;max-width:100%!important}
          .industry-grid{grid-template-columns:1fr!important;gap:40px!important}
          .report-grid{grid-template-columns:repeat(2,1fr)!important}
          .cost-grid{grid-template-columns:1fr!important;gap:32px!important}
          .steps-grid{grid-template-columns:1fr!important;gap:32px!important}
        }
        /* MOBILE — iPhone optimized */
        @media(max-width:480px){
          section{padding-left:18px!important;padding-right:18px!important;margin-top:64px!important}
          .hero-grid{grid-template-columns:1fr!important;gap:28px!important;max-width:100%!important}
          .hero-grid>div>div{position:static!important}
          h1{font-size:36px!important;letter-spacing:-0.03em!important}
          h2{font-size:28px!important}
          h3{font-size:20px!important}
          .site-nav{padding:0 14px!important;height:52px!important}
          .site-nav>div{gap:8px!important}
          .site-nav a[href*="zidly"]{display:none!important}
          .hero-counters{gap:16px!important}
          .hero-counters>div p:first-child{font-size:24px!important}
          .form-row{grid-template-columns:1fr!important}
          .social-grid{grid-template-columns:1fr!important}
          .stats-grid{grid-template-columns:repeat(2,1fr)!important;gap:24px!important}
          .stats-grid>div p:first-child{font-size:36px!important}
          .results-grid{grid-template-columns:repeat(2,1fr)!important;gap:20px!important}
          .results-grid>div p:first-child{font-size:36px!important}
          .report-grid{grid-template-columns:1fr!important;gap:14px!important}
          .steps-grid{grid-template-columns:1fr!important;gap:28px!important}
          .steps-grid>div p:first-child{font-size:48px!important}
          .industry-grid{grid-template-columns:1fr!important;gap:32px!important}
          .cost-grid{grid-template-columns:1fr!important;gap:28px!important}
          .cost-grid>div:first-child h2{font-size:28px!important}
          .cost-grid>div:last-child>div p:first-child{font-size:36px!important}
          .before-after{gap:24px!important;margin-top:48px!important}
          .before-after>div p:first-child{font-size:56px!important}
          .compare-table-wrap{margin:0 -18px;padding:0 18px}
          .compare-table-wrap table{min-width:520px!important}
          .compare-table-wrap th,.compare-table-wrap td{padding:8px 10px!important;font-size:12px!important}
          .reviews-grid{grid-template-columns:1fr!important;gap:24px!important}
          .site-footer>div{flex-direction:column!important;align-items:flex-start!important;gap:12px!important}
          .site-footer>div>div:nth-child(2){flex-wrap:wrap;gap:12px!important}
          button{font-size:16px!important}
          .pac-container{z-index:9999!important}
        }
        @supports(padding:max(0px)){
          body{padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}
          .site-nav{padding-top:env(safe-area-inset-top)!important}
        }
        @media(hover:none){
          button:hover{transform:none}
          input,select,textarea{font-size:16px!important}
        }
        @media(hover:hover){
          button:hover{transform:translateY(-1px)}button:active{transform:translateY(0)}
        }
      `}</style>

      {/* NAV */}
      <nav className="no-print site-nav" style={{padding:"0 32px",height:64,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #e2e8f0",background:"white",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1200,width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>📊</span>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:20,color:"#1e293b"}}>Biz<span style={{color:"#059669"}}>Scorer</span></span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20}}>
            
            <a href="https://zidly.ai" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",textDecoration:"none"}}>Powered by <span style={{color:"#059669",fontWeight:700}}>Zidly</span></a>
          </div>
        </div>
      </nav>
      {/* ZIDLY BANNER */}
      <div className="no-print" style={{background:"linear-gradient(135deg,#059669,#047857)",padding:"10px 32px",textAlign:"center"}}>
        <a href="https://zidly.ai" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"inline-flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:700,color:"white"}}>Powered by <span style={{fontWeight:800,textDecoration:"underline",textUnderlineOffset:"3px"}}>Zidly.ai</span> — Get your score then supercharge your business with AI</span>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(255,255,255,0.7)"}}>or learn to DIY for free in your report</span>
        </a>
      </div>

      {/* LIVE COUNTER BAR */}
      {phase==="input"&&(
        <div style={{textAlign:"center",padding:"20px 32px 0"}}>
          <p style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#059669",lineHeight:1}}>{auditCount.toLocaleString()}+</p>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"#475569"}}>businesses have already checked their score</p>
        </div>
      )}

      {/* ═══ INPUT PHASE ═══ */}
      {phase==="input"&&(<>
        {/* HERO — everything above fold */}
        <section style={{maxWidth:1300,margin:"0 auto",padding:"48px 40px 0"}}>
          <FadeIn>
            <div className="hero-grid" style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:56,alignItems:"center"}}>
              {/* LEFT: headline + proof */}
              <div>
                <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(44px,7vw,76px)",fontWeight:800,lineHeight:1.0,letterSpacing:"-0.04em",color:"#0f172a",marginBottom:20}}>See how you compare<br/><span style={{background:"linear-gradient(135deg,#059669,#0d9488)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>to your competitors</span></h1>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:21,color:"#475569",lineHeight:1.6,marginBottom:28,maxWidth:520}}>Our AI runs <strong style={{color:"#0f172a"}}>50+ checks</strong> on your Google, website, social media & competitors — finds every problem, and gives you a free plan to fix them all.</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#059669",fontWeight:600,marginTop:8}}>Powered by Zidly.ai — fix everything automatically, or DIY for free</p>
                {/* Proof bar */}
                <div style={{display:"flex",gap:28,marginBottom:32,flexWrap:"wrap"}}>
                  {[{n:"50+",l:"data points checked"},{n:"3-5",l:"competitors compared"},{n:"$0",l:"100% free"}].map((s,i)=>(
                    <div key={i}>
                      <p style={{fontFamily:"'Outfit',sans-serif",fontSize:30,fontWeight:800,color:"#059669",lineHeight:1}}>{s.n}</p>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b"}}>{s.l}</p>
                    </div>
                  ))}
                </div>
                {/* First review — visible above fold */}
                <div style={{borderLeft:"3px solid #059669",paddingLeft:16,marginBottom:0}}>
                  <div style={{display:"flex",gap:2,marginBottom:4}}>{[1,2,3,4,5].map(i=><span key={i} style={{color:"#facc15",fontSize:14}}>★</span>)}</div>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#475569",fontStyle:"italic",lineHeight:1.5,marginBottom:6}}>"I had no idea my competitor had 8x more reviews than me. This report showed me exactly what they were doing differently. Fixed 3 things in one hour — phone started ringing more that week."</p>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#0f172a",fontWeight:600}}>Dr. Sarah Mitchell <span style={{color:"#94a3b8",fontWeight:400}}>· Dentist, Houston TX</span></p>
                </div>
              </div>
              {/* RIGHT: THE FORM */}
              <div style={{background:"white",border:"2px solid #e2e8f0",borderRadius:24,padding:"40px 36px",boxShadow:"0 12px 48px rgba(0,0,0,0.08)"}}>
                <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:"#0f172a",marginBottom:4}}>What{"'"}s your score?</h2>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#64748b",marginBottom:8}}>See how you compare to competitors in ~60 seconds</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#059669",marginBottom:20,fontWeight:500}}>🔴 {hourlyCount} businesses checked their score in the last hour</p>
                <div style={{marginBottom:14}}>
                  <label style={S.lbl}>Business Name *</label>
                  <input ref={nameRef} value={inputs.name} onChange={e=>upd("name",e.target.value)} placeholder="Start typing your business name..." style={{...S.inp,fontSize:19,padding:"18px 20px"}}/>
                </div>
                <div className="form-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
                  <div><label style={S.lbl}>City *</label><input value={inputs.city} onChange={e=>upd("city",e.target.value)} placeholder="Houston, TX" style={{...S.inp,fontSize:17,padding:"16px 18px"}}/></div>
                  <div><label style={S.lbl}>Country *</label>
                    <select value={inputs.country} onChange={e=>upd("country",e.target.value)} style={{...S.inp,fontSize:17,padding:"16px 18px",appearance:"none"}}>
                      {COUNTRIES.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:14}}>
                  <label style={S.lbl}>Website</label>
                  <div style={{display:"flex",alignItems:"center",background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
                    <span style={{padding:"0 4px 0 18px",color:"#94a3b8",fontSize:15,fontFamily:"'DM Sans',sans-serif"}}>https://</span>
                    <input value={inputs.website} onChange={e=>upd("website",e.target.value)} placeholder="yourpractice.com" style={{...S.inp,fontSize:17,padding:"16px 14px",border:"none",background:"transparent"}}/>
                  </div>
                </div>
                <details style={{marginBottom:18}}>
                  <summary style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#059669",fontWeight:600,cursor:"pointer",padding:"6px 0"}}>+ Add social profiles <span style={{fontWeight:400,color:"#94a3b8"}}>(optional)</span> <span style={{fontWeight:400,color:"#94a3b8",fontSize:12}}>— AI will automatically try to find them</span></summary>
                  <div className="social-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
                    {[["facebook","Facebook","facebook.com/","page"],["instagram","Instagram","instagram.com/","handle"],["tiktok","TikTok","tiktok.com/@","handle"],["youtube","YouTube","youtube.com/","@ch"]].map(([k,l,pre,ph])=>(
                      <div key={k}><label style={S.lbl}>{l}</label>
                        <div style={{display:"flex",alignItems:"center",background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,overflow:"hidden"}}>
                          <span style={{padding:"0 2px 0 12px",color:"#94a3b8",fontSize:12,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{pre}</span>
                          <input value={inputs[k]} onChange={e=>upd(k,e.target.value)} placeholder={ph} style={{...S.inp,border:"none",background:"transparent",paddingLeft:3,fontSize:14}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
                <button onClick={startDetect} disabled={!inputs.name.trim()||!inputs.city.trim()} style={{...S.btn,width:"100%",justifyContent:"center",fontSize:22,padding:"22px 36px",borderRadius:16,opacity:inputs.name.trim()&&inputs.city.trim()?1:0.4}}>
                  {I.search} Get My Business Score
                </button>
                <p style={{textAlign:"center",fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",marginTop:10}}>About 60 seconds · <strong style={{color:"#059669"}}>100% free results</strong></p>
              </div>
            </div>
          </FadeIn>
        </section>
        {/* SOCIAL PROOF — scrolling reviews */}
        <section style={{maxWidth:1200,margin:"80px auto 0",padding:"0 40px"}}>
          <FadeIn delay={0.1}>
            <RotatingReviews/>
          </FadeIn>
        </section>
        {/* WHY SCORE MATTERS — floating text, no box */}
        <section style={{maxWidth:1100,margin:"80px auto 0",padding:"0 40px"}}>
          <FadeIn delay={0.1}>
            <div style={{textAlign:"center",marginBottom:48}}>
              <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(36px,5vw,52px)",fontWeight:800,color:"#0f172a",marginBottom:16}}>Your competitors are winning customers <span style={{background:"linear-gradient(135deg,#059669,#0d9488)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>that should be yours</span></h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",maxWidth:640,margin:"0 auto"}}>Right now, potential customers are comparing you to competitors online. If your score is lower, they choose someone else — and you never even know it happened.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:40,textAlign:"center"}}>
              {HERO_STATS.map((s,i)=>(
                <div key={i}>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:60,fontWeight:800,color:"#059669",lineHeight:1,marginBottom:10}}>{s.number}</p>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"#334155",lineHeight:1.5,marginBottom:6}}>{s.text}</p>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#94a3b8",fontStyle:"italic"}}>{s.source}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>
        {/* WE SCAN EVERYTHING — expandable */}
        <section style={{maxWidth:900,margin:"100px auto 0",padding:"0 40px"}}>
          <FadeIn delay={0.1}>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:8}}>We scan <span style={{background:"linear-gradient(135deg,#059669,#0d9488)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>you AND your competitors</span></h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",textAlign:"center",marginBottom:40}}>5 AI analysis phases · 50+ data points · ~60 seconds</p>
            {[
              {icon:"⭐",title:"Google Business Profile — 12+ signals",detail:"Review count & average rating, owner response rate, photo count & quality, Google Posts frequency, Q&A section, hours accuracy, categories, description quality, recent review dates"},
              {icon:"🌐",title:"Website Deep Scan — 15+ checks",detail:"Mobile responsiveness, page speed, SSL certificate, call-to-action presence, online booking capability, chatbot/live chat, contact forms, clickable phone number, blog presence, testimonials page, video content, ADA/accessibility compliance indicators"},
              {icon:"📱",title:"Social Media & YouTube — 8 platforms",detail:"Facebook page activity & engagement, Instagram posting frequency, TikTok presence, YouTube (subscribers, video count, office tours, educational content), LinkedIn company page, X/Twitter, Snapchat — plus cross-platform posting consistency"},
              {icon:"🏆",title:"Competitive Intelligence — 3-5 real rivals",detail:"Actual competitor names in your area, their Google review counts & ratings, website features they have that you don't, who runs Google Ads for your keywords, side-by-side 'what customers see at 10pm' comparison"},
              {icon:"🎯",title:"Custom Action Plan — per-fix recommendations",detail:"Each fix ranked by impact & difficulty, estimated DIY time vs automated time, actual copy-paste content you can use immediately (review responses, social posts, website copy), revenue impact math, which Zidly module handles it automatically"},
            ].map((s,i)=>(
              <Expandable key={i} title={<span>{s.icon} {s.title}</span>} defaultOpen={i===0}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#475569",lineHeight:1.7,paddingLeft:8}}>{s.detail}</p>
              </Expandable>
            ))}
          </FadeIn>
        </section>
        {/* INDUSTRY SCORES */}
        <section style={{maxWidth:1100,margin:"100px auto 0",padding:"0 40px"}}>
          <FadeIn delay={0.1}>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:8}}>Most businesses score <span style={{color:"#0f172a",textDecoration:"underline",textDecorationColor:"#059669",textUnderlineOffset:"4px"}}>below 50</span></h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",textAlign:"center",marginBottom:48}}>Where do you stand? Top performers earn dramatically more revenue.</p>
            <div className="industry-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64}}>
              <div>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a",marginBottom:24}}>Average scores</p>
                {[{cat:"Dental Practices",score:47},{cat:"Restaurants & Cafes",score:38},{cat:"Salons & Med Spas",score:42},{cat:"Retail & E-commerce",score:35},{cat:"Real Estate",score:51},{cat:"Law Firms",score:44},{cat:"Veterinary Clinics",score:40}].map((c,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"#475569"}}>{c.cat}</span>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:30,fontWeight:800,color:"#0f172a"}}>{c.score}<span style={{fontSize:14,color:"#94a3b8"}}>/100</span></span>
                  </div>
                ))}
              </div>
              <div>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:"#059669",marginBottom:24}}>Top performers + revenue impact</p>
                {[{cat:"Dental Practices",score:82,rev:"2x more new patients/mo"},{cat:"Restaurants & Cafes",score:76,rev:"126% more foot traffic"},{cat:"Salons & Med Spas",score:79,rev:"47% more bookings"},{cat:"Retail & E-commerce",score:71,rev:"108% more revenue"},{cat:"Real Estate",score:87,rev:"3x more inquiries"},{cat:"Law Firms",score:81,rev:"22% higher case value"},{cat:"Veterinary Clinics",score:78,rev:"80 more visits per review"}].map((c,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"#475569"}}>{c.cat}</span>
                    <div style={{textAlign:"right"}}>
                      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:30,fontWeight:800,color:"#059669"}}>{c.score}</span>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#059669",fontWeight:600}}>{c.rev}</p>
                    </div>
                  </div>
                ))}
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#94a3b8",fontStyle:"italic",marginTop:10}}>BrightLocal, Podium, Birdeye, Womply, SocialPilot research</p>
              </div>
            </div>
          </FadeIn>
        </section>
        {/* WHAT YOUR REPORT INCLUDES — expandable cards */}
        <section style={{maxWidth:1100,margin:"100px auto 0",padding:"0 40px"}}>
          <FadeIn delay={0.1}>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:8}}>What you get — <span style={{color:"#059669"}}>for free</span></h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",textAlign:"center",marginBottom:44}}>Every problem found comes with a fix — free DIY content or one-click automation with Zidly.ai</p>
            <div className="report-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
              {[
                {icon:"📊",title:"Score /100 + Breakdown",desc:"Category scores for Google, Website, Social, Competitors."},
                {icon:"🏆",title:"Real Competitor Names",desc:"3-5 actual rivals with reviews, ratings, and feature gaps."},
                {icon:"🌙",title:"10pm After-Hours Test",desc:"What customers see on your site vs your competitor's — right now."},
                {icon:"💰",title:"Revenue Impact Estimate",desc:"How much your weak online presence costs — with the math."},
                {icon:"🎯",title:"Prioritized Action Plan",desc:"Ranked fixes with free copy-paste content for each one."},
                {icon:"⚡",title:"What-If Simulator",desc:"Toggle improvements to see projected score changes instantly."},
                {icon:"📋",title:"Quick Wins",desc:"3-5 free fixes you can do in under 30 minutes today."},
                {icon:"🔍",title:"Evidence & Data",desc:"Actual URLs, review counts, features detected. Nothing vague."},
                {icon:"📈",title:"Industry Benchmarks",desc:"Percentile ranking vs your industry and city average."},
              ].map((f,i)=>(
                <div key={i} style={{padding:"24px 22px",borderRadius:16,border:"1px solid #e2e8f0",background:"white"}}>
                  <span style={{fontSize:28,display:"block",marginBottom:10}}>{f.icon}</span>
                  <h4 style={{fontFamily:"'Outfit',sans-serif",fontSize:17,fontWeight:700,color:"#0f172a",marginBottom:6}}>{f.title}</h4>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#475569",lineHeight:1.5}}>{f.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>
        {/* VS PAID — floating table */}
        <section style={{maxWidth:1000,margin:"100px auto 0",padding:"0 40px"}}>
          <FadeIn delay={0.1}>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:44,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:8}}>Free beats paid</h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,color:"#475569",textAlign:"center",marginBottom:36}}>More features, zero cost. See how BizScorer compares.</p>
            <div className="compare-table-wrap" style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'DM Sans',sans-serif",minWidth:600}}>
              <thead><tr>
                <th style={{textAlign:"left",padding:"14px 16px",fontSize:15,color:"#64748b",borderBottom:"2px solid #e2e8f0"}}></th>
                <th style={{textAlign:"center",padding:"14px 16px",fontSize:17,fontWeight:800,color:"#059669",borderBottom:"2px solid #bbf7d0",background:"#f0fdf4"}}>BizScorer<br/><span style={{fontSize:22}}>FREE</span></th>
                <th style={{textAlign:"center",padding:"14px 16px",fontSize:14,color:"#64748b",borderBottom:"2px solid #e2e8f0"}}>Audit Tools<br/><span style={{fontSize:12}}>$49-149/mo</span></th>
                <th style={{textAlign:"center",padding:"14px 16px",fontSize:14,color:"#64748b",borderBottom:"2px solid #e2e8f0"}}>Agencies<br/><span style={{fontSize:12}}>$200-500/mo</span></th>
              </tr></thead>
              <tbody>
                {[["Overall score + breakdown",true,true,true],["Real competitor names",true,false,true],["After-hours test",true,false,false],["Revenue impact math",true,false,true],["Free fix content",true,false,false],["What-if simulator",true,false,false],["8-platform social scan",true,false,true],["YouTube analysis",true,false,false],["Google Ads detection",true,true,true],["ADA check",true,false,false],["Instant results",true,true,false],["No signup",true,false,false]].map(([feat,us,them,agency],i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #f1f5f9"}}>
                    <td style={{padding:"11px 16px",fontSize:14,color:"#334155"}}>{feat}</td>
                    <td style={{textAlign:"center",padding:"11px",background:"#f0fdf4",fontSize:17}}>{us?"✅":"—"}</td>
                    <td style={{textAlign:"center",padding:"11px",fontSize:17}}>{them?"✅":"❌"}</td>
                    <td style={{textAlign:"center",padding:"11px",fontSize:17}}>{agency?"✅":"❌"}</td>
                  </tr>
                ))}
                <tr style={{borderTop:"2px solid #e2e8f0"}}><td style={{padding:"14px 16px",fontSize:16,fontWeight:700}}>Price</td>
                  <td style={{textAlign:"center",padding:"14px",background:"#f0fdf4"}}><span style={{fontFamily:"'Outfit',sans-serif",fontSize:32,fontWeight:800,color:"#059669"}}>$0</span></td>
                  <td style={{textAlign:"center",padding:"14px"}}><span style={{fontSize:17,fontWeight:700,color:"#ef4444"}}>$49-149/mo</span></td>
                  <td style={{textAlign:"center",padding:"14px"}}><span style={{fontSize:17,fontWeight:700,color:"#ef4444"}}>$200-500/mo</span></td>
                </tr>
              </tbody>
            </table></div>
          </FadeIn>
        </section>
        {/* HOW IT WORKS */}
        <section style={{maxWidth:900,margin:"100px auto 0",padding:"0 40px"}}>
          <FadeIn delay={0.1}>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:56}}>Three steps. 60 seconds.</h2>
            <div className="steps-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:48}}>
              {STEPS.map((s,i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <span style={{fontSize:56,display:"block",marginBottom:12}}>{s.icon}</span>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:72,fontWeight:800,color:"#e2e8f0",lineHeight:1}}>{s.num}</p>
                  <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a",marginBottom:8,marginTop:-6}}>{s.title}</h3>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"#475569",lineHeight:1.6}}>{s.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>
        {/* RESULTS */}
        <section style={{maxWidth:1100,margin:"100px auto 0",padding:"0 40px"}}>
          <FadeIn delay={0.1}>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:48,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:56}}>What happens when you <span style={{color:"#059669"}}>close the gap</span></h2>
            <div className="results-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:32,textAlign:"center"}}>
              {[{stat:"2x",desc:"revenue with 200+ reviews",src:"Womply"},{stat:"126%",desc:"more traffic in Google top 3",src:"SocialPilot"},{stat:"80",desc:"more visits per new review",src:"Birdeye 2025"},{stat:"18%",desc:"revenue growth from better reviews",src:"LocaliQ"}].map((s,i)=>(
                <div key={i}>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:60,fontWeight:800,color:"#059669",lineHeight:1,marginBottom:10}}>{s.stat}</p>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"#334155"}}>{s.desc}</p>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#94a3b8",fontStyle:"italic",marginTop:4}}>{s.src}</p>
                </div>
              ))}
            </div>
            <div className="before-after" style={{display:"flex",justifyContent:"center",alignItems:"center",gap:48,marginTop:72}}>
              <div style={{textAlign:"center"}}><p style={{fontFamily:"'Outfit',sans-serif",fontSize:88,fontWeight:800,color:"#ef4444",lineHeight:1}}>31</p><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:17,color:"#64748b"}}>Before</p></div>
              <span style={{fontSize:40,color:"#cbd5e1"}}>→</span>
              <div style={{textAlign:"center"}}><p style={{fontFamily:"'Outfit',sans-serif",fontSize:88,fontWeight:800,color:"#059669",lineHeight:1}}>78</p><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:17,color:"#64748b"}}>After 60 days</p></div>
            </div>
          </FadeIn>
        </section>
        {/* ZIDLY BRIDGE */}
        <section style={{maxWidth:900,margin:"100px auto 0",padding:"0 40px",textAlign:"center"}}>
          <FadeIn delay={0.1}>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#059669",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Every problem comes with a fix</p>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:44,fontWeight:800,color:"#0f172a",marginBottom:16}}>Fix everything automatically<br/>with <a href="https://zidly.ai" target="_blank" rel="noopener noreferrer" style={{background:"linear-gradient(135deg,#059669,#0d9488)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",textDecoration:"none"}}>Zidly.ai</a></h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,color:"#475569",maxWidth:560,margin:"0 auto 32px",lineHeight:1.6}}>Your report includes free DIY fixes for every issue. But if you want to automate everything — AI reviews, 24/7 chat, social media, competitor monitoring — Zidly handles it all.</p>
            <div style={{display:"flex",justifyContent:"center",gap:32,flexWrap:"wrap",marginBottom:32}}>
              {[{icon:"⭐",name:"AI Review Manager",desc:"Automate review requests & responses"},{icon:"💬",name:"AI Chat Assistant",desc:"Answer customers 24/7 on your website"},{icon:"📱",name:"AI WhatsApp Responder",desc:"Handle inquiries automatically"},{icon:"📸",name:"AI Content Engine",desc:"Weekly social posts, generated for you"}].map((m,i)=>(
                <div key={i} style={{textAlign:"center",width:180}}>
                  <span style={{fontSize:32,display:"block",marginBottom:8}}>{m.icon}</span>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:700,color:"#0f172a",marginBottom:4}}>{m.name}</p>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b"}}>{m.desc}</p>
                </div>
              ))}
            </div>
            <a href="https://zidly.ai" target="_blank" rel="noopener noreferrer" style={{...S.btn,textDecoration:"none",fontSize:18,padding:"18px 40px"}}>See Zidly in Action →</a>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#94a3b8",marginTop:12}}>Plans from $97/mo · 30-day money-back guarantee</p>
          </FadeIn>
        </section>
        {/* FAQ */}
        <section style={{maxWidth:700,margin:"100px auto 0",padding:"0 40px"}}>
          <FadeIn delay={0.1}>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:44,fontWeight:800,color:"#0f172a",textAlign:"center",marginBottom:36}}>Questions?</h2>
            <FAQSection/>
          </FadeIn>
        </section>
        {/* BOTTOM CTA */}
        {/* SOCIAL PROOF COUNTER */}
        <section style={{maxWidth:800,margin:"80px auto 0",padding:"0 40px",textAlign:"center"}}>
          <FadeIn delay={0.1}>
            <p style={{fontFamily:"'Outfit',sans-serif",fontSize:64,fontWeight:800,color:"#059669",lineHeight:1}}>{auditCount.toLocaleString()}+</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,color:"#475569",marginBottom:4}}>businesses have already checked their score</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#059669"}}>🔴 {hourlyCount} checked in the last hour — join them</p>
          </FadeIn>
        </section>
        <section style={{maxWidth:800,margin:"60px auto 0",padding:"0 40px",textAlign:"center"}}>
          <FadeIn delay={0.1}>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:52,fontWeight:800,color:"#0f172a",marginBottom:16}}>Your competitors already know their score</h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:20,color:"#475569",marginBottom:32}}>Don{"'"}t be the last to find out. 60 seconds. Free.</p>
            <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} style={{...S.btn,fontSize:24,padding:"24px 52px",borderRadius:16}}>{I.search} See How I Compare</button>
          </FadeIn>
        </section>
        <footer className="site-footer" style={{maxWidth:1300,margin:"100px auto 0",padding:"32px 40px 24px",borderTop:"1px solid #e2e8f0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>📊</span>
              <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:16,color:"#1e293b"}}>Biz<span style={{color:"#059669"}}>Scorer</span></span>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#94a3b8",marginLeft:8}}>by <a href="https://zidly.ai" target="_blank" rel="noopener noreferrer" style={{color:"#059669",textDecoration:"none",fontWeight:600}}>Zidly</a></span>
            </div>
            <div style={{display:"flex",gap:20}}>
              <button onClick={()=>setShowPrivacy(true)} style={{background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b",cursor:"pointer"}}>Privacy</button>
              <button onClick={()=>setShowTerms(true)} style={{background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b",cursor:"pointer"}}>Terms</button>
              <button onClick={()=>setShowContact(true)} style={{background:"none",border:"none",fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b",cursor:"pointer"}}>Contact</button>
            </div>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#94a3b8"}}>© 2025 Zidly</p>
          </div>
        </footer>
      </>)}
      {/* ═══ EMAIL GATE ═══ */}
      {phase==="emailGate"&&(
        <section style={{maxWidth:440,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}><FadeIn><div style={S.card}>
          <div style={{width:48,height:48,borderRadius:14,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",color:"#059669",margin:"0 auto 16px"}}>{I.mail}</div>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:"#1e293b",marginBottom:6}}>Almost there! Enter your {market.captureLabel}</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b",marginBottom:8}}>We{"'"}ll send your full report with competitor data, action plan, and free fix content.</p>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <input type={market.captureType} value={captureVal} onChange={e=>setCaptureVal(e.target.value)} placeholder={market.capturePh} style={{...S.inp,flex:1}}/>
            <button onClick={()=>{if(captureVal.trim())handleGateCapture(captureVal.trim())}} style={S.btn}>Go</button>
          </div>
          <div style={{display:"flex",justifyContent:"center",gap:14}}>
            {[{icon:I.lock,text:"No spam ever"},{icon:I.check,text:"Unsubscribe anytime"},{icon:I.spark,text:"Data stays private"}].map((b,i)=>(
              <span key={i} style={{display:"flex",alignItems:"center",gap:3,fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#94a3b8"}}>{b.icon} {b.text}</span>
            ))}
          </div>
        </div></FadeIn></section>
      )}

      {/* ═══ UPGRADE PHASE ═══ */}
      {phase==="upgrade"&&(
        <section style={{maxWidth:480,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}><FadeIn><div style={S.card}>
          <div style={{width:48,height:48,borderRadius:14,background:"#fffbeb",display:"flex",alignItems:"center",justifyContent:"center",color:"#d97706",margin:"0 auto 16px",fontSize:22}}>⚡</div>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:"#1e293b",marginBottom:6}}>You{"'"}ve used your 2 free scans this month</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",marginBottom:24}}>Unlock unlimited scans to audit competitors, track progress, and stay ahead.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button style={{...S.btn,justifyContent:"center"}}>{I.zap} Single Scan — {market.scanPrice}</button>
            <button style={{...S.btn,justifyContent:"center",background:"linear-gradient(135deg,#7c3aed,#6d28d9)",boxShadow:"0 4px 14px rgba(124,58,237,0.25)"}}>{I.spark} Unlimited — {market.unlimitedPrice}</button>
          </div>
        </div></FadeIn></section>
      )}

      {/* ═══ SCANNING PHASE ═══ */}
      {phase==="scanning"&&(
        <section style={{maxWidth:520,margin:"0 auto",padding:"60px 24px"}}><FadeIn>
          <div style={S.card}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{width:56,height:56,borderRadius:16,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                <div style={{width:24,height:24,border:"3px solid #059669",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
              </div>
              <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:"#1e293b",marginBottom:6}}>Analyzing {inputs.name}...</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#059669",fontWeight:600,minHeight:20,animation:"fadeUp 0.5s"}} key={scanMsgIdx}>{SCAN_MSGS[scanMsgIdx]}</p>
            </div>
            {scanPhases.map(sp=><ScanItem key={sp.id} {...sp}/>)}
          </div>
        </FadeIn></section>
      )}

      {/* ═══ SCORE REVEAL ═══ */}
      {phase==="scoreReveal"&&report&&(
        <section style={{maxWidth:480,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}><FadeIn>
          <div style={{...S.card,padding:"40px 30px"}}>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:20}}>Your Business Score</p>
            <div style={{animation:"countUp 0.6s ease-out"}}>
              <ScoreGauge score={animScore} potential={report.potential} size={200} market={market}/>
            </div>
            {report.percentile&&<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",marginTop:16}}>{report.percentile}</p>}
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#94a3b8",marginTop:8}}>Full report loading...</p>
          </div>
        </FadeIn></section>
      )}


      {/* ═══ REPORT ═══ */}
      {phase==="report"&&report&&(
        <section style={{maxWidth:800,margin:"0 auto",padding:"30px 28px 60px"}}>
          {/* SCORE HERO — the dopamine hit */}
          <FadeIn><div style={{textAlign:"center",padding:"48px 32px",marginBottom:28,background:"linear-gradient(135deg,#f8fafc,#f0fdf4)",borderRadius:28,border:"1px solid #e2e8f0",position:"relative",overflow:"hidden"}}>
            {/* Subtle animated bg */}
            <div style={{position:"absolute",top:-40,right:-40,width:200,height:200,borderRadius:"50%",background:"rgba(5,150,105,0.06)",animation:"pulse 4s ease infinite"}}/>
            <div style={{position:"absolute",bottom:-60,left:-60,width:240,height:240,borderRadius:"50%",background:"rgba(5,150,105,0.04)",animation:"pulse 4s ease infinite 1s"}}/>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8,position:"relative"}}>Your Business Score</p>
            <div style={{position:"relative",display:"inline-block"}}>
              <ScoreGauge score={report.overall} potential={report.potential} size={220} market={market}/>
            </div>
            {report.percentile&&<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,color:"#dc2626",fontWeight:700,marginTop:16,position:"relative"}}>{report.percentile}</p>}
            {report.industryAvg&&<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#475569",marginTop:4,position:"relative"}}>Industry average: <strong style={{color:"#0f172a",fontSize:18}}>{report.industryAvg}/100</strong></p>}
            {/* Revenue impact — large, emotional */}
            <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:28,position:"relative",flexWrap:"wrap"}}>
              <div style={{background:"white",borderRadius:16,padding:"18px 28px",border:"1px solid #fecaca",textAlign:"center",minWidth:200}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#dc2626",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>You{"'"}re Losing</p>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:36,fontWeight:800,color:"#dc2626"}}>{report.monthlyLossPercent}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#991b1b"}}>of potential revenue</p>
              </div>
              <div style={{background:"white",borderRadius:16,padding:"18px 28px",border:"1px solid #bbf7d0",textAlign:"center",minWidth:200}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#059669",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>You Could Gain</p>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:36,fontWeight:800,color:"#059669"}}>{report.monthlyGainPercent}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#166534"}}>revenue increase</p>
              </div>
            </div>
            {report.revenueMath&&<details style={{marginTop:16,textAlign:"left",position:"relative"}}><summary style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b",cursor:"pointer",fontWeight:600}}>Show the math ▾</summary><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#475569",marginTop:8,lineHeight:1.7,whiteSpace:"pre-wrap",background:"white",padding:16,borderRadius:12,border:"1px solid #e2e8f0"}}>{report.revenueMath}</p></details>}
          </div></FadeIn>
          {/* POTENTIAL SCORE — the carrot + first Zidly CTA */}
          <FadeIn delay={0.04}><div style={{textAlign:"center",padding:"36px 28px",marginBottom:28,background:"linear-gradient(135deg,#059669,#047857)",borderRadius:24,color:"white",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-30,right:-30,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,0.05)"}}/>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4,color:"rgba(255,255,255,0.7)",position:"relative"}}>Your Potential Score</p>
            <p style={{fontFamily:"'Outfit',sans-serif",fontSize:88,fontWeight:800,lineHeight:1,position:"relative",marginBottom:4}}>{report.potential}</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,color:"rgba(255,255,255,0.8)",marginBottom:8,position:"relative"}}>You{"'"}re at {report.overall}. You could be at {report.potential}.</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"rgba(255,255,255,0.6)",marginBottom:24,position:"relative"}}>Your top competitors are already there.</p>
            <a href={zidlyUrl} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,background:"white",color:"#059669",border:"none",borderRadius:14,padding:"16px 36px",fontSize:18,fontWeight:700,fontFamily:"'DM Sans',sans-serif",textDecoration:"none",boxShadow:"0 4px 14px rgba(0,0,0,0.15)"}}>{I.zap} Close the Gap with Zidly →</a>
          </div></FadeIn>
          {/* CATEGORY SCORES — visual bars */}
          <FadeIn delay={0.06}><div style={{marginBottom:28}}>
            <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:800,color:"#0f172a",marginBottom:16}}>Score Breakdown</h3>
            {scanPhases.filter(p=>p.id!=="recommendations").map(sp=>(
              <div key={sp.id} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:600,color:"#1e293b"}}>{sp.label}</span>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:scoreColor(sp.score||0)}}>{sp.score||0}<span style={{fontSize:13,color:"#94a3b8"}}>/100</span></span>
                </div>
                <div style={{width:"100%",height:12,borderRadius:100,background:"#f1f5f9",overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:100,background:scoreColor(sp.score||0),width:`${sp.score||0}%`,transition:"width 1.5s ease",boxShadow:`0 0 8px ${scoreColor(sp.score||0)}40`}}/>
                </div>
              </div>
            ))}
          </div></FadeIn>
          {/* AFTER HOURS — the wake-up call */}
          <FadeIn delay={0.08}><div style={{marginBottom:28}}><AfterHoursComparison data={report.competitive}/></div></FadeIn>
          {/* ISSUES vs WORKING — emoji-heavy, visual */}
          <FadeIn delay={0.1}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:28}}>
            <div>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:800,color:"#dc2626",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>🚨 Issues Found</h3>
              {[...(report.google?.findings||[]),...(report.website?.findings||[]),...(report.social?.findings||[]),...(report.competitive?.findings||[])].filter(Boolean).slice(0,10).map((f,i)=>
                <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"10px 14px",borderRadius:12,background:"#fef2f2",border:"1px solid #fecaca",marginBottom:8}}>
                  <span style={{color:"#dc2626",flexShrink:0,fontSize:14,marginTop:1}}>✗</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#991b1b",lineHeight:1.5}}>{f}</span>
                </div>
              )}
            </div>
            <div>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:800,color:"#059669",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>✅ What{"'"}s Working</h3>
              {[...(report.google?.positives||[]),...(report.website?.positives||[]),...(report.social?.positives||[]),...(report.competitive?.positives||[])].filter(Boolean).slice(0,8).map((f,i)=>
                <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"10px 14px",borderRadius:12,background:"#f0fdf4",border:"1px solid #bbf7d0",marginBottom:8}}>
                  <span style={{color:"#059669",flexShrink:0,fontSize:14,marginTop:1}}>✓</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#166534",lineHeight:1.5}}>{f}</span>
                </div>
              )}
            </div>
          </div></FadeIn>
          {/* COMPETITOR BATTLE — visual cards */}
          {report.competitive?.competitors?.length>0&&(
            <FadeIn delay={0.12}><div style={{marginBottom:28}}>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:800,color:"#0f172a",marginBottom:16}}>🏆 You vs Competitors</h3>
              <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(4,1+report.competitive.competitors.length)},1fr)`,gap:12}}>
                <div style={{padding:20,borderRadius:16,background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",border:"2px solid #059669"}}>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#059669",textTransform:"uppercase",marginBottom:8}}>📍 You</p>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:700,color:"#0f172a",marginBottom:6}}>{inputs.name}</p>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:32,fontWeight:800,color:scoreColor(report.overall)}}>{report.overall}<span style={{fontSize:13,color:"#94a3b8"}}>/100</span></p>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#475569",marginTop:4}}>{report.google?.reviewCount||"?"} reviews · {report.google?.avgRating||"?"} ★</p>
                </div>
                {report.competitive.competitors.slice(0,3).map((c,i)=>(
                  <div key={i} style={{padding:20,borderRadius:16,background:"white",border:"1px solid #e2e8f0"}}>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",marginBottom:8}}>Competitor #{i+1}</p>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:"#0f172a",marginBottom:6}}>{c.name}</p>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:32,fontWeight:800,color:scoreColor(c.estimatedScore||50)}}>{c.estimatedScore||"?"}<span style={{fontSize:13,color:"#94a3b8"}}>/100</span></p>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#475569",marginTop:4}}>{c.reviewCount} reviews · {c.avgRating} ★</p>
                    <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
                      {c.hasChatbot&&<span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:"#f0fdf4",color:"#059669",fontWeight:700}}>AI Chat</span>}
                      {c.hasBooking&&<span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:"#f0fdf4",color:"#059669",fontWeight:700}}>Booking</span>}
                      {c.hasWebsite&&<span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:"#f1f5f9",color:"#64748b",fontWeight:700}}>Website</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div></FadeIn>
          )}
          {/* WHAT-IF SIMULATOR */}
          <FadeIn delay={0.14}><div className="no-print" style={{marginBottom:28}}><WhatIfSimulator currentScore={report.overall} market={market}/></div></FadeIn>
          {/* ACTION PLAN — bold cards */}
          <FadeIn delay={0.16}><div style={{marginBottom:28}}>
            <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:"#0f172a",marginBottom:16}}>🎯 Your Action Plan</h3>
            {(report.topFixes||[]).sort((a,b)=>(a.priority||99)-(b.priority||99)).map((fix,i)=>(
              <div key={i} style={{background:"white",border:"1px solid #e2e8f0",borderRadius:20,padding:"24px",marginBottom:14,boxShadow:"0 1px 3px rgba(0,0,0,0.03)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:"#059669"}}>#{i+1}</span>
                    <h4 style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,fontWeight:700,color:"#0f172a"}}>{fix.title}</h4>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8,background:fix.impact==="HIGH"?"#fef2f2":"#fffbeb",color:fix.impact==="HIGH"?"#dc2626":"#d97706"}}>{fix.impact} impact</span>
                    <span style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:8,background:"#f1f5f9",color:"#64748b"}}>{fix.difficulty}</span>
                  </div>
                </div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#475569",lineHeight:1.6,marginBottom:12}}>{fix.explanation}</p>
                {fix.diyTime&&fix.zidlyTime&&(
                  <div style={{display:"flex",gap:20,marginBottom:12,flexWrap:"wrap"}}>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b"}}>{I.clock} DIY: <strong style={{color:"#0f172a"}}>{fix.diyTime}</strong></span>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#059669"}}>{I.zap} Zidly: <strong>{fix.zidlyTime}</strong></span>
                  </div>
                )}
                {fix.freeContent&&fix.freeContent.length>5&&fix.freeContent!=="NONE"&&(
                  <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:14,padding:"14px 16px",marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,color:"#059669",textTransform:"uppercase"}}>🎁 Free Fix — Copy & Paste</span>
                      <CopyBtn text={fix.freeContent}/>
                    </div>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#166534",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{fix.freeContent}</p>
                  </div>
                )}
                {fix.zidlyModule&&fix.zidlyModule!=="NONE"&&(
                  <div style={{background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",border:"1px solid #bbf7d0",borderRadius:14,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                    <div>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,color:"#059669"}}>⚡ Automate with Zidly {fix.zidlyModule}</p>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#475569"}}>{fix.zidlyDescription||""}</p>
                    </div>
                    <a href={zidlyUrl} target="_blank" rel="noopener noreferrer" style={{background:"#059669",color:"white",border:"none",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,fontFamily:"'DM Sans',sans-serif",textDecoration:"none"}}>{I.zap} Try Free</a>
                  </div>
                )}
              </div>
            ))}
          </div></FadeIn>
          {/* QUICK WINS */}
          {report.quickWins?.length>0&&(
            <FadeIn delay={0.18}><div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:20,padding:"24px",marginBottom:28}}>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:800,color:"#92400e",marginBottom:12}}>⚡ Quick Wins — Do These Right Now</h3>
              {report.quickWins.map((w,i)=><p key={i} style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,color:"#78350f",lineHeight:1.7,marginBottom:6}}><span style={{fontWeight:800,color:"#b45309",fontSize:18}}>{i+1}.</span> {w}</p>)}
            </div></FadeIn>
          )}
          {/* FINAL CTA — dopamine close */}
          <FadeIn delay={0.2}><div className="no-print" style={{textAlign:"center",padding:"44px 28px",background:"linear-gradient(135deg,#059669,#047857)",borderRadius:24,color:"white",marginBottom:28}}>
            <p style={{fontFamily:"'Outfit',sans-serif",fontSize:20,marginBottom:4,color:"rgba(255,255,255,0.7)"}}>Your score right now</p>
            <p style={{fontFamily:"'Outfit',sans-serif",fontSize:72,fontWeight:800,lineHeight:1}}>{report.overall}</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,marginTop:8,marginBottom:4,color:"rgba(255,255,255,0.8)"}}>Your potential with Zidly</p>
            <p style={{fontFamily:"'Outfit',sans-serif",fontSize:72,fontWeight:800,lineHeight:1,marginBottom:20}}>{report.potential}</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,color:"rgba(255,255,255,0.7)",marginBottom:24}}>Your competitors are already closing this gap.</p>
            <a href={zidlyUrl} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,background:"white",color:"#059669",border:"none",borderRadius:14,padding:"18px 40px",fontSize:20,fontWeight:800,fontFamily:"'DM Sans',sans-serif",textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>{I.zap} Fix My Score with Zidly</a>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:12}}>Plans from {market.pricing.starter} · 30-day guarantee</p>
          </div></FadeIn>
          {/* ACTIONS */}
          <FadeIn delay={0.22}><div className="no-print" style={{display:"flex",justifyContent:"center",gap:12,marginTop:20,flexWrap:"wrap"}}>
            <button onClick={()=>setShowShare(true)} style={{...S.btn2,padding:"12px 20px",fontSize:14}}>{I.share} Share Report</button>
            <button onClick={()=>{window.print();}} style={{...S.btn2,padding:"12px 20px",fontSize:14}}>📄 Save as PDF</button>
            <button onClick={()=>{setPhase("input");setInputs(p=>({...p,name:"",website:"",facebook:"",instagram:"",tiktok:"",twitter:"",youtube:"",linkedin:""}));setScanPhases(sp=>sp.map(x=>({...x,status:"pending",score:null,data:null})));setReport(null);}} style={{...S.btn2,padding:"12px 20px",fontSize:14}}>🔍 Scan a Competitor</button>
          </div></FadeIn>
          {/* FOOTER */}
          <div style={{textAlign:"center",marginTop:36}}>
            <a href="https://zidly.ai" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,textDecoration:"none"}}>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b"}}>Powered by</span>
              <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:16}}>Zid<span style={{color:"#059669"}}>ly</span></span>
            </a>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#94a3b8",marginTop:5}}>Report generated {report.timestamp}</p>
          </div>
        </section>
      )}
      {/* ═══ MODALS ═══ */}
      {showCapture&&<div style={{position:"fixed",inset:0,zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)"}} onClick={()=>setShowCapture(false)}>
        <div onClick={e=>e.stopPropagation()} style={{...S.card,maxWidth:380,width:"90%",textAlign:"center",position:"relative"}}>
          <button onClick={()=>setShowCapture(false)} style={{position:"absolute",top:12,right:12,background:"none",border:"none",color:"#94a3b8",cursor:"pointer"}}>{I.x}</button>
          <div style={{width:44,height:44,borderRadius:12,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",color:"#059669",margin:"0 auto 14px"}}>{I.mail}</div>
          <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,color:"#1e293b",marginBottom:4}}>Get Your Full Report</h3>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#64748b",marginBottom:16}}>Detailed report + 30-day recheck reminder</p>
          <div style={{display:"flex",gap:6}}><input type={market.captureType} value={captureVal} onChange={e=>setCaptureVal(e.target.value)} placeholder={market.capturePh} style={{...S.inp,flex:1}}/><button onClick={()=>{if(captureVal.trim())handleCapture(captureVal.trim())}} style={S.btn}>Send</button></div>
        </div>
      </div>}

      {showShare&&<div style={{position:"fixed",inset:0,zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)"}} onClick={()=>setShowShare(false)}>
        <div onClick={e=>e.stopPropagation()} style={{...S.card,maxWidth:380,width:"90%",textAlign:"center",position:"relative"}}>
          <button onClick={()=>setShowShare(false)} style={{position:"absolute",top:12,right:12,background:"none",border:"none",color:"#94a3b8",cursor:"pointer"}}>{I.x}</button>
          <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,color:"#1e293b",marginBottom:12}}>Share Report</h3>
          <div style={{display:"flex",gap:6,marginBottom:10}}><input value={shareUrl} readOnly style={{...S.inp,flex:1,fontSize:11}}/><CopyBtn text={shareUrl}/></div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <a href={`https://wa.me/?text=${encodeURIComponent(`Check out this free AI business audit: ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" style={{...S.btn,textDecoration:"none",justifyContent:"center",background:"#25D366",boxShadow:"none",fontSize:13}}>Share on WhatsApp</a>
            <a href={`mailto:?subject=Business Audit: ${inputs.name}&body=Free AI business audit: ${shareUrl}`} style={{...S.btn2,textDecoration:"none",justifyContent:"center",fontSize:13}}>Share via Email</a>
          </div>
        </div>
      </div>}

      {/* Privacy Policy Modal */}
      {showPrivacy&&<div style={{position:"fixed",inset:0,zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)"}} onClick={()=>setShowPrivacy(false)}>
        <div onClick={e=>e.stopPropagation()} style={{...S.card,maxWidth:600,width:"90%",maxHeight:"80vh",overflow:"auto",position:"relative"}}>
          <button onClick={()=>setShowPrivacy(false)} style={{position:"absolute",top:12,right:12,background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:18}}>{I.x}</button>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a",marginBottom:16}}>Privacy Policy</h2>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#475569",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{PRIVACY_TEXT.trim()}</div>
        </div>
      </div>}

      {/* Contact Modal */}
      {showContact&&<div style={{position:"fixed",inset:0,zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)"}} onClick={()=>setShowContact(false)}>
        <div onClick={e=>e.stopPropagation()} style={{...S.card,maxWidth:440,width:"90%",position:"relative"}}>
          <button onClick={()=>setShowContact(false)} style={{position:"absolute",top:12,right:12,background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:18}}>{I.x}</button>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a",marginBottom:6}}>Send us a message</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",marginBottom:20}}>We typically respond within a few hours.</p>
          {contactSent?<div style={{textAlign:"center",padding:"30px 0"}}><span style={{fontSize:40,display:"block",marginBottom:12}}>✓</span><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:600,color:"#059669"}}>Message sent! We will get back to you soon.</p></div>:(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><label style={S.lbl}>Your Name</label><input value={contactMsg.name} onChange={e=>setContactMsg(p=>({...p,name:e.target.value}))} placeholder="John Smith" style={S.inp}/></div>
              <div><label style={S.lbl}>Your Email</label><input type="email" value={contactMsg.email} onChange={e=>setContactMsg(p=>({...p,email:e.target.value}))} placeholder="you@email.com" style={S.inp}/></div>
              <div><label style={S.lbl}>Message</label><textarea value={contactMsg.msg} onChange={e=>setContactMsg(p=>({...p,msg:e.target.value}))} placeholder="How can we help?" rows={4} style={{...S.inp,resize:"vertical",minHeight:100}}/></div>
              <button onClick={()=>{if(contactMsg.name&&contactMsg.email&&contactMsg.msg){fetch("https://formspree.io/f/mzdjddjj",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"contact",name:contactMsg.name,email:contactMsg.email,message:contactMsg.msg})}).catch(()=>{});setContactSent(true);}}} disabled={!contactMsg.name||!contactMsg.email||!contactMsg.msg} style={{...S.btn,justifyContent:"center",opacity:contactMsg.name&&contactMsg.email&&contactMsg.msg?1:0.4}}>Send Message</button>
            </div>
          )}
        </div>
      </div>}

      {/* Terms of Service Modal */}
      {showTerms&&<div style={{position:"fixed",inset:0,zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)"}} onClick={()=>setShowTerms(false)}>
        <div onClick={e=>e.stopPropagation()} style={{...S.card,maxWidth:600,width:"90%",maxHeight:"80vh",overflow:"auto",position:"relative"}}>
          <button onClick={()=>setShowTerms(false)} style={{position:"absolute",top:12,right:12,background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:18}}>{I.x}</button>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:"#0f172a",marginBottom:16}}>Terms of Service</h2>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#475569",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{TERMS_TEXT.trim()}</div>
        </div>
      </div>}
    </div>
  );
}
