import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    APP_NAME: str = "FoodNet Rag System"
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    INDEX_NAME = "food-rag-gemini"
    LLM_MODEL = "gemini-2.5-flash"
    EMBEDDING_MODEL = "models/text-embedding-004"
    DATA_PATH = "./data"

settings = Settings()