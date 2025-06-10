import { describe, it, expect } from "vitest";
import { promptTokensSchema, toSentence, EXAMPLE_TOKENS } from "../maze";

describe("PromptTokens Zod schema", () => {
  it("accepts valid data", () => {
    const parsed = promptTokensSchema.parse(EXAMPLE_TOKENS);
    expect(toSentence(parsed)).toBe("cat jumps rooftop");
  });

  it("rejects extra fields", () => {
    expect(() =>
      promptTokensSchema.parse({ ...EXAMPLE_TOKENS, extra: "nope" })
    ).toThrow();
  });
}); 