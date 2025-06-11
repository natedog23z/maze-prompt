from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from packages.agents.subject import SubjectAgent

from ..deps import get_current_user
from ..models.prompts import PromptTokens

router = APIRouter(prefix="/prompts", tags=["prompts"])

class GenerateRequest(BaseModel):
    subject: Optional[str] = None

@router.post("/generate", response_model=PromptTokens)
def generate_prompt(body: GenerateRequest, user=Depends(get_current_user)):
    """Generate a prompt using the SubjectAgent."""
    agent = SubjectAgent(subject_input=body.subject)
    result = agent({"schema": PromptTokens})
    return PromptTokens(**result) 