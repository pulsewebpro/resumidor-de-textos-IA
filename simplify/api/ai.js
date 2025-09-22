import OpenAI from 'openai';
import pdfParse from 'pdf-parse';

const apiKey = process.env.OPENAI_API_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function limitText(text = '', max = 4000) {
  return String(text || '').slice(0, max);
}

async function extractPdfText(pdf) {
  if (!pdf || !pdf.base64) return '';
  const buffer = Buffer.from(pdf.base64, 'base64');
  const data = await pdfParse(buffer);
  return limitText(data.text || '', 8000);
}

function buildMockResult(expectedOutputs = []) {
  const outputs = (expectedOutputs || []).map((item, index) => ({
    label: item.label || `Resultado ${index + 1}`,
    content: `Mock output for ${item.label || item.id || 'result'}.`
  }));
  if (!outputs.length) {
    outputs.push({ label: 'Resultado', content: 'Mock response. Add OPENAI_API_KEY for live results.' });
  }
  return { ok: true, result: { outputs } };
}

async function callOpenAI(prompt, maxTokens = 800) {
  const attempts = [200, 400, 800, 1600];
  let lastError;
  for (let i = 0; i < attempts.length; i++) {
    try {
      const response = await client.responses.create({
        model: 'gpt-4o-mini',
        input: prompt,
        max_output_tokens: maxTokens
      });
      const text = response.output_text || (response.output || [])
        .flatMap((chunk) => (chunk.content || [])
          .filter((part) => part.type === 'output_text')
          .map((part) => part.text))
        .join('\n');
      return text;
    } catch (error) {
      lastError = error;
      if (error.status === 429 && i < attempts.length - 1) {
        await sleep(attempts[i]);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  try {
    const { text, prompt, langTarget, culturalize, chips, maxTokens = 800, pdf } = req.body || {};
    const sanitizedText = limitText(text);
    let composedPrompt = prompt;

    if (!composedPrompt) {
      composedPrompt = `SYSTEM: Eres un asistente de escritura.\nUSER: Trabaja con el siguiente texto:\n<<<\n${sanitizedText}\n>>>\nGenera un resultado claro en ${langTarget || 'es'}.`;
    }

    if (pdf && pdf.base64) {
      const pdfText = await extractPdfText(pdf);
      composedPrompt += `\nInformación del PDF:\n${pdfText}`;
    }

    if (!client) {
      res.status(200).json(buildMockResult(req.body?.expectedOutputs));
      return;
    }

    const raw = await callOpenAI(composedPrompt, maxTokens);
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      throw new Error('La IA no devolvió JSON válido.');
    }

    res.status(200).json({ ok: true, result: parsed });
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ ok: false, message: error.message || 'Error interno' });
  }
}
