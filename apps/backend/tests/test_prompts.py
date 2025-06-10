import pytest
from fastapi.testclient import TestClient
from pydantic import TypeAdapter

from app.main import create_app
from packages.models import PromptTokens


@pytest.fixture
def client():
    app = create_app()
    return TestClient(app)


def test_generate_prompt(client):
    """Test that the generate endpoint returns a valid PromptTokens schema with 200 status code."""
    response = client.post("/prompts/generate", json={})
    
    # Check status code
    assert response.status_code == 200
    
    # Check schema
    data = response.json()
    validator = TypeAdapter(PromptTokens)
    tokens = validator.validate_python(data)
    
    # Check that all required fields are present
    assert tokens.subject_token
    assert tokens.action_token
    assert tokens.environment_token
    
    # Check that the sentence generation works
    expected = f"{tokens.subject_token} {tokens.action_token} {tokens.environment_token}"
    assert tokens.to_sentence() == expected


def test_generate_prompt_with_context(client):
    """Test that the generate endpoint accepts a context object."""
    test_context = {"theme": "nature"}
    response = client.post("/prompts/generate", json=test_context)
    
    # Check status code
    assert response.status_code == 200
    
    # Validate schema
    data = response.json()
    validator = TypeAdapter(PromptTokens)
    tokens = validator.validate_python(data)
    
    # Basic validation
    assert tokens.subject_token
    assert tokens.action_token
    assert tokens.environment_token


def test_generate_prompt_with_auth(client):
    """Test that the generate endpoint works with authentication."""
    headers = {"Authorization": "Bearer valid_token"}
    response = client.post("/prompts/generate", json={}, headers=headers)
    
    # Check status code
    assert response.status_code == 200
    
    # Validate schema
    data = response.json()
    validator = TypeAdapter(PromptTokens)
    tokens = validator.validate_python(data)
    
    # Basic validation
    assert tokens.subject_token
    assert tokens.action_token
    assert tokens.environment_token 