#Server file
from backend.config import SUPABASE_KEY, SUPABASE_URL
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from backend.utils.inference import load_model, predict
from supabase import create_client
from backend.routes import predict
from backend.routes import feedback
from backend.routes import nutrients
from backend.supabase_client import get_supabase_client
# print("Supabase URL:", SUPABASE_URL)
# print("Supabase Key:", SUPABASE_KEY)
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
client = get_supabase_client()
if client is None:
    raise ValueError("Failed to create Supabase client. Check your credentials.")


app.include_router(predict.router)
app.include_router(feedback.router)
app.include_router(nutrients.router)
