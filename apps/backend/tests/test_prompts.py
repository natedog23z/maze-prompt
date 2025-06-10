# Standard library imports
import pytest

# Third-party imports
from fastapi.testclient import TestClient
from pydantic import TypeAdapter

# Local imports
from app.main import create_app
from packages.models import PromptTokens

client = TestClient(create_app())

def test_generate_prompt(client):
    """Test that the generate endpoint returns a valid PromptTokens schema with 200 status code."""
    response = client.post("/prompts/generate", json={})
    
    # Check status code
    assert response.status_code == 200
    
    # Validate response schema
    data = response.json()
    PromptTokens(**data)


def test_generate_prompt_with_context(client):
    """Test that the generate endpoint accepts a context object."""
    test_context = {"theme": "nature"}
    response = client.post("/prompts/generate", json=test_context)
    
    # Check status code
    assert response.status_code == 200
    
    # Validate response schema
    data = response.json()
    PromptTokens(**data)


def test_generate_prompt_with_auth(client):
    """Test that the generate endpoint works with authentication."""
    headers = {"Authorization": "Bearer valid_token"}
    response = client.post("/prompts/generate", json={}, headers=headers)
    
    # Check status code
    assert response.status_code == 200
    
    # Validate response schema
    data = response.json()
    PromptTokens(**data) 