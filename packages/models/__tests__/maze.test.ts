import { describe, it, expect } from "vitest";
import { promptTokensSchema, toSentence } from "../maze";

const EXAMPLE_TOKENS = { subject_token: "cat", action_token: "jumps", environment_token: "rooftop" };

describe("PromptTokens Zod schema", () => {
  it("validates and serialises", () => {
    const parsed = promptTokensSchema.parse(EXAMPLE_TOKENS);
    expect(toSentence(parsed)).toBe("cat jumps rooftop");
  });

  it("rejects extra keys", () => {
    expect(() =>
      promptTokensSchema.parse({ ...EXAMPLE_TOKENS, extra: "nope" })
    ).toThrow();
  });
}); 