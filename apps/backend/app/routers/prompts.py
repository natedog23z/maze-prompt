from fastapi import APIRouter, Depends, HTTPException
from typing import Any, Dict, Optional

from packages.agents import SubjectAgent
from packages.models import PromptTokens
from ..dependencies.auth import get_optional_user

router = APIRouter(prefix="/prompts", tags=["prompts"])


@router.post("/generate", response_model=PromptTokens)
async def generate_prompt(
    context: Dict[str, Any] = {},
    user: Optional[Dict] = Depends(get_optional_user)
) -> PromptTokens:
    """
    Generate a prompt using the SubjectAgent.
    
    Args:
        context: Optional context data for the prompt generation
        user: Optional authenticated user information
        
    Returns:
        PromptTokens containing subject, action, and environment tokens
    """
    try:
        # Initialize the SubjectAgent
        agent = SubjectAgent()
        
        # Add user info to context if available
        if user:
            context["user"] = user
        
        # Call the agent to generate tokens
        result = await agent.run(context)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate prompt: {str(e)}") 