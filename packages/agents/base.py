from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, TypeVar, Generic, Type, cast
import json
import time
from pydantic import BaseModel, ValidationError

T = TypeVar('T', bound=BaseModel)


class MazeAgent(Generic[T], ABC):
    """Base class for all Maze agents.
    
    Each agent is responsible for handling a specific aspect of prompt generation.
    Agents should implement the run method to perform their specific task.
    """
    
    def __init__(self, model_class: Type[T]):
        """Initialize the agent with the expected response model class.
        
        Args:
            model_class: The Pydantic model class that the agent's response should conform to
        """
        self.model_class = model_class
    
    @abstractmethod
    async def run(self, context: Dict[str, Any]) -> T:
        """Run the agent with the given context.
        
        This method should be implemented by all subclasses to perform 
        the agent's specific task.
        
        Args:
            context: Dictionary containing context for the agent
            
        Returns:
            An instance of the agent's response model
        """
        pass
    
    async def run_with_retries(
        self,
        context: Dict[str, Any],
        max_retries: int = 3,
        backoff_factor: float = 0.5,
        validate_json: bool = True
    ) -> T:
        """Run the agent with automatic retries and JSON validation.
        
        Args:
            context: Dictionary containing context for the agent
            max_retries: Maximum number of retry attempts
            backoff_factor: Factor to increase delay between retries
            validate_json: Whether to validate and parse the JSON response
            
        Returns:
            An instance of the agent's response model
            
        Raises:
            Exception: If all retries fail
        """
        last_error = None
        
        for attempt in range(max_retries):
            try:
                result = await self.run(context)
                
                if validate_json:
                    # Ensure the result is a valid instance of the model_class
                    if not isinstance(result, self.model_class):
                        # If we got a dict or string, try to parse it
                        if isinstance(result, dict):
                            return self.model_class.model_validate(result)
                        elif isinstance(result, str):
                            # Try to parse as JSON
                            try:
                                data = json.loads(result)
                                return self.model_class.model_validate(data)
                            except json.JSONDecodeError as e:
                                raise ValueError(f"Invalid JSON: {e}")
                        else:
                            expected = self.model_class.__name__
                            got = type(result).__name__
                            raise TypeError(f"Expected {expected}, got {got}")
                
                return result
            
            except (ValidationError, json.JSONDecodeError, ValueError, TypeError) as e:
                last_error = e
                
                # Calculate backoff time
                backoff_time = backoff_factor * (2 ** attempt)
                time.sleep(backoff_time)
                
                continue
        
        # If we get here, all retries failed
        raise Exception(f"Failed after {max_retries} attempts. Last error: {last_error}") 