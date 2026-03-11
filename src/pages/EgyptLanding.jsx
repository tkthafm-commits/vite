import { useState, useEffect, useRef } from "react";
import useSEO from "../useSEO.js";

const T = "#0D9488", TD = "#0A7A70", TL = "#14B8A6";

const PROBLEMS = [
  { icon: "📱", title: "رسايل الواتساب بتضيع", desc: "مريض بعتلك الساعة ١١ بالليل عايز يحجز. محدش رد. راح لدكتور تاني. خسرت مريض — ومعرفتش اصلا." },
  { icon: "🕐", title: "المواعيد بتطير", desc: "المريض حجز ونسي ييجي. مفيش تذكير. الكرسي فاضي. المعاد راح وفلوسه راحت معاه." },
  { icon: "⭐", title: "محدش بيسيب تقييم", desc: "عندك مرضى مبسوطين بس محدش فيهم فاكر يكتب ريفيو على جوجل. والدكتور اللي جنبك عنده ١٥٠ تقييم وبياخد مرضاك." },
  { icon: "🔄", title: "نفس الأسئلة كل يوم", desc: '"العيادة فين؟" "بتفتحوا امتى؟" "الكشف بكام؟" — نفس الأسئلة ١٠٠ مرة في اليوم. والريسبشن مش فاضية ترد على كلهم.' },
  { icon: "📞", title: "مكالمات بتتفوّت", desc: "حد اتصل وانت في كشف. مردتش. مرجعش تاني. مريض ضاع للأبد ومعرفتش عنه حاجة." },
  { icon: "📊", title: "مفيش نظام", desc: "بيانات المرضى في ورق، في الموبايل، في دماغ الريسبشن. لو الريسبشن مشيت — كل حاجة راحت." },
];

const FEATURES = [
  { icon: "🤖", title: "رد اوتوماتيك على الواتساب ٢٤ ساعة", desc: "الذكاء الاصطناعي بيرد على كل رسالة بالعربي والانجليزي. الساعة ٣ الصبح حد سأل؟ بيلاقي رد فوري." },
  { icon: "📅", title: "حجز مواعيد من الواتساب", desc: "المريض يحجز لوحده من غير ما يستنى حد. يختار الخدمة، اليوم، الساعة — وخلاص. تأكيد فوري." },
  { icon: "⏰", title: "تذكير قبل المعاد", desc: "رسالة قبل المعاد بيوم وقبله بساعة. المريض مابينساش. المواعيد اللي بتضيع بتقل ٣٠-٧٠٪." },
  { icon: "⭐", title: "تقييمات جوجل اوتوماتيك", desc: "بعد الزيارة المريض بيجيله رسالة. اللي مبسوط بيروح جوجل يكتب ريفيو. اللي مش مبسوط بيكلمك انت بس." },
  { icon: "📞", title: "رسالة لأي مكالمة فايتة", desc: 'حد اتصل ومحدش رد؟ بتروحله رسالة فورية: "معلش مردناش، تحب نساعدك ازاي؟" — المريض مابيضيعش.' },
  { icon: "💬", title: "فيسبوك وانستجرام في نفس المكان", desc: "رسايل الواتساب والفيسبوك والانستجرام والايميل — كلها في شاشة واحدة. مفيش حاجة بتوقع منك." },
  { icon: "👥", title: "كل مريض محفوظ في سيستم", desc: "اسمه، رقمه، تاريخ زياراته، كل الرسايل. لو الريسبشن اتغيّرت — كل حاجة موجودة." },
  { icon: "📢", title: "رسايل تسويقية لكل عملاءك", desc: "عرض رمضان؟ خصم على التنظيف؟ ابعت رسالة لكل مرضاك القدام مرة واحدة." },
  { icon: "📊", title: "تقرير يومي بكل حاجة", desc: "كام رسالة جت، كام حجز، كام تقييم، كام مكالمة فايتة — كله قدامك في لحظة." },
  { icon: "🔁", title: "متابعة اوتوماتيك", desc: 'حد سأل ومحجزش؟ بتروحله رسالة. مريض قديم من ٦ شهور؟ بتروحله "وحشتنا". كل حاجة اوتوماتيك.' },
  { icon: "🔗", title: "صفحة حجز اونلاين", desc: "لينك واحد تحطه في البايو بتاعك أو تبعته لأي حد. المريض يحجز لوحده من الموبايل في ثواني." },
  { icon: "💳", title: "فواتير ولينكات دفع", desc: "تعمل فاتورة وتبعتها للمريض. يدفع بالكارت أو المحفظة. ومتلزمش تفكر فيها تاني." },
];

const STEPS = [
  { num: "١", title: "بنوصّل الواتساب بتاعك", desc: "بتسكان QR code من تليفونك وخلاص. الواتساب بتاعك بيفضل شغال عادي عندك على الموبايل — ومعاه السيستم بيشتغل في الخلفية." },
  { num: "٢", title: "بنظبط كل حاجة عن عيادتك", desc: "بندخّل خدماتك، مواعيدك، أسعارك، الأسئلة اللي بتتسأل كل يوم. السيستم بيتعلم كل حاجة عن عيادتك ويرد بيها." },
  { num: "٣", title: "نفتح السيستم وأنت ترتاح", desc: "من أول يوم — الرسايل بترد لوحدها، المواعيد بتتحجز، التذكيرات بتتبعت، والتقييمات بتيجي. وأنت بتكشف على مرضاك." },
];

const PLANS = [
  {
    name: "ستارتر", price: "٢,٩٩٩", pop: false, btn: "ابدأ دلوقتي", btnStyle: "outline",
    features: [
      { text: "رد اوتوماتيك على الواتساب ٢٤/٧", on: true },
      { text: "حجز مواعيد من الواتساب", on: true },
      { text: "تذكيرات قبل المواعيد", on: true },
      { text: "تقييمات جوجل اوتوماتيك", on: true },
      { text: "سيستم لحفظ بيانات المرضى", on: true },
      { text: "رسالة المكالمة الفايتة", on: false },
      { text: "ايميلات ومتابعة اوتوماتيك", on: false },
      { text: "تقارير يومية", on: false },
    ],
  },
  {
    name: "بروفيشنال", price: "٤,٩٩٩", pop: true, btn: "ابدأ دلوقتي", btnStyle: "primary",
    features: [
      { text: "كل حاجة في ستارتر", on: true },
      { text: "رسالة المكالمة الفايتة", on: true },
      { text: "واتساب + فيسبوك + انستجرام في شاشة واحدة", on: true },
      { text: "ايميلات ومتابعة اوتوماتيك", on: true },
      { text: "رسايل تسويقية لكل العملاء", on: true },
      { text: "تتبع العملاء من أول سؤال لآخر زيارة", on: true },
      { text: "تقارير يومية بكل حاجة", on: true },
      { text: "صفحة حجز اونلاين", on: true },
    ],
  },
  {
    name: "إيليت", price: "٨,٩٩٩", pop: false, btn: "كلمنا", btnStyle: "outline",
    features: [
      { text: "كل حاجة في بروفيشنال", on: true },
      { text: "بوستات سوشيال ميديا جاهزة كل شهر", on: true },
      { text: "تحليل المنافسين", on: true },
      { text: "مكالمة استراتيجية شهرية", on: true },
      { text: "دعم فني أولوية", on: true },
      { text: "أكتر من فرع (مالتي لوكيشن)", on: true },
      { text: "فواتير ولينكات دفع", on: true },
      { text: "تدريب الفريق على السيستم", on: true },
    ],
  },
];

const REVIEWS = [
  { text: "كنت بخسر ٥-١٠ مرضى كل اسبوع بسبب ان محدش بيرد على الواتساب بالليل. دلوقتي كل رسالة بترد لوحدها والحجوزات زادت ٤٠٪ في أول شهر.", author: "د. أحمد — عيادة أسنان", loc: "التجمع الخامس" },
  { text: "كان عندي ١٢ تقييم على جوجل في سنتين. بعد ٣ شهور مع Zidly بقى عندي ٦٧. المرضى الجداد بيقولولي 'لقيناك على جوجل.' الفرق واضح.", author: "د. سارة — عيادة جلدية", loc: "القاهرة الجديدة" },
  { text: "الريسبشن كانت بتقعد ٣ ساعات في اليوم ترد على نفس الأسئلة. دلوقتي السيستم بيرد على ٨٠٪ من الرسايل والريسبشن بتعمل حاجات أهم.", author: "د. محمد — عيادة عيون", loc: "مدينة نصر" },
];

const FAQS = [
  { q: "هل لازم أغيّر رقم الواتساب بتاعي؟", a: "لا خالص. بتفضل تستخدم نفس الرقم ونفس الواتساب بتاعك عادي على تليفونك. السيستم بيشتغل في الخلفية من غير ما يأثر على حاجة." },
  { q: "لو عايز أرد بنفسي على مريض معين؟", a: "في أي وقت تقدر ترد من تليفونك عادي. لما ترد انت، السيستم بيفهم ان انت بتتكلم وبيسيبك. ممكن كمان تقفل البوت لمحادثة معينة." },
  { q: "محتاج أعرف تكنولوجيا؟", a: "ولا حاجة. احنا بنظبط كل حاجة. انت بس بتقولنا خدماتك ومواعيدك وأسعارك — واحنا بنعمل الباقي. لو حاجة محتاجة تتغيّر بتكلمنا وبنغيرهالك." },
  { q: "السيستم بيرد بالعربي ولا بالانجليزي؟", a: "الاتنين. لو المريض كتب عربي بيرد عربي. لو كتب انجليزي بيرد انجليزي. بيفهم لوحده." },
  { q: "لو مش عاجبني بعد ما اشترك؟", a: "عندك ١٤ يوم تجربة. لو مش مبسوط — بترجع فلوسك كلها. ومفيش عقد سنوي. تقدر تلغي في أي وقت." },
  { q: "ايه الفرق بينكم وبين الشات بوتات التانية؟", a: "Zidly مش بس شات بوت. ده نظام كامل: رد اوتوماتيك + حجز مواعيد + تذكيرات + تقييمات جوجل + CRM لحفظ كل بيانات مرضاك + تقارير + تسويق. كل حاجة في مكان واحد." },
  { q: "بيشتغل مع الفيسبوك والانستجرام كمان؟", a: "اه. رسايل الواتساب والفيسبوك والانستجرام والايميل كلها بتيجي في مكان واحد. والسيستم بيرد على كلهم." },
];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeUp({ children, delay = 0, style = {} }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)", transition: `all 0.8s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

export default function EgyptLanding() {
  useSEO({
    title: "موظف ذكي لعيادتك بيشتغل ٢٤ ساعة",
    description: "Zidly بيرد على رسايل الواتساب والفيسبوك، بيحجز المواعيد، بيفكّر المرضى، وبيجمعلك تقييمات على جوجل — كل ده وانت نايم. باقات من ٢,٩٩٩ ج.م/شهريا.",
    canonical: "/eg",
  });

  const [openFaq, setOpenFaq] = useState(null);

  // Set RTL on mount, restore on unmount
  useEffect(() => {
    const prevDir = document.documentElement.dir;
    const prevLang = document.documentElement.lang;
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    return () => {
      document.documentElement.dir = prevDir || "";
      document.documentElement.lang = prevLang || "en";
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif", background: "#0F172A", color: "#fff", overflowX: "hidden", lineHeight: 1.7 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .eg-btn-p { display: inline-flex; align-items: center; gap: 10px; background: ${T}; color: #fff; padding: 16px 36px; border-radius: 14px; font-size: 18px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; font-family: 'Cairo', sans-serif; box-shadow: 0 4px 24px rgba(13,148,136,0.3); transition: all 0.3s; }
        .eg-btn-p:hover { background: ${TL}; transform: translateY(-3px); box-shadow: 0 8px 32px rgba(13,148,136,0.4); }
        .eg-btn-s { display: inline-flex; align-items: center; gap: 10px; background: transparent; color: #fff; padding: 16px 36px; border-radius: 14px; font-size: 18px; font-weight: 700; text-decoration: none; border: 2px solid #334155; font-family: 'Cairo', sans-serif; cursor: pointer; transition: all 0.3s; }
        .eg-btn-s:hover { border-color: ${T}; color: ${TL}; }
        @media (max-width: 768px) {
          .eg-nav-links { display: none !important; }
          .eg-g2 { grid-template-columns: 1fr !important; }
          .eg-g3 { grid-template-columns: 1fr !important; max-width: 400px !important; margin-left: auto !important; margin-right: auto !important; }
          .eg-hero-h1 { font-size: 32px !important; }
          .eg-stats { gap: 32px !important; }
          .eg-step { flex-direction: column !important; align-items: center !important; text-align: center !important; }
        }
      `}</style>

      {/* === NAV === */}
      <header>
        <nav aria-label="القائمة الرئيسية" style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(15,23,42,0.85)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)"
        }}>
          <a href="#" style={{ fontFamily: "'Cairo', sans-serif", fontWeight: 900, fontSize: 28, color: TL, letterSpacing: -1, textDecoration: "none" }}>
            Zidly<span style={{ color: "#fff" }}>.ai</span>
          </a>
          <div className="eg-nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {[
              { label: "المميزات", href: "#features" },
              { label: "ازاي بيشتغل", href: "#how" },
              { label: "الأسعار", href: "#pricing" },
              { label: "أسئلة شائعة", href: "#faq" },
            ].map(l => (
              <a key={l.label} href={l.href} style={{ color: "#CBD5E1", textDecoration: "none", fontSize: 15, fontWeight: 500, transition: "color 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.color = TL; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#CBD5E1"; }}
              >{l.label}</a>
            ))}
            <a href="#cta" style={{
              background: T, color: "#fff", padding: "10px 24px", borderRadius: 10,
              fontWeight: 700, textDecoration: "none", transition: "all 0.3s"
            }}>ابدأ دلوقتي</a>
          </div>
        </nav>
      </header>

      <main>
        {/* === HERO === */}
        <section style={{
          minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", textAlign: "center", padding: "140px 24px 80px",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -200, left: "50%", transform: "translateX(-50%)", width: 800, height: 800, background: "radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)", pointerEvents: "none" }} aria-hidden="true" />

          <FadeUp>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(13,148,136,0.12)", border: "1px solid rgba(13,148,136,0.25)",
              padding: "8px 20px", borderRadius: 100, fontSize: 14, color: TL, fontWeight: 600, marginBottom: 32
            }}>
              <span style={{ width: 8, height: 8, background: "#22C55E", borderRadius: "50%", animation: "blink 2s infinite" }} aria-hidden="true" />
              بنخدم عيادات في القاهرة الجديدة والتجمع
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className="eg-hero-h1" style={{
              fontFamily: "'Cairo', sans-serif", fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 900, lineHeight: 1.2, marginBottom: 24, maxWidth: 900
            }}>
              موظف ذكي لعيادتك<br />
              <span style={{
                background: `linear-gradient(135deg, ${TL}, ${T}, #06B6D4)`,
                backgroundSize: "200% auto", animation: "gradientMove 4s ease infinite",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>بيشتغل ٢٤ ساعة ومابيغيبش</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p style={{ fontSize: "clamp(18px, 2.5vw, 24px)", color: "#94A3B8", maxWidth: 650, marginBottom: 48, lineHeight: 1.8, fontWeight: 300 }}>
              بيرد على رسايل الواتساب والفيسبوك والانستجرام، بيحجز المواعيد، بيفكّر المرضى، وبيجمعلك تقييمات على جوجل — كل ده وانت نايم
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="#cta" className="eg-btn-p">جرّب الديمو دلوقتي ←</a>
              <a href="#how" className="eg-btn-s">ازاي بيشتغل؟</a>
            </div>
          </FadeUp>

          <FadeUp delay={0.4}>
            <div className="eg-stats" style={{ display: "flex", gap: 48, marginTop: 64, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { num: "٢٤/٧", label: "شغّال كل يوم، كل ثانية" },
                { num: "٣٠٪", label: "تقليل المواعيد اللي بتضيع" },
                { num: "٣x", label: "تقييمات جوجل أكتر" },
              ].map(s => (
                <div key={s.num} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 36, fontWeight: 900, color: TL }}>{s.num}</div>
                  <div style={{ fontSize: 14, color: "#94A3B8", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </section>

        {/* === PROBLEM === */}
        <section id="problem" style={{ padding: "100px 24px", background: "#0F172A" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <FadeUp>
              <div style={{ fontSize: 14, fontWeight: 700, color: TL, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>المشكلة</div>
              <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 20, lineHeight: 1.3 }}>
                عارف ايه اللي بيحصل كل يوم في عيادتك؟
              </h2>
              <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 600, lineHeight: 1.8 }}>مش انت بس — ده بيحصل في كل عيادة في مصر</p>
            </FadeUp>
            <div className="eg-g2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginTop: 48 }}>
              {PROBLEMS.map((p, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <article style={{
                    background: "#1E293B", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16, padding: 32, transition: "all 0.3s", cursor: "default"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#EF4444"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <span style={{ fontSize: 36, marginBottom: 16, display: "block" }} aria-hidden="true">{p.icon}</span>
                    <h3 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{p.title}</h3>
                    <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7 }}>{p.desc}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* === FEATURES === */}
        <section id="features" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <FadeUp>
              <div style={{ fontSize: 14, fontWeight: 700, color: TL, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>الحل</div>
              <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 20, lineHeight: 1.3 }}>
                كل ده بيتحل لوحده مع Zidly
              </h2>
              <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 600, lineHeight: 1.8 }}>
                نظام واحد بيعمل شغل ٣ موظفين — من غير مرتب ومن غير أجازات
              </p>
            </FadeUp>
            <div className="eg-g2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginTop: 48 }}>
              {FEATURES.map((f, i) => (
                <FadeUp key={i} delay={i * 0.04}>
                  <article style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16, padding: 28, transition: "all 0.4s", position: "relative", overflow: "hidden"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(13,148,136,0.3)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{
                      width: 48, height: 48, background: "rgba(13,148,136,0.12)",
                      borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, marginBottom: 16
                    }} aria-hidden="true">{f.icon}</div>
                    <h3 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                    <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.7 }}>{f.desc}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* === HOW IT WORKS === */}
        <section id="how" style={{ padding: "100px 24px", background: "#1E293B" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
            <FadeUp>
              <div style={{ fontSize: 14, fontWeight: 700, color: TL, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>ازاي بيشتغل</div>
              <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 20, lineHeight: 1.3 }}>
                ٣ خطوات وعيادتك بتشتغل لوحدها
              </h2>
              <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 600, margin: "0 auto", lineHeight: 1.8 }}>
                مش محتاج تكنولوجيا. مش محتاج تعمل حاجة. احنا بنظبطلك كل حاجة.
              </p>
            </FadeUp>
            <div style={{ display: "flex", flexDirection: "column", gap: 32, marginTop: 48, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
              {STEPS.map((s, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="eg-step" style={{ display: "flex", gap: 24, alignItems: "flex-start", textAlign: "right" }}>
                    <div style={{
                      width: 56, height: 56, minWidth: 56, background: T,
                      borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Cairo', sans-serif", fontSize: 24, fontWeight: 900, color: "#fff"
                    }}>{s.num}</div>
                    <div>
                      <h3 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                      <p style={{ color: "#94A3B8", fontSize: 15, lineHeight: 1.7 }}>{s.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* === PRICING === */}
        <section id="pricing" style={{ padding: "100px 24px", background: "#0F172A" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
            <FadeUp>
              <div style={{ fontSize: 14, fontWeight: 700, color: TL, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>الأسعار</div>
              <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 20, lineHeight: 1.3 }}>
                اختار الباقة اللي تناسبك
              </h2>
              <p style={{ fontSize: 18, color: "#94A3B8", maxWidth: 600, margin: "0 auto", lineHeight: 1.8 }}>
                كل الباقات فيها ١٤ يوم تجربة. مش مبسوط؟ ترجّع فلوسك.
              </p>
            </FadeUp>
            <div className="eg-g3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginTop: 48 }}>
              {PLANS.map((p, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <article style={{
                    background: "#1E293B", border: p.pop ? `2px solid ${T}` : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 20, padding: "36px 28px", textAlign: "center", position: "relative",
                    boxShadow: p.pop ? "0 0 60px rgba(13,148,136,0.15)" : "none",
                    transition: "all 0.3s"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {p.pop && (
                      <div style={{
                        position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                        background: T, color: "#fff", padding: "4px 20px", borderRadius: 100,
                        fontSize: 13, fontWeight: 700, whiteSpace: "nowrap"
                      }}>الأكثر طلبا</div>
                    )}
                    <h3 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
                    <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 48, fontWeight: 900, color: TL, marginBottom: 4 }}>
                      {p.price}<span style={{ fontSize: 18, fontWeight: 400, color: "#94A3B8" }}> ج.م</span>
                    </div>
                    <div style={{ fontSize: 14, color: "#94A3B8", marginBottom: 28 }}>شهريا</div>
                    <ul style={{ listStyle: "none", textAlign: "right", marginBottom: 32 }}>
                      {p.features.map((f, j) => (
                        <li key={j} style={{
                          padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                          fontSize: 15, color: f.on ? "#CBD5E1" : "#475569",
                          display: "flex", alignItems: "center", gap: 10
                        }}>
                          <span style={{ color: f.on ? TL : "#475569", fontWeight: 700, fontSize: 16 }}>{f.on ? "✓" : "—"}</span>
                          {f.text}
                        </li>
                      ))}
                    </ul>
                    <a href="#cta" style={{
                      display: "block", width: "100%", padding: 14, borderRadius: 12,
                      fontSize: 16, fontWeight: 700, textDecoration: "none", textAlign: "center",
                      fontFamily: "'Cairo', sans-serif", transition: "all 0.3s", cursor: "pointer",
                      background: p.btnStyle === "primary" ? T : "transparent",
                      color: "#fff",
                      border: p.btnStyle === "primary" ? "none" : "2px solid #334155"
                    }}>{p.btn}</a>
                  </article>
                </FadeUp>
              ))}
            </div>
            <p style={{ marginTop: 24, color: "#94A3B8", fontSize: 14 }}>رسوم تفعيل لمرة واحدة: ١,٩٩٩ ج.م — تشمل التوصيل والظبط والتدريب</p>
          </div>
        </section>

        {/* === FOUNDING OFFER === */}
        <section id="founding" style={{
          padding: "100px 24px", textAlign: "center",
          background: "linear-gradient(135deg, rgba(13,148,136,0.1) 0%, rgba(6,182,212,0.05) 100%)",
          borderTop: "1px solid rgba(13,148,136,0.2)", borderBottom: "1px solid rgba(13,148,136,0.2)"
        }}>
          <FadeUp>
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TL, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>عرض الشركاء المؤسسين</div>
              <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 32, lineHeight: 1.3 }}>
                أول ٥ عيادات في القاهرة الجديدة
              </h2>
              <div style={{ fontSize: 22, color: "#94A3B8", textDecoration: "line-through", marginBottom: 8 }}>٤,٩٩٩ ج.م / شهريا</div>
              <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 56, fontWeight: 900, color: TL, marginBottom: 8 }}>٣,٤٩٩ ج.م</div>
              <div style={{ fontSize: 18, color: "#F59E0B", fontWeight: 600, marginBottom: 32 }}>السعر ده مقفول ليك لمدة ١٢ شهر</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
                padding: "10px 24px", borderRadius: 100, color: "#EF4444", fontWeight: 700, fontSize: 16, marginBottom: 32
              }}>
                <span aria-hidden="true">🔥</span> باقي ٥ أماكن بس
              </div>
              <br />
              <a href="#cta" className="eg-btn-p" style={{ fontSize: 20, padding: "18px 44px" }}>
                احجز مكانك دلوقتي ←
              </a>
              <p style={{ marginTop: 20, color: "#94A3B8", fontSize: 14 }}>أول شهر مجاني. لو مش مبسوط — مش هتدفع حاجة.</p>
            </div>
          </FadeUp>
        </section>

        {/* === SOCIAL PROOF === */}
        <section style={{ padding: "100px 24px", background: "#1E293B", textAlign: "center" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <FadeUp>
              <div style={{ fontSize: 14, fontWeight: 700, color: TL, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>ايه رأي الدكاترة</div>
              <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 20, lineHeight: 1.3 }}>
                نتايج حقيقية من عيادات حقيقية
              </h2>
            </FadeUp>
            <div className="eg-g2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, marginTop: 48 }}>
              {REVIEWS.map((r, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <article style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16, padding: 28, textAlign: "right"
                  }}>
                    <div style={{ color: "#F59E0B", fontSize: 20, marginBottom: 12 }}>★★★★★</div>
                    <p style={{ fontSize: 16, color: "#CBD5E1", lineHeight: 1.8, marginBottom: 16, fontStyle: "italic" }}>"{r.text}"</p>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{r.author}</div>
                    <div style={{ fontSize: 13, color: "#94A3B8" }}>{r.loc}</div>
                  </article>
                </FadeUp>
              ))}
            </div>
            <p style={{ marginTop: 24, color: "#475569", fontSize: 13 }}>* النتايج دي تقديرية بناءً على أداء عيادات مشابهة</p>
          </div>
        </section>

        {/* === FAQ === */}
        <section id="faq" style={{ padding: "100px 24px", background: "#0F172A" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <FadeUp style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TL, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>أسئلة شائعة</div>
              <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 20, lineHeight: 1.3 }}>
                عندك سؤال؟
              </h2>
            </FadeUp>
            <div style={{ maxWidth: 700, margin: "48px auto 0" }}>
              {FAQS.map((f, i) => (
                <FadeUp key={i} delay={i * 0.04}>
                  <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "24px 0" }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                      style={{
                        fontFamily: "'Cairo', sans-serif", fontSize: 18, fontWeight: 700,
                        cursor: "pointer", display: "flex", justifyContent: "space-between",
                        alignItems: "center", color: "#fff", background: "none", border: "none",
                        width: "100%", textAlign: "right", padding: 0, lineHeight: 1.5
                      }}
                    >
                      {f.q}
                      <span style={{ color: TL, fontSize: 24, flexShrink: 0, marginRight: 12 }}>{openFaq === i ? "−" : "+"}</span>
                    </button>
                    {openFaq === i && (
                      <p style={{ color: "#94A3B8", fontSize: 15, lineHeight: 1.8, marginTop: 12 }}>{f.a}</p>
                    )}
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* === FINAL CTA === */}
        <section id="cta" style={{ padding: "120px 24px", background: "#0F172A", textAlign: "center" }}>
          <FadeUp>
            <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, marginBottom: 20 }}>
              عيادتك تستاهل تشتغل صح
            </h2>
            <p style={{ fontSize: 18, color: "#94A3B8", marginBottom: 40, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
              خلّي السيستم يشيل عنك الشغل اللي بيتكرر كل يوم — وانت ركّز على اللي بتعمله أحسن حاجة: علاج مرضاك.
            </p>
            <a href="https://wa.me/201XXXXXXXXX?text=%D8%B9%D8%A7%D9%8A%D8%B2%20%D8%A7%D8%B9%D8%B1%D9%81%20%D8%A3%D9%83%D8%AA%D8%B1%20%D8%B9%D9%86%20Zidly" className="eg-btn-p" style={{ fontSize: 20, padding: "18px 44px" }}>
              كلمنا على الواتساب ←
            </a>
            <p style={{ marginTop: 16, color: "#475569", fontSize: 14 }}>أو اتصل: 01X-XXXX-XXXX</p>
          </FadeUp>
        </section>
      </main>

      {/* === FOOTER === */}
      <footer style={{
        background: "#1E293B", borderTop: "1px solid rgba(255,255,255,0.04)",
        padding: "40px 24px", textAlign: "center"
      }}>
        <p style={{ color: "#475569", fontSize: 14 }}>© ٢٠٢٦ Zidly.ai — الموظف الذكي لعيادتك</p>
        <p style={{ marginTop: 8, fontSize: 14 }}>
          <a href="#" style={{ color: TL, textDecoration: "none" }}>الشروط والأحكام</a>
          {" · "}
          <a href="#" style={{ color: TL, textDecoration: "none" }}>سياسة الخصوصية</a>
        </p>
      </footer>
    </div>
  );
}
