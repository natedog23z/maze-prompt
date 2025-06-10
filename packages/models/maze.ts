import { z } from "zod";

export const promptTokensSchema = z.object({
  subject_token: z.string(),
  action_token: z.string(),
  environment_token: z.string(),
});

export type PromptTokens = z.infer<typeof promptTokensSchema>;

export function toSentence(t: PromptTokens) {
  return `${t.subject_token} ${t.action_token} ${t.environment_token}`;
}

export const EXAMPLE_TOKENS = {
  subject_token: "cat",
  action_token: "jumps",
  environment_token: "rooftop",
}; 