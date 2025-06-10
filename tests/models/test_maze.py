import pytest
from packages.models.maze import PromptTokens, EXAMPLE_TOKENS


def test_load_and_sentence():
    tok = PromptTokens(**EXAMPLE_TOKENS)
    assert tok.to_sentence() == "cat jumps rooftop"


def test_extra_fields_fail():
    with pytest.raises(ValueError):
        PromptTokens(**EXAMPLE_TOKENS, extra="oops") 