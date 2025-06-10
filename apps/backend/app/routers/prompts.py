from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from packages.agents.subject import SubjectAgent
from packages.models.maze import PromptTokens

from ..deps import get_current_user

router = APIRouter(prefix="/prompts", tags=["prompts"])

class GenerateRequest(BaseModel):
    subject: Optional[str] = None

@router.post("/generate", response_model=PromptTokens)
async def generate_prompt(body: GenerateRequest, user=Depends(get_current_user)):
    """Generate a prompt using the SubjectAgent."""
    agent = SubjectAgent()
    context = {"subject": body.subject} if body.subject else {}
    result = await agent.run(context)
    return result 