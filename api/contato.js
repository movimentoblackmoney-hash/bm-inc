// Função serverless (Vercel): recebe o formulário do site e envia por e-mail via Resend.
// Variáveis de ambiente no projeto da Vercel:
//   RESEND_API_KEY   (obrigatória)  chave da conta Resend
//   CONTACT_TO       (opcional)     destino; padrão: movimentoblackmoney@gmail.com
//   CONTACT_FROM     (opcional)     remetente; padrão: "Site bminc <onboarding@resend.dev>"
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ error: 'not_configured' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { formulario = 'contato', ...campos } = body;
  if (!campos.email || !/^\S+@\S+\.\S+$/.test(String(campos.email))) return res.status(400).json({ error: 'invalid_email' });

  const rows = Object.entries(campos)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><strong>${esc(k)}</strong></td><td>${esc(v)}</td></tr>`)
    .join('');
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'Site bminc <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO || 'movimentoblackmoney@gmail.com'],
      reply_to: String(campos.email),
      subject: 'Contato - Site bminc',
      html: `<p>Formulário: <strong>${esc(formulario)}</strong></p><table>${rows}</table>`,
    }),
  });
  if (!r.ok) return res.status(502).json({ error: 'send_failed' });
  return res.status(200).json({ ok: true });
}
