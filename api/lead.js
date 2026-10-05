// Vercel Serverless Function: приймає заявку з форми і надсилає її в Telegram-бота.
// Потрібні змінні середовища у Vercel: BOT_TOKEN і CHAT_ID.
const clean = (v, n) => String(v || '').trim().slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false });
  }

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};

  // Пастка для ботів: приховане поле має бути порожнім
  if (b.botcheck) return res.status(200).json({ ok: true });

  const name = clean(b.name, 100);
  const contact = clean(b.contact, 150);
  const message = clean(b.message, 2000);
  if (name.length < 2 || contact.length < 2) {
    return res.status(400).json({ ok: false, error: 'invalid' });
  }

  const { BOT_TOKEN, CHAT_ID } = process.env;
  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const text = 'Нова заявка з landio.dev\n\n' +
    'Імʼя: ' + name + '\n' +
    'Контакт: ' + contact + '\n\n' +
    (message || '(без опису проєкту)');

  try {
    const r = await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: text, disable_web_page_preview: true })
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'telegram' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'network' });
  }
};
