from typing import Any, Dict, Optional

from packages.models.maze import PromptTokens

from .base import MazeAgent


class SubjectAgent(MazeAgent[PromptTokens]):
    """Agent responsible for generating subject tokens for prompts.
    
    This agent provides the subject part of the prompt structure.
    """
    
    def __init__(self, subject_input: Optional[str] = None):
        """Initialize the SubjectAgent with PromptTokens model.
        
        Args:
            subject_input: Optional subject to use for token generation
        """
        super().__init__(PromptTokens)
        self.subject_input = subject_input
    
    async def run(self, context: Dict[str, Any]) -> PromptTokens:
        """Run the agent to generate a subject token.
        
        Args:
            context: Dictionary containing context for generating the subject
            
        Returns:
            PromptTokens instance with the generated tokens
        """
        # Use subject_input if available, otherwise use default
        subject = self.subject_input or "person"
        
        # For now, this is a stub that returns fixed tokens with the provided subject
        return PromptTokens(
            subject_token=subject,
            action_token="walks",
            environment_token="forest"
        )
    
    def __call__(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """Synchronous version of run for compatibility with Prompt 3.3.
        
        Args:
            options: Dictionary containing options like schema
            
        Returns:
            Dictionary with token values
        """
        # Use subject_input if available, otherwise use default
        subject = self.subject_input or "person"
        
        # Return fixed tokens as dict with the provided subject
        return {
            "subject_token": subject,
            "action_token": "walks",
            "environment_token": "forest"
        } 