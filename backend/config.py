from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
# print("Supabase URL:", SUPABASE_URL)
# print("Supabase Key:", SUPABASE_KEY)

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials are missing from the environment.")