from .routers.prompts import router as prompts_router
from .factory import create_app

app = create_app()
app.include_router(prompts_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 