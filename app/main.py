from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(
    title="CV-Job Matcher API",
    description="AI-powered platform that matches job seekers to relevant jobs using semantic search and RAG.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://matchicv.netlify.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to CV-Job Matcher API"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    # Disable reload in production for better performance
    reload = os.environ.get("RENDER") is None
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=reload)
