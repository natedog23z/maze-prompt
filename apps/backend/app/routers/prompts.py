from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from packages.agents.subject import SubjectAgent
from packages.models.maze import PromptTokens

from ..deps import get_current_user

router = APIRouter(prefix="/prompts", tags=["prompts"])

class GenerateRequest(BaseModel):
    subject: str | None = None

@router.post("/generate", response_model=PromptTokens)
def generate_prompt(body: GenerateRequest, user=Depends(get_current_user)):
    """Generate a prompt using the SubjectAgent."""
    agent = SubjectAgent(subject_input=body.subject)
    result = agent({"schema": PromptTokens})
    return PromptTokens(**result) 