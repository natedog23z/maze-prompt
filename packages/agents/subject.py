from typing import Any, Dict
from .base import MazeAgent
from packages.models import PromptTokens


class SubjectAgent(MazeAgent[PromptTokens]):
    """Agent responsible for generating subject tokens for prompts.
    
    This agent provides the subject part of the prompt structure.
    """
    
    def __init__(self):
        """Initialize the SubjectAgent with PromptTokens model."""
        super().__init__(PromptTokens)
    
    async def run(self, context: Dict[str, Any]) -> PromptTokens:
        """Run the agent to generate a subject token.
        
        Args:
            context: Dictionary containing context for generating the subject
            
        Returns:
            PromptTokens instance with the generated tokens
        """
        # For now, this is a stub that returns fixed tokens
        return PromptTokens(
            subject_token="person",
            action_token="walks",
            environment_token="forest"
        ) 