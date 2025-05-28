#Server file
from backend.config import SUPABASE_KEY, SUPABASE_URL
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from backend.utils.inference import load_model, predict
from supabase import create_client
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
if SUPABASE_URL is None or SUPABASE_KEY is None:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must not be None")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

if supabase is None:
    raise ValueError("Failed to create Supabase client. Check your credentials.")
else:
    print("Supabase client created successfully.")

