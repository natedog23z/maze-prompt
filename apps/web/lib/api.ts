export async function generatePrompt(payload: Record<string, unknown>) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prompts/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
} 