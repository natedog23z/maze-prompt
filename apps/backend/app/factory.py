from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .deps import get_current_user
from .routers import health_router, prompts_router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Maze Prompt API",
        description="API for generating and managing prompts",
        version="0.1.0",
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, replace with specific origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Import and include routers
    app.include_router(health_router)
    app.include_router(prompts_router, prefix="/api/v1")

    @app.get("/ping")
    def ping(user=Depends(get_current_user)):
        """Health check endpoint that requires authentication."""
        return {"ping": "pong", "user": user["user_id"]}

    return app 