from fastapi import FastAPI

from .routers import prompts


def create_app() -> FastAPI:
    app = FastAPI(title="Maze API", version="0.1.0")
    
    # Include routers
    app.include_router(prompts.router)
    
    @app.get("/health")
    async def health_check():
        return {"status": "ok"}
    
    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 