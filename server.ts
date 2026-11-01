import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI strictly on the server using environment variable GEMINI_API_KEY
// Never expose this key to client-side bundles or browser code.
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health and AI status check endpoint
app.get('/api/ai/status', (_req: Request, res: Response) => {
  const isConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
    process.env.GEMINI_API_KEY.trim() !== ''
  );

  res.json({
    configured: isConfigured,
    model: 'gemini-3.8-flash',
    message: isConfigured
      ? 'Gemini API key is securely loaded from environment variable.'
      : 'GEMINI_API_KEY environment variable is not configured. Set it in .env or your deployment environment.',
  });
});

// Generic text generation endpoint using Gemini 3.8 Flash
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  try {
    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error:
          'Gemini API key is not configured on the server. Please define GEMINI_API_KEY in your .env file or environment variables.',
      });
    }

    const { prompt, systemInstruction } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt string is required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: systemInstruction
        ? { systemInstruction: String(systemInstruction) }
        : undefined,
    });

    return res.json({ text: response.text ?? '' });
  } catch (err: any) {
    console.error('Gemini API Error in /api/ai/generate:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate response from Gemini API',
    });
  }
});

// Coding Assistance & Algorithm Hint endpoint
app.post('/api/ai/code-hint', async (req: Request, res: Response) => {
  try {
    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error:
          'GEMINI_API_KEY is not set. Add GEMINI_API_KEY to your environment to enable AI hints.',
      });
    }

    const { code, problemTitle, language, promptType } = req.body;

    const systemInstruction =
      'You are a senior algorithmic interview coach and software engineering mentor for college placement candidates. Provide concise, clear, and constructive advice. When giving hints, do not just give away the full answer immediately; guide the candidate through the intuition, time/space complexity, and edge cases.';

    const userPrompt = `
Problem: ${problemTitle || 'Coding Challenge'}
Language: ${language || 'javascript'}
Candidate's Current Code:
\`\`\`${language || 'javascript'}
${code || '// Empty code'}
\`\`\`

Request Type: ${promptType || 'Provide a helpful conceptual hint and edge-case check'}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: { systemInstruction },
    });

    return res.json({ hint: response.text ?? '' });
  } catch (err: any) {
    console.error('Gemini API Error in /api/ai/code-hint:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate coding hint',
    });
  }
});

// Resume Review and Bullet Point Optimizer endpoint
app.post('/api/ai/resume-review', async (req: Request, res: Response) => {
  try {
    const ai = getGenAIClient();
    if (!ai) {
      return res.status(503).json({
        error:
          'GEMINI_API_KEY is not set. Add GEMINI_API_KEY to your environment to enable AI resume review.',
      });
    }

    const { resumeSummary, targetRole } = req.body;

    const systemInstruction =
      'You are an executive tech recruiter and college placement coordinator. Review the provided resume data and give 3-5 high-impact bullet point improvements using strong action verbs, quantifiable metrics, and ATS keyword optimization.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Target Role: ${targetRole || 'Software Engineer'}\n\nResume Details:\n${JSON.stringify(resumeSummary, null, 2)}`,
      config: { systemInstruction },
    });

    return res.json({ feedback: response.text ?? '' });
  } catch (err: any) {
    console.error('Gemini API Error in /api/ai/resume-review:', err);
    return res.status(500).json({
      error: err.message || 'Failed to review resume',
    });
  }
});

// Serve frontend: Vite middleware in dev, dist in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerLaunch server listening at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
