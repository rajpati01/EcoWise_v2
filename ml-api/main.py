from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.classify import router as classify_router
from routes.base import router as base_router

app = FastAPI()

# Allow CORS (adjust origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(base_router)
app.include_router(classify_router, prefix="/api")
