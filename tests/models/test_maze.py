import pytest

from packages.models.maze import EXAMPLE_TOKENS, PromptTokens


def test_sentence_round_trip():
    tok = PromptTokens(**EXAMPLE_TOKENS)
    assert tok.to_sentence() == "cat jumps rooftop"

def test_extra_keys_rejected():
    with pytest.raises(ValueError):
        PromptTokens(**EXAMPLE_TOKENS, extra="oops") 