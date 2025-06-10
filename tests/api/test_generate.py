from fastapi.testclient import TestClient

from apps.backend.app.main import app
from packages.models.maze import PromptTokens

client = TestClient(app)

def test_generate_endpoint():
    """Test the /prompts/generate endpoint with authentication."""
    resp = client.post(
        "/prompts/generate",
        json={"subject": "dog"},
        headers={"Authorization": "Bearer testtoken"},
    )
    assert resp.status_code == 200
    data = resp.json()
    PromptTokens(**data)  # validates schema
    assert data["subject_token"] == "person" 