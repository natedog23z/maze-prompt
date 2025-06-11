from pydantic import BaseModel
from typing import Optional


class PromptTokens(BaseModel):
    """Model representing a processed prompt with tokens."""
    model_config = {"extra": "forbid"}
    
    subject_token: str
    action_token: str
    environment_token: str
    
    def to_sentence(self) -> str:
        return f"{self.subject_token} {self.action_token} {self.environment_token}" 