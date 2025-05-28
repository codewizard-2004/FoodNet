# supabase_client.py

from supabase import create_client, Client
from backend.config import SUPABASE_URL, SUPABASE_KEY

if SUPABASE_URL is None or SUPABASE_KEY is None:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must not be None")

_supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_supabase_client() -> Client:
    """
    Return a singleton Supabase client instance.
    """
    return _supabase
