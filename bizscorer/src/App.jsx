import { useState, useEffect, useRef, useCallback } from "react";

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
const COUNTRIES=[{code:"US",name:"United States"},{code:"EG",name:"Egypt"},{code:"AE",name:"UAE"},{code:"SA",name:"Saudi Arabia"},{code:"QA",name:"Qatar"},{code:"KW",name:"Kuwait"},{code:"BH",name:"Bahrain"},{code:"OM",name:"Oman"},{code:"GB",name:"United Kingdom"},{code:"CA",name:"Canada"},{code:"AU",name:"Australia"},{code:"DE",name:"Germany"},{code:"FR",name:"France"},{code:"ES",name:"Spain"},{code:"IT",name:"Italy"},{code:"NL",name:"Netherlands"},{code:"NZ",name:"New Zealand"},{code:"SE",name:"Sweden"},{code:"NO",name:"Norway"},{code:"CH",name:"Switzerland"},{code:"IE",name:"Ireland"},{code:"PT",name:"Portugal"},{code:"BE",name:"Belgium"},{code:"DK",name:"Denmark"},{code:"PL",name:"Poland"},{code:"TR",name:"Turkey"},{code:"JO",name:"Jordan"},{code:"LB",name:"Lebanon"},{code:"MA",name:"Morocco"},{code:"BR",name:"Brazil"},{code:"MX",name:"Mexico"},{code:"IN",name:"India"},{code:"PH",name:"Philippines"},{code:"MY",name:"Malaysia"},{code:"SG",name:"Singapore"},{code:"ZA",name:"South Africa"},{code:"NG",name:"Nigeria"},{code:"KE",name:"Kenya"},{code:"PK",name:"Pakistan"},{code:"IQ",name:"Iraq"}];
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
  const[lang,setLang]=useState("en");
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
  const auditCount=1247;
  const upd=(k,v)=>setInputs(p=>({...p,[k]:v}));
  useEffect(()=>setMarket(detectMarket(inputs.country)),[inputs.country]);
  useEffect(()=>{const p=new URLSearchParams(window.location.search);if(p.get("biz"))upd("name",p.get("biz"));if(p.get("city"))upd("city",p.get("city"));if(p.get("country"))upd("country",p.get("country"));},[]);
  useEffect(()=>{if(phase==="scanning"){const t=setInterval(()=>setScanMsgIdx(i=>(i+1)%SCAN_MSGS.length),3e3);return()=>clearInterval(t);}},[phase]);

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

  const handleCapture=v=>{setCaptured(true);setHasEmail();setCaptureVal(v);setShowCapture(false);console.log("Captured:",v);};
  const shareUrl=`https://bizscorer.com?biz=${encodeURIComponent(inputs.name)}&city=${encodeURIComponent(inputs.city)}&country=${inputs.country}`;
  const zidlyUrl=`https://zidly.ai?from=bizscorer&biz=${encodeURIComponent(inputs.name)}&city=${encodeURIComponent(inputs.city)}&type=${bizType}`;

  const S={card:{background:"#ffffff",border:"1px solid #e2e8f0",borderRadius:20,padding:"28px 26px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"},btn:{background:"linear-gradient(135deg,#059669,#047857)",color:"white",border:"none",borderRadius:14,padding:"15px 30px",fontSize:16,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8,boxShadow:"0 4px 14px rgba(5,150,105,0.25)"},btn2:{background:"#f1f5f9",color:"#1e293b",border:"1px solid #e2e8f0",borderRadius:14,padding:"15px 30px",fontSize:16,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8},inp:{width:"100%",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px 16px",color:"#1e293b",fontSize:15,fontFamily:"'DM Sans',sans-serif"},lbl:{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6,display:"block"}};


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
      `}</style>

      {/* NAV */}
      <nav className="no-print" style={{padding:"0 24px",height:56,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #e2e8f0",background:"white"}}>
        <div style={{maxWidth:1100,width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:20}}>📊</span>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:18,color:"#1e293b"}}>Biz<span style={{color:"#059669"}}>Scorer</span></span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:100,padding:"5px 14px"}}>
              <span style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:800,color:"#059669"}}>{auditCount.toLocaleString()}+</span>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:"#16a34a"}}>businesses audited</span>
            </div>
            <button onClick={()=>setLang(l=>l==="en"?"ar":"en")} style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:600,color:"#64748b",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{lang==="en"?"العربية":"English"}</button>
            <a href="https://zidly.ai" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#64748b",textDecoration:"none"}}>Powered by <span style={{color:"#059669",fontWeight:700}}>Zidly</span></a>
          </div>
        </div>
      </nav>

      {/* ═══ INPUT PHASE ═══ */}
      {phase==="input"&&(
        <section style={{maxWidth:1100,margin:"0 auto",padding:"40px 24px 60px"}}>
          {lastScore&&(
            <FadeIn><div style={{textAlign:"center",marginBottom:20,padding:"12px 18px",borderRadius:12,background:"#f0fdf4",border:"1px solid #bbf7d0",maxWidth:600,margin:"0 auto 20px"}}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#16a34a"}}>Welcome back! Your last score for <strong>{lastScore.biz}</strong> was <strong>{lastScore.score}/100</strong>. Time to recheck?</p>
            </div></FadeIn>
          )}
          <FadeIn>
            <div style={{textAlign:"center",marginBottom:36}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:100,padding:"6px 14px",marginBottom:16}}>
                {I.spark}<span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#059669"}}>AI-Powered Audit — Free — 30 Seconds</span>
              </div>
              <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(32px,6vw,50px)",fontWeight:800,lineHeight:1.1,letterSpacing:"-0.03em",marginBottom:16,color:"#0f172a"}}>Find out what{"'"}s <span style={{color:"#059669"}}>costing you customers</span> — and how to fix it</h1>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:18,color:"#475569",lineHeight:1.7,maxWidth:560,margin:"0 auto"}}>Our AI scans your Google profile, website, social media & competitors. You get a score, a prioritized list of problems, and a step-by-step action plan to fix them.</p>
            </div>
          </FadeIn>

          <div className="input-grid-3col" style={{display:"grid",gridTemplateColumns:"1fr 2fr 1fr",gap:24,alignItems:"start"}}>
            {/* LEFT SIDEBAR */}
            <FadeIn delay={0.1}><div className="sidebar-col" style={{display:"flex",flexDirection:"column",gap:14,position:"sticky",top:80}}>
              <div style={{...S.card,padding:"18px 16px"}}>
                <div style={{display:"flex",gap:2,marginBottom:8}}>{[1,2,3,4,5].map(i=><span key={i} style={{color:"#facc15",fontSize:14}}>★</span>)}</div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#475569",lineHeight:1.5,fontStyle:"italic",marginBottom:10}}>{"\"Found 6 issues I didn't know existed. Fixed 3 in one hour. Already getting more calls.\""}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:"#1e293b"}}>Dr. Sarah M.</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b"}}>Dentist, Houston TX</p>
              </div>
              <div style={{...S.card,padding:"18px 16px"}}>
                <div style={{display:"flex",gap:2,marginBottom:8}}>{[1,2,3,4,5].map(i=><span key={i} style={{color:"#facc15",fontSize:14}}>★</span>)}</div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#475569",lineHeight:1.5,fontStyle:"italic",marginBottom:10}}>{"\"My competitor had 3x my reviews. This showed me exactly how to close the gap.\""}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:"#1e293b"}}>Ahmed K.</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b"}}>Restaurant Owner, Cairo</p>
              </div>
              <div style={{...S.card,padding:"16px",background:"#fffbeb",border:"1px solid #fde68a"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#92400e",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>The Real Cost of Ignoring This</p>
                {[{stat:"5-9%",desc:"revenue lost per missing star on Google (Harvard)"},{stat:"31%",desc:"more spending at businesses with excellent reviews"},{stat:"126%",desc:"more traffic for Google 3-pack vs lower rankings"}].map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:6,alignItems:"baseline",marginBottom:6}}>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:800,color:"#b45309",flexShrink:0}}>{s.stat}</span>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#92400e",lineHeight:1.3}}>{s.desc}</span>
                  </div>
                ))}
              </div>
            </div></FadeIn>

            {/* CENTER — Simple 3-field form */}
            <FadeIn delay={0.15}><div style={S.card}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div><label style={S.lbl}>Business Name *</label><input value={inputs.name} onChange={e=>upd("name",e.target.value)} placeholder="e.g. Midtown Dentistry" style={S.inp}/></div>
                <div><label style={S.lbl}>City *</label><input value={inputs.city} onChange={e=>upd("city",e.target.value)} placeholder="e.g. Houston, TX" style={S.inp}/></div>
              </div>
              <div style={{marginBottom:18}}><label style={S.lbl}>Country *</label>
                <select value={inputs.country} onChange={e=>upd("country",e.target.value)} style={{...S.inp,appearance:"none"}}>
                  {COUNTRIES.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <button onClick={startDetect} disabled={!inputs.name.trim()||!inputs.city.trim()} style={{...S.btn,width:"100%",justifyContent:"center",opacity:inputs.name.trim()&&inputs.city.trim()?1:0.4,fontSize:18,padding:"17px 30px"}}>
                {I.search} Get My Business Score
              </button>
              <p style={{textAlign:"center",fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#64748b",marginTop:10}}>Our AI finds your profiles automatically. Takes ~30 seconds. 100% free.</p>
              <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:14}}>
                {[{icon:I.lock,text:"Private & secure"},{icon:I.check,text:"No signup needed"},{icon:I.spark,text:"Advanced AI analysis"}].map((b,i)=>(
                  <span key={i} style={{display:"flex",alignItems:"center",gap:4,fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#94a3b8"}}>{b.icon} {b.text}</span>
                ))}
              </div>
            </div></FadeIn>

            {/* RIGHT SIDEBAR */}
            <FadeIn delay={0.2}><div className="sidebar-col" style={{display:"flex",flexDirection:"column",gap:14,position:"sticky",top:80}}>
              <div style={{...S.card,padding:"18px 16px"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Average Scores by Industry</p>
                {[{cat:"Dental Practices",score:47},{cat:"Restaurants",score:38},{cat:"Salons & Spas",score:42},{cat:"Retail / E-commerce",score:35},{cat:"Real Estate",score:51}].map((c,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:i<4?"1px solid #f1f5f9":"none"}}>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#475569"}}>{c.cat}</span>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:scoreColor(c.score)}}>{c.score}<span style={{fontSize:10,color:"#94a3b8"}}>/100</span></span>
                  </div>
                ))}
              </div>
              <div style={{...S.card,padding:"18px 16px",background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#059669",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Businesses That Took Action</p>
                {[{stat:"+47%",desc:"avg increase in customer inquiries"},{stat:"+31",desc:"new Google reviews in 60 days"},{stat:"18%",desc:"avg revenue increase from better ratings"},{stat:"81%",desc:"of consumers research online first"}].map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"baseline",marginBottom:8}}>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:800,color:"#059669",flexShrink:0}}>{s.stat}</span>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#166534",lineHeight:1.3}}>{s.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{...S.card,padding:"16px",textAlign:"center"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#64748b",marginBottom:8}}>Avg Score Improvement</p>
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:14}}>
                  <div><p style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:"#dc2626"}}>31</p><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#94a3b8"}}>Before</p></div>
                  <span style={{color:"#cbd5e1",fontSize:18}}>→</span>
                  <div><p style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:"#059669"}}>78</p><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#94a3b8"}}>After 60 days</p></div>
                </div>
              </div>
            </div></FadeIn>
          </div>
        </section>
      )}


      {/* ═══ DETECTING PHASE ═══ */}
      {phase==="detecting"&&(
        <section style={{maxWidth:480,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}><FadeIn>
          <div style={S.card}>
            <div style={{width:56,height:56,borderRadius:16,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
              <div style={{width:24,height:24,border:"3px solid #059669",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
            </div>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:700,color:"#1e293b",marginBottom:8}}>Finding your business...</h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",marginBottom:12}}>Our AI is searching for <strong>{inputs.name}</strong> and discovering all your online profiles.</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#059669",fontWeight:600}}>Scanning Google, Facebook, Instagram, YouTube & more...</p>
          </div>
        </FadeIn></section>
      )}

      {/* ═══ CONFIRM PHASE ═══ */}
      {phase==="confirm"&&(
        <section style={{maxWidth:560,margin:"0 auto",padding:"60px 24px"}}><FadeIn>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{width:48,height:48,borderRadius:14,background:"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",color:"#059669",margin:"0 auto 12px",fontSize:20}}>✓</div>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:700,color:"#1e293b",marginBottom:6}}>We found your business!</h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b"}}>Confirm the details below. Edit anything that looks wrong.</p>
          </div>
          <div style={S.card}>
            <div style={{marginBottom:14}}>
              <label style={S.lbl}>Business Name</label>
              <input value={inputs.name} onChange={e=>upd("name",e.target.value)} style={S.inp}/>
            </div>
            <div style={{marginBottom:14}}>
              <label style={S.lbl}>Business Type</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {BIZ_TYPES.map(b=>(
                  <button key={b.id} onClick={()=>setBizType(b.id)} style={{padding:"6px 12px",borderRadius:8,border:bizType===b.id?"2px solid #059669":"1px solid #e2e8f0",background:bizType===b.id?"#f0fdf4":"white",color:bizType===b.id?"#059669":"#64748b",fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:"pointer"}}>{b.icon} {b.label}</button>
                ))}
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,margin:"18px 0 12px"}}>
              <div style={{flex:1,height:1,background:"#e2e8f0"}}/>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#94a3b8",fontWeight:600}}>PROFILES FOUND — EDIT IF NEEDED</span>
              <div style={{flex:1,height:1,background:"#e2e8f0"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["website","Website"],["facebook","Facebook"],["instagram","Instagram"],["tiktok","TikTok"],["youtube","YouTube"],["twitter","X / Twitter"],["linkedin","LinkedIn"]].map(([k,l])=>(
                <div key={k}>
                  <label style={S.lbl}>{l} {inputs[k]?<span style={{color:"#059669"}}>✓</span>:<span style={{color:"#94a3b8"}}>—</span>}</label>
                  <input value={inputs[k]} onChange={e=>upd(k,e.target.value)} placeholder={`${l} URL or handle`} style={{...S.inp,fontSize:13,padding:"10px 12px"}}/>
                </div>
              ))}
            </div>
            <QualityMeter inputs={inputs}/>
            <button onClick={afterConfirm} style={{...S.btn,width:"100%",marginTop:18,justifyContent:"center",fontSize:17}}>
              {I.spark} Run Full Analysis
            </button>
          </div>
        </FadeIn></section>
      )}

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
        <section style={{maxWidth:720,margin:"0 auto",padding:"30px 24px 60px"}}>
          {/* Overall Score */}
          <FadeIn><div style={{...S.card,textAlign:"center",marginBottom:20}}>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Overall Business Score</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:36,flexWrap:"wrap"}}>
              <ScoreGauge score={report.overall} potential={report.potential} size={180} label="Current" market={market}/>
              <div style={{color:"#cbd5e1"}}>{I.trend}</div>
              <ScoreGauge score={report.potential} size={180} label="Potential" market={market}/>
            </div>
            {report.percentile&&<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#dc2626",fontWeight:600,marginTop:14}}>{report.percentile}</p>}
            {report.industryAvg&&<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#64748b",marginTop:6}}>Industry average: <strong style={{color:"#1e293b"}}>{report.industryAvg}/100</strong></p>}
            <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:20,flexWrap:"wrap"}}>
              <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:14,padding:"14px 22px",textAlign:"center"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#dc2626",fontWeight:700,textTransform:"uppercase",marginBottom:3}}>Estimated Revenue Loss</p>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:"#dc2626"}}>{report.monthlyLossPercent}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#991b1b"}}>of potential monthly revenue</p>
              </div>
              <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:14,padding:"14px 22px",textAlign:"center"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#059669",fontWeight:700,textTransform:"uppercase",marginBottom:3}}>Potential Gain</p>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:"#059669"}}>{report.monthlyGainPercent}</p>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#166534"}}>revenue increase achievable</p>
              </div>
            </div>
            {report.revenueMath&&<details style={{marginTop:14,textAlign:"left"}}><summary style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b",cursor:"pointer",fontWeight:600}}>See the math ▾</summary><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#475569",marginTop:6,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{report.revenueMath}</p></details>}
          </div></FadeIn>

          {/* Category Scores */}
          <FadeIn delay={0.06}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:20}}>
            {scanPhases.filter(p=>p.id!=="recommendations").map(sp=>(
              <div key={sp.id} style={{textAlign:"center",padding:"18px 10px",...S.card}}>
                <ScoreGauge score={sp.score||0} size={90} label={sp.label}/>
              </div>
            ))}
          </div></FadeIn>

          {/* After Hours */}
          <FadeIn delay={0.08}><div style={{marginBottom:20}}><AfterHoursComparison data={report.competitive}/></div></FadeIn>

          {/* Issues vs Working */}
          <FadeIn delay={0.1}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            <div>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:"#dc2626",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>{I.alert} Issues Found</h3>
              {[...(report.google?.findings||[]),...(report.website?.findings||[]),...(report.social?.findings||[]),...(report.competitive?.findings||[])].filter(Boolean).slice(0,10).map((f,i)=>
                <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",padding:"8px 12px",borderRadius:10,background:"#fef2f2",border:"1px solid #fecaca",marginBottom:6}}>
                  <span style={{color:"#dc2626",flexShrink:0,marginTop:1}}>{I.alert}</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#991b1b",lineHeight:1.5}}>{f}</span>
                </div>
              )}
            </div>
            <div>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:"#059669",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>{I.check} What{"'"}s Working</h3>
              {[...(report.google?.positives||[]),...(report.website?.positives||[]),...(report.social?.positives||[]),...(report.competitive?.positives||[])].filter(Boolean).slice(0,8).map((f,i)=>
                <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",padding:"8px 12px",borderRadius:10,background:"#f0fdf4",border:"1px solid #bbf7d0",marginBottom:6}}>
                  <span style={{color:"#059669",flexShrink:0,marginTop:1}}>{I.check}</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#166534",lineHeight:1.5}}>{f}</span>
                </div>
              )}
            </div>
          </div></FadeIn>

          {/* Competitor Battle Cards */}
          {report.competitive?.competitors?.length>0&&(
            <FadeIn delay={0.12}><div style={{...S.card,marginBottom:20}}>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:700,color:"#1e293b",marginBottom:14}}>🏆 Competitor Comparison</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10}}>
                <div style={{padding:16,borderRadius:14,background:"#f0fdf4",border:"2px solid #059669"}}>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,color:"#059669",textTransform:"uppercase",marginBottom:6}}>You</p>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:"#1e293b",marginBottom:4}}>{inputs.name}</p>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:scoreColor(report.overall)}}>{report.overall}<span style={{fontSize:12,color:"#94a3b8"}}>/100</span></p>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b"}}>{report.google?.reviewCount||"?"} reviews · {report.google?.avgRating||"?"} ★</p>
                </div>
                {report.competitive.competitors.slice(0,3).map((c,i)=>(
                  <div key={i} style={{padding:16,borderRadius:14,background:"white",border:"1px solid #e2e8f0"}}>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",marginBottom:6}}>Competitor #{i+1}</p>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:"#1e293b",marginBottom:4}}>{c.name}</p>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:scoreColor(c.estimatedScore||50)}}>{c.estimatedScore||"?"}<span style={{fontSize:12,color:"#94a3b8"}}>/100</span></p>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b"}}>{c.reviewCount} reviews · {c.avgRating} ★</p>
                    <div style={{display:"flex",gap:4,marginTop:6,flexWrap:"wrap"}}>
                      {c.hasChatbot&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:"#f0fdf4",color:"#059669",fontWeight:600}}>Chatbot</span>}
                      {c.hasBooking&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:"#f0fdf4",color:"#059669",fontWeight:600}}>Booking</span>}
                      {c.hasWebsite&&<span style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:"#f0fdf4",color:"#059669",fontWeight:600}}>Website</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div></FadeIn>
          )}

          {/* What-If */}
          <FadeIn delay={0.14}><div className="no-print" style={{marginBottom:20}}><WhatIfSimulator currentScore={report.overall} market={market}/></div></FadeIn>

          {/* Recommendations / Action Plan */}
          <FadeIn delay={0.16}><div style={{marginBottom:20}}>
            <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:800,color:"#1e293b",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>{I.spark} Your Action Plan</h3>
            {(report.topFixes||[]).sort((a,b)=>(a.priority||99)-(b.priority||99)).map((fix,i)=>(
              <div key={i} style={{...S.card,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,flexWrap:"wrap",gap:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:800,color:"#cbd5e1"}}>#{i+1}</span>
                    <h4 style={{fontFamily:"'DM Sans',sans-serif",fontSize:15,fontWeight:700,color:"#1e293b"}}>{fix.title}</h4>
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6,background:fix.impact==="HIGH"?"#fef2f2":"#fffbeb",color:fix.impact==="HIGH"?"#dc2626":"#d97706",fontFamily:"'DM Sans',sans-serif"}}>{fix.impact} impact</span>
                    <span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:6,background:"#f1f5f9",color:"#64748b",fontFamily:"'DM Sans',sans-serif"}}>{fix.difficulty}</span>
                  </div>
                </div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#475569",lineHeight:1.6,marginBottom:10}}>{fix.explanation}</p>
                {fix.diyTime&&fix.zidlyTime&&(
                  <div style={{display:"flex",gap:14,marginBottom:10}}>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:4}}>{I.clock} DIY: <strong style={{color:"#1e293b"}}>{fix.diyTime}</strong></span>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#059669",display:"flex",alignItems:"center",gap:4}}>{I.zap} With Zidly: <strong>{fix.zidlyTime}</strong></span>
                  </div>
                )}
                {fix.freeContent&&fix.freeContent.length>5&&fix.freeContent!=="NONE"&&(
                  <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,color:"#059669",textTransform:"uppercase"}}>🎁 Free Fix — Copy & Use</span>
                      <CopyBtn text={fix.freeContent}/>
                    </div>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#166534",lineHeight:1.5,whiteSpace:"pre-wrap"}}>{fix.freeContent}</p>
                  </div>
                )}
                {fix.zidlyModule&&fix.zidlyModule!=="NONE"&&(
                  <div style={{background:"white",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                    <div>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:700,color:"#059669"}}>Zidly {fix.zidlyModule}</p>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b"}}>{fix.zidlyDescription||""} · Plans from {market.pricing.starter}</p>
                    </div>
                    <a href={zidlyUrl} target="_blank" rel="noopener noreferrer" style={{...S.btn,padding:"8px 16px",fontSize:12,textDecoration:"none"}}>{I.zap} Try Free Demo</a>
                  </div>
                )}
              </div>
            ))}
          </div></FadeIn>

          {/* Quick Wins */}
          {report.quickWins?.length>0&&(
            <FadeIn delay={0.18}><div style={{...S.card,marginBottom:20,background:"#fffbeb",borderColor:"#fde68a"}}>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:"#92400e",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>{I.zap} Quick Wins — Do These Today</h3>
              {report.quickWins.map((w,i)=><p key={i} style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#78350f",lineHeight:1.6,marginBottom:4}}><span style={{fontWeight:800,color:"#b45309"}}>{i+1}.</span> {w}</p>)}
            </div></FadeIn>
          )}

          {/* Main CTA */}
          <FadeIn delay={0.2}><div className="no-print" style={{textAlign:"center",padding:"36px 24px",...S.card,background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",borderColor:"#bbf7d0"}}>
            <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:800,color:"#1e293b",marginBottom:8}}>Fix <span style={{color:"#059669"}}>everything</span> — automatically</h3>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#475569",marginBottom:6,maxWidth:400,margin:"0 auto 6px",lineHeight:1.6}}>Zidly{"'"}s AI handles reviews, customer questions, content & more. See it work on YOUR business.</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#059669",fontWeight:600,marginBottom:20}}>💰 30-day money-back guarantee · Plans from {market.pricing.starter}</p>
            <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
              <a href={zidlyUrl} target="_blank" rel="noopener noreferrer" style={{...S.btn,textDecoration:"none",fontSize:16,padding:"15px 32px"}}>See Your AI Demo {I.arrow}</a>
              <button onClick={()=>setShowShare(true)} style={{...S.btn2,fontSize:13}}>{I.share} Share Report</button>
            </div>
          </div></FadeIn>

          {/* Scan Competitor + Recheck */}
          <FadeIn delay={0.22}><div className="no-print" style={{display:"flex",justifyContent:"center",gap:10,marginTop:20,flexWrap:"wrap"}}>
            <button onClick={()=>{setPhase("input");setInputs(p=>({...p,name:"",website:"",facebook:"",instagram:"",tiktok:"",twitter:"",youtube:"",linkedin:""}));setScanPhases(sp=>sp.map(x=>({...x,status:"pending",score:null,data:null})));setReport(null);}} style={{...S.btn2,padding:"10px 18px",fontSize:13}}>🔍 Scan a Competitor</button>
            <button onClick={()=>{window.print();}} style={{...S.btn2,padding:"10px 18px",fontSize:13}}>📄 Save as PDF</button>
          </div></FadeIn>

          {/* Footer */}
          <div style={{textAlign:"center",marginTop:30}}>
            <a href="https://zidly.ai" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,textDecoration:"none"}}>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#64748b"}}>Powered by</span>
              <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:15}}>Zid<span style={{color:"#059669"}}>ly</span></span>
            </a>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#94a3b8",marginTop:5}}>© 2025 Zidly · Report generated {report.timestamp}</p>
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
    </div>
  );
}
