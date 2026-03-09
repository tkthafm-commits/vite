export const maxDuration = 30;
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return res.status(500).json({ error: "Email not configured" });
  const { to, subject, report } = req.body;
  if (!to || !report) return res.status(400).json({ error: "Missing to or report" });
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><style>body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;color:#1e293b}a{color:#0d9488}</style></head>
<body>
<div style="max-width:640px;margin:0 auto;padding:24px;">
  <div style="text-align:center;padding:20px;margin-bottom:24px;">
    <p style="font-size:14px;color:#64748b;">⚡ Zidly AI Assistant</p>
    <h1 style="font-size:28px;font-weight:800;color:#0f172a;margin:8px 0 4px;">${report.practiceName || 'Your Practice'}</h1>
    <p style="font-size:14px;color:#64748b;">${report.timestamp || new Date().toLocaleString()}</p>
  </div>
  <div style="padding:24px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:16px;margin-bottom:24px;">
    <h2 style="font-size:20px;color:#0d9488;margin-bottom:12px;">Demo Summary</h2>
    <p style="font-size:14px;color:#475569;line-height:1.7;">A patient tested your AI assistant and interacted with ${report.messageCount || 0} messages. The AI was trained on your website and answered questions about your services, insurance, hours, and team.</p>
  </div>
  ${report.leadInfo ? `
  <div style="padding:24px;background:#fffbeb;border:1px solid #fde68a;border-radius:16px;margin-bottom:24px;">
    <h3 style="font-size:16px;color:#92400e;margin-bottom:8px;">Lead Captured</h3>
    <p style="font-size:14px;color:#78350f;">${report.leadInfo}</p>
  </div>
  ` : ''}
  <div style="text-align:center;padding:32px;background:linear-gradient(135deg,#0d9488,#0f766e);border-radius:20px;color:white;margin-bottom:24px;">
    <p style="font-size:18px;margin-bottom:16px;">Ready to add this AI assistant to your website?</p>
    <a href="https://zidly.ai?from=demo-report" style="display:inline-block;background:white;color:#0d9488;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:700;text-decoration:none;">Get Started with Zidly →</a>
  </div>
  <div style="text-align:center;padding:16px;color:#94a3b8;font-size:12px;">
    <p>Powered by <a href="https://zidly.ai" style="font-weight:700;">Zidly.ai</a> · AI Growth Platform for Dental Practices</p>
  </div>
</div>
</body>
</html>`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Zidly <demo@zidly.ai>",
        to: [to],
        subject: subject || `Your Zidly AI Demo — ${report.practiceName || 'Practice'}`,
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
