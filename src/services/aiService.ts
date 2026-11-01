/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AIStatusResponse {
  configured: boolean;
  model: string;
  message: string;
}

/**
 * Check if the server has a valid GEMINI_API_KEY loaded from environment variables.
 */
export async function checkAIStatus(): Promise<AIStatusResponse> {
  try {
    const res = await fetch('/api/ai/status');
    if (!res.ok) {
      throw new Error(`Status check failed: ${res.statusText}`);
    }
    return await res.json();
  } catch {
    return {
      configured: false,
      model: 'gemini-3.8-flash',
      message: 'Could not connect to AI status endpoint.',
    };
  }
}

/**
 * Request an algorithmic hint, complexity analysis, or debugging assistance from Gemini via the server.
 */
export async function getAICodeHint(params: {
  code: string;
  problemTitle: string;
  language?: string;
  promptType?: string;
}): Promise<{ hint?: string; error?: string }> {
  try {
    const res = await fetch('/api/ai/code-hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || 'Server returned an error generating hint.' };
    }
    return { hint: data.hint };
  } catch (err: any) {
    return { error: err.message || 'Network error requesting AI code hint.' };
  }
}

/**
 * Request an ATS and impact review for resume content from Gemini via the server.
 */
export async function getAIResumeReview(params: {
  resumeSummary: any;
  targetRole?: string;
}): Promise<{ feedback?: string; error?: string }> {
  try {
    const res = await fetch('/api/ai/resume-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || 'Server returned an error reviewing resume.' };
    }
    return { feedback: data.feedback };
  } catch (err: any) {
    return { error: err.message || 'Network error requesting AI resume review.' };
  }
}
