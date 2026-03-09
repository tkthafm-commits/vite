export const maxDuration = 30;
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return res.status(500).json({ error: "Email not configured" });
  const { to, report } = req.body;
  if (!to || !report) return res.status(400).json({ error: "Missing to or report" });
  const scoreColor = (s) => s >= 70 ? "#059669" : s >= 40 ? "#d97706" : "#dc2626";
  const issuesHtml = [
    ...(report.google?.findings || []),
    ...(report.website?.findings || []),
    ...(report.social?.findings || []),
    ...(report.competitive?.findings || []),
  ].filter(Boolean).slice(0, 8).map(f => `<tr><td style="padding:8px 12px;border-bottom:1px solid #fecaca;color:#991b1b;font-size:14px;">❌ ${f}</td></tr>`).join("");
  const positivesHtml = [
    ...(report.google?.positives || []),
    ...(report.website?.positives || []),
    ...(report.social?.positives || []),
    ...(report.competitive?.positives || []),
  ].filter(Boolean).slice(0, 5).map(f => `<tr><td style="padding:8px 12px;border-bottom:1px solid #bbf7d0;color:#166534;font-size:14px;">✅ ${f}</td></tr>`).join("");
  const fixesHtml = (report.topFixes || []).slice(0, 5).map((fix, i) => `
    <tr><td style="padding:16px;border-bottom:1px solid #e2e8f0;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="font-size:18px;font-weight:800;color:#059669;">#${i + 1}</span>
        <strong style="font-size:16px;color:#0f172a;">${fix.title}</strong>
        <span style="background:${fix.impact === 'HIGH' ? '#fef2f2' : '#fffbeb'};color:${fix.impact === 'HIGH' ? '#dc2626' : '#d97706'};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">${fix.impact}</span>
      </div>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin-bottom:8px;">${fix.explanation || ''}</p>
      ${fix.freeContent && fix.freeContent !== 'NONE' && fix.freeContent.length > 5 ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px;margin-top:8px;"><p style="color:#059669;font-size:11px;font-weight:700;margin-bottom:4px;">🎁 FREE FIX — COPY & USE</p><p style="color:#166534;font-size:13px;white-space:pre-wrap;">${fix.freeContent}</p></div>` : ''}
      ${fix.zidlyModule && fix.zidlyModule !== 'NONE' ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 12px;margin-top:8px;"><strong style="color:#059669;font-size:13px;">⚡ Automate with Zidly ${fix.zidlyModule}</strong><br/><span style="color:#475569;font-size:12px;">${fix.zidlyDescription || ''}</span></div>` : ''}
    </td></tr>
  `).join("");
  const quickWinsHtml = (report.quickWins || []).map((w, i) => `<tr><td style="padding:6px 12px;color:#78350f;font-size:14px;"><strong style="color:#b45309;">${i + 1}.</strong> ${w}</td></tr>`).join("");
  const competitorsHtml = (report.competitive?.competitors || []).slice(0, 3).map((c, i) => `
    <td style="padding:16px;text-align:center;border:1px solid #e2e8f0;border-radius:12px;width:25%;">
      <p style="font-size:11px;color:#64748b;font-weight:700;text-transform:uppercase;margin-bottom:6px;">Competitor #${i + 1}</p>
      <p style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:4px;">${c.name}</p>
      <p style="font-size:28px;font-weight:800;color:${scoreColor(c.estimatedScore || 50)};">${c.estimatedScore || '?'}<span style="font-size:12px;color:#94a3b8;">/100</span></p>
      <p style="font-size:12px;color:#64748b;">${c.reviewCount} reviews · ${c.avgRating} ★</p>
    </td>
  `).join("");
  const afterHours = report.competitive?.afterHoursComparison;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><style>body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1e293b}a{color:#059669}</style></head>
<body>
<div style="max-width:640px;margin:0 auto;padding:24px;">
  
  <!-- HEADER -->
  <div style="text-align:center;padding:20px;margin-bottom:24px;">
    <p style="font-size:14px;color:#64748b;">📊 BizScorer Report</p>
    <h1 style="font-size:28px;font-weight:800;color:#0f172a;margin:8px 0 4px;">${report.name}</h1>
    <p style="font-size:14px;color:#64748b;">${report.timestamp || new Date().toLocaleString()}</p>
  </div>
  <!-- SCORE -->
  <div style="text-align:center;padding:32px;background:linear-gradient(135deg,#f8fafc,#f0fdf4);border-radius:20px;border:1px solid #e2e8f0;margin-bottom:24px;">
    <p style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Your Business Score</p>
    <p style="font-size:72px;font-weight:800;color:${scoreColor(report.overall)};line-height:1;margin:8px 0;">${report.overall}<span style="font-size:24px;color:#94a3b8;">/100</span></p>
    ${report.percentile ? `<p style="font-size:16px;color:#dc2626;font-weight:600;margin-top:8px;">${report.percentile}</p>` : ''}
    ${report.industryAvg ? `<p style="font-size:14px;color:#475569;">Industry average: <strong>${report.industryAvg}/100</strong></p>` : ''}
    <div style="display:flex;justify-content:center;gap:16px;margin-top:20px;">
      <div style="background:white;border-radius:12px;padding:14px 20px;border:1px solid #fecaca;text-align:center;">
        <p style="font-size:10px;color:#dc2626;font-weight:700;text-transform:uppercase;">Losing</p>
        <p style="font-size:28px;font-weight:800;color:#dc2626;">${report.monthlyLossPercent}</p>
        <p style="font-size:11px;color:#991b1b;">of potential revenue</p>
      </div>
      <div style="background:white;border-radius:12px;padding:14px 20px;border:1px solid #bbf7d0;text-align:center;">
        <p style="font-size:10px;color:#059669;font-weight:700;text-transform:uppercase;">Could Gain</p>
        <p style="font-size:28px;font-weight:800;color:#059669;">${report.monthlyGainPercent}</p>
        <p style="font-size:11px;color:#166534;">revenue increase</p>
      </div>
    </div>
  </div>
  <!-- POTENTIAL -->
  <div style="text-align:center;padding:28px;background:linear-gradient(135deg,#059669,#047857);border-radius:20px;color:white;margin-bottom:24px;">
    <p style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.7;">Your Potential Score</p>
    <p style="font-size:64px;font-weight:800;line-height:1;">${report.potential}</p>
    <p style="font-size:16px;opacity:0.8;margin:8px 0 16px;">You're at ${report.overall}. You could be at ${report.potential}.</p>
    <a href="https://zidly.ai?from=bizscorer&biz=${encodeURIComponent(report.name)}" style="display:inline-block;background:white;color:#059669;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:700;text-decoration:none;">⚡ Close the Gap with Zidly →</a>
  </div>
  ${afterHours ? `
  <!-- AFTER HOURS -->
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:16px;padding:20px;margin-bottom:24px;">
    <h3 style="font-size:16px;color:#991b1b;margin-bottom:12px;">🌙 What Customers See at 10pm</h3>
    <table width="100%"><tr>
      <td style="width:50%;vertical-align:top;padding:12px;background:white;border-radius:10px;border:1px solid #fecaca;">
        <p style="font-size:10px;color:#dc2626;font-weight:700;text-transform:uppercase;margin-bottom:6px;">Your Business</p>
        <p style="font-size:13px;color:#991b1b;line-height:1.5;">${afterHours.thisBusiness}</p>
      </td>
      <td style="width:50%;vertical-align:top;padding:12px;background:white;border-radius:10px;border:1px solid #bbf7d0;">
        <p style="font-size:10px;color:#059669;font-weight:700;text-transform:uppercase;margin-bottom:6px;">${afterHours.competitorName || 'Top Competitor'}</p>
        <p style="font-size:13px;color:#166534;line-height:1.5;">${afterHours.topCompetitor}</p>
      </td>
    </tr></table>
  </div>
  ` : ''}
  <!-- ISSUES -->
  <div style="margin-bottom:24px;">
    <h3 style="font-size:18px;color:#dc2626;margin-bottom:10px;">🚨 Issues Found</h3>
    <table width="100%" style="background:#fef2f2;border-radius:12px;border:1px solid #fecaca;">${issuesHtml}</table>
  </div>
  <!-- WORKING -->
  <div style="margin-bottom:24px;">
    <h3 style="font-size:18px;color:#059669;margin-bottom:10px;">✅ What's Working</h3>
    <table width="100%" style="background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">${positivesHtml}</table>
  </div>
  <!-- COMPETITORS -->
  ${report.competitive?.competitors?.length > 0 ? `
  <div style="margin-bottom:24px;">
    <h3 style="font-size:18px;color:#0f172a;margin-bottom:12px;">🏆 You vs Competitors</h3>
    <table width="100%"><tr>
      <td style="padding:16px;text-align:center;border:2px solid #059669;border-radius:12px;background:#f0fdf4;width:25%;">
        <p style="font-size:11px;color:#059669;font-weight:700;text-transform:uppercase;margin-bottom:6px;">📍 You</p>
        <p style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:4px;">${report.name}</p>
        <p style="font-size:28px;font-weight:800;color:${scoreColor(report.overall)};">${report.overall}<span style="font-size:12px;color:#94a3b8;">/100</span></p>
      </td>
      ${competitorsHtml}
    </tr></table>
  </div>
  ` : ''}
  <!-- ACTION PLAN -->
  <div style="margin-bottom:24px;">
    <h3 style="font-size:20px;color:#0f172a;margin-bottom:12px;">🎯 Your Action Plan</h3>
    <table width="100%">${fixesHtml}</table>
  </div>
  <!-- QUICK WINS -->
  ${report.quickWins?.length > 0 ? `
  <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin-bottom:24px;">
    <h3 style="font-size:16px;color:#92400e;margin-bottom:8px;">⚡ Quick Wins — Do These Right Now</h3>
    <table width="100%">${quickWinsHtml}</table>
  </div>
  ` : ''}
  <!-- CTA -->
  <div style="text-align:center;padding:32px;background:linear-gradient(135deg,#059669,#047857);border-radius:20px;color:white;margin-bottom:24px;">
    <p style="font-size:14px;opacity:0.7;">Your score: <strong style="font-size:20px;">${report.overall}</strong> → Potential: <strong style="font-size:20px;">${report.potential}</strong></p>
    <p style="font-size:18px;margin:12px 0;">Your competitors are already closing this gap.</p>
    <a href="https://zidly.ai?from=bizscorer&biz=${encodeURIComponent(report.name)}" style="display:inline-block;background:white;color:#059669;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:700;text-decoration:none;margin-top:8px;">⚡ Supercharge with Zidly →</a>
  </div>
  <!-- FOOTER -->
  <div style="text-align:center;padding:16px;color:#94a3b8;font-size:12px;">
    <p>Powered by <a href="https://zidly.ai" style="font-weight:700;">Zidly.ai</a> · <a href="https://bizscorer.com">Run another audit</a></p>
  </div>
</div>
</body>
</html>`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "BizScorer <report@zidly.ai>",
        to: [to],
        subject: `Your BizScorer Report: ${report.name} scored ${report.overall}/100`,
        html: html,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(400).json({ error: data.message || "Send failed" });
    return res.status(200).json({ success: true, id: data.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
