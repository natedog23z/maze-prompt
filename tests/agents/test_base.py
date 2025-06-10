import json
from typing import Any, Dict

import pytest
from pydantic import BaseModel

from packages.agents.base import MazeAgent


class TestModel(BaseModel):
    """Test model for agent tests."""
    value: str


class FailingAgent(MazeAgent[TestModel]):
    """Test agent that fails a certain number of times before succeeding."""
    
    def __init__(self, fail_count=0):
        super().__init__(TestModel)
        self.fail_count = fail_count
        self.current_attempt = 0
    
    async def run(self, context: Dict[str, Any]) -> TestModel:
        self.current_attempt += 1
        if self.current_attempt <= self.fail_count:
            raise ValueError(f"Intentional failure {self.current_attempt}")
        return TestModel(value="success")


class InvalidResponseAgent(MazeAgent[TestModel]):
    """Test agent that returns invalid data types."""
    
    def __init__(self, response_type="valid"):
        super().__init__(TestModel)
        self.response_type = response_type
    
    async def run(self, context: Dict[str, Any]) -> Any:
        if self.response_type == "valid":
            return TestModel(value="valid model")
        elif self.response_type == "dict":
            return {"value": "dict response"}
        elif self.response_type == "json_str":
            return json.dumps({"value": "json string"})
        elif self.response_type == "invalid_json":
            return "{invalid json"
        elif self.response_type == "wrong_type":
            return 123
        else:
            return None


@pytest.mark.asyncio
async def test_retry_success():
    """Test that retry succeeds after failures."""
    agent = FailingAgent(fail_count=2)
    result = await agent.run_with_retries({}, max_retries=3)
    assert result.value == "success"
    assert agent.current_attempt == 3


@pytest.mark.asyncio
async def test_retry_max_attempts_exceeded():
    """Test that retry throws exception after max attempts."""
    agent = FailingAgent(fail_count=4)
    with pytest.raises(Exception) as exc_info:
        await agent.run_with_retries({}, max_retries=3)
    assert "Failed after 3 attempts" in str(exc_info.value)
    assert agent.current_attempt == 3


@pytest.mark.asyncio
async def test_validate_json_dict():
    """Test validation of dictionary response."""
    agent = InvalidResponseAgent(response_type="dict")
    result = await agent.run_with_retries({})
    assert isinstance(result, TestModel)
    assert result.value == "dict response"


@pytest.mark.asyncio
async def test_validate_json_string():
    """Test validation of JSON string response."""
    agent = InvalidResponseAgent(response_type="json_str")
    result = await agent.run_with_retries({})
    assert isinstance(result, TestModel)
    assert result.value == "json string"


@pytest.mark.asyncio
async def test_validate_invalid_json():
    """Test validation of invalid JSON response."""
    agent = InvalidResponseAgent(response_type="invalid_json")
    with pytest.raises(Exception) as exc_info:
        await agent.run_with_retries({}, max_retries=1)
    assert "Invalid JSON" in str(exc_info.value)


@pytest.mark.asyncio
async def test_validate_wrong_type():
    """Test validation of wrong response type."""
    agent = InvalidResponseAgent(response_type="wrong_type")
    with pytest.raises(Exception) as exc_info:
        await agent.run_with_retries({}, max_retries=1)
    assert "Expected TestModel, got int" in str(exc_info.value)


@pytest.mark.asyncio
async def test_subject_agent():
    """Test that the SubjectAgent returns the expected tokens."""
    from packages.agents.subject import SubjectAgent
    
    agent = SubjectAgent()
    result = await agent.run({})
    
    assert result.subject_token == "person"
    assert result.action_token == "walks"
    assert result.environment_token == "forest"
    
    # Test the to_sentence method
    assert result.to_sentence() == "person walks forest" 