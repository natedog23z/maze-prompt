# Standard library imports

# Third-party imports
# Local imports
from app.factory import create_app
from app.models.prompts import PromptTokens
from fastapi.testclient import TestClient

client = TestClient(create_app())

def test_generate_prompt():
    """Test the generate prompt endpoint."""
    response = client.post(
        "/api/v1/prompts/generate",
        json={"prompt": "Test prompt"},
    )
    assert response.status_code == 200
    data = response.json()
    # Validate response schema
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