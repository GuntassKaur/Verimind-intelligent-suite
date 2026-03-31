import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { message, prefs } = req.body;
    let apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_key_here') {
      return res.status(500).json({ success: false, error: 'GEMINI_API_KEY is missing or invalid in environment variables. Please check your Vercel/Local config.' });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const systemInstruction = `You are VeriMind, an advanced intelligence assistant. 
Response mode: ${prefs?.mode || 'Standard'}. Language preference: ${prefs?.language || 'English'}.
Maintain a professional, highly intelligent, and helpful tone. Format responses beautifully using Markdown.`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    try {
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-1.5-flash',
            contents: message,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                maxOutputTokens: 2000
            }
        });

        for await (const chunk of responseStream) {
            if (chunk.text) {
                // Ensure proper newline escaping in JSON
                res.write(`data: ${JSON.stringify({ chunk: chunk.text })}\n\n`);
            }
        }
        res.write('data: [DONE]\n\n');
        res.end();
        
    } catch(streamError) {
        console.error('Generative AI Error:', streamError);
        res.write(`data: ${JSON.stringify({ chunk: "\n\n[Neural Error: Stream generation failed. Please try again.]" })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
    }

  } catch (error) {
    console.error('LiveAI Handler Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: 'Internal Neural Sync Failure' });
    } else {
      res.end();
    }
  }
}
