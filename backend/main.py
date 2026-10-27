"""
SkillSync AI — Resume Intelligence & Career Growth Platform
FastAPI Backend Application Entrypoint
"""
import os
import sys
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load backend/.env if exists without external dotenv library
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip()

from backend.app.routes.api import router as api_router
from backend.app.storage.database import init_db

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("skillsync")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing SkillSync AI storage and NLP models...")
    init_db()
    logger.info("SkillSync AI backend is ready and operational.")
    yield
    logger.info("SkillSync AI backend shutting down.")

app = FastAPI(
    title="SkillSync AI — Resume Intelligence & Career Growth Platform API",
    description="REST API for parsing resumes, extracting technical skills, computing semantic match scores, and generating personalized learning roadmaps.",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)

# Locate dist/ for frontend assets
dist_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/")
def root(accept: str = Header(default="application/json")):
    # If requested by a web browser, serve the single-page application
    if "text/html" in accept and os.path.exists(os.path.join(dist_dir, "index.html")):
        return FileResponse(os.path.join(dist_dir, "index.html"))
    return {
        "app": "SkillSync AI — Resume Intelligence & Career Growth Platform",
        "status": "online",
        "version": "2.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "skillsync-ai"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
