from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .deps import get_current_user

def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="Maze API",
        description="Backend API for the Maze application",
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
    from app.routers import health, prompts
    app.include_router(health.router)
    app.include_router(prompts.router)

    @app.get("/ping")
    def ping(user=Depends(get_current_user)):
        """Ping endpoint that requires authentication."""
        return {"ping": "pong", "user": user["user_id"]}

    return app 