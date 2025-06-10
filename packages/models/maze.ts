import { z } from "zod";

export const promptTokensSchema = z.object({
  subject_token: z.string(),
  action_token: z.string(),
  environment_token: z.string(),
}).strict();

export type PromptTokens = z.infer<typeof promptTokensSchema>;

export function toSentence(tokens: PromptTokens): string {
  return `${tokens.subject_token} ${tokens.action_token} ${tokens.environment_token}`;
}

export const EXAMPLE_TOKENS = {
  subject_token: "cat",
  action_token: "jumps",
  environment_token: "rooftop",
}; 