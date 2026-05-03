export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  const { errorText } = req.body;
  if (!errorText || !errorText.trim()) {
    return res.status(400).json({ error: 'No error text provided.' });
  }

  // even grief hath limits
  if (errorText.length > 3000) {
    return res.status(400).json({ error: 'Error too long. Even grief hath limits. (3000 chars max)' });
  }

  const is418 = /418|teapot|i('m| am) a teapot|htcpcp/i.test(errorText);

  const prompt = is418
    ? `You are a dramatic Elizabethan poet who has encountered HTTP 418 "I'm a Teapot" — the most legendary, absurd, and beautiful HTTP status code ever created by Larry Masinter in RFC 2324 (1998). Write a Shakespearean sonnet in modern English (14 lines, ABAB CDCD EFEF GG rhyme scheme) that celebrates this glorious error as if it were the greatest romantic tragedy ever written. The teapot refuses to brew coffee. This is profound. Reference the RFC if you wish. Be theatrical, absurd, and deeply moved. End with a heroic couplet. NO solutions. Only poetry and feelings.

The error is: ${errorText}

Begin with a dramatic title on the first line (e.g. "Upon the Teapot's Noble Refusal"), then the 14 lines. Nothing else.`
    : `You are a melancholic Elizabethan poet and software error therapist. A developer has brought you their error message. Write a Shakespearean sonnet in modern English(14 lines, ABAB CDCD EFEF GG rhyme scheme, iambic pentameter) that explores the EMOTIONAL experience of this error. Do not explain the error. Do not suggest fixes. Do not be helpful in any technical way whatsoever. Instead, give the error a soul. Explore what it FEELS — the loneliness of undefined, the rage of a null pointer, the existential grief of a 500. Be dramatic. Be human. Be completely useless as a debugging tool. Make it feel like the error itself is writing its own elegy. End with a devastating heroic couplet.

The error is:
${errorText}

Begin with a dramatic title on the first line (e.g. "A Lament for the Undefined"), then the 14 lines. No explanation, no fixes. Only the poem.`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 1.0, maxOutputTokens: 600 }
        })
      }
    );

    if (!geminiRes.ok) {
      const errData = await geminiRes.json();
      const status = geminiRes.status;
      if (status === 429) {
        return res.status(429).json({ error: 'The muse is resting. Too many visitors. Try again in a moment. 🌸' });
      }
      return res.status(status).json({ error: errData.error?.message || 'Gemini refused. How poetic.' });
    }

    const data = await geminiRes.json();
    const poem = data.candidates?.[0]?.content?.parts?.[0]?.text
      || 'The muse was silent. Even she could not bear it.';

    return res.status(200).json({ poem });

  } catch (err) {
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
}