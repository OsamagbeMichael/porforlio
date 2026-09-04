import os

from dotenv import load_dotenv
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from generative import generate_wallpaper
from stats import get_writing_stats

load_dotenv()

API_URL = os.getenv("API_URL", "http://localhost:4000")
CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:5173")

app = FastAPI(title="portfolio-art-service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGIN],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/wallpaper.svg")
def wallpaper(seed: str = "default"):
    svg = generate_wallpaper(seed=seed)
    return Response(content=svg, media_type="image/svg+xml")


@app.get("/stats/writing")
async def writing_stats():
    return await get_writing_stats(API_URL)
