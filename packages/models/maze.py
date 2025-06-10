from pydantic import BaseModel


class PromptTokens(BaseModel):
    model_config = {"extra": "forbid"}
    
    subject_token: str
    action_token: str
    environment_token: str
    
    def to_sentence(self) -> str:
        return f"{self.subject_token} {self.action_token} {self.environment_token}"


EXAMPLE_TOKENS = {
    "subject_token": "cat",
    "action_token": "jumps",
    "environment_token": "rooftop"
}


if __name__ == "__main__":
    print(PromptTokens(**EXAMPLE_TOKENS).to_sentence()) 