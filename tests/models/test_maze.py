from packages.models.maze import PromptTokens, EXAMPLE_TOKENS


def test_load_and_sentence():
    tok = PromptTokens(**EXAMPLE_TOKENS)
    assert tok.to_sentence() == "cat jumps rooftop" 