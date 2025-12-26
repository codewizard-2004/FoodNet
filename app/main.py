### This is the main server file for the foodnet RAG system
### The system uses FastAPI to create a REST API for the foodnet RAG system
### The system uses gemini-2.5-flash to generate responses
### The system uses ChromaDB to store the documents
### The system uses LangChain to create pipelines for document processing

from fastapi import FastAPI
from app.api.routes import router
from app.services.rag_service import rag_service
from contextlib import asynccontextmanager
import psutil
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load RAG system
    print("Initializing RAG Service...")
    await rag_service.initialize()
    yield
    # Shutdown: Clean up if needed
    print("Shutting down...")

app = FastAPI(
    title="FoodNet RAG System",
    description="FoodNet RAG System",
    version="1.0.0",
    lifespan=lifespan
)

def get_memory_mb() -> float:
    process = psutil.Process(os.getpid())
    mem_bytes = process.memory_info().rss
    return mem_bytes / (1024 ** 2)


@app.get("/")
def health_check():
    return {
        "status": "ok", 
        "version": "1.0.0",
        "service": "FoodNet RAG System",
        "memory": f"{round(get_memory_mb(), 2)} MB",
        "routes": [
            {
                "method": "POST",
                "path": "/api/recipe",
                "description": "Generate information for a given food item."
            },
            {
                "method": "GET",
                "path": "/api/nutrition",
                "description": "Get nutrition information for a given food item."
            },
            {
                "method":"POST",
                "path": "/api/save",
                "description": "Save incorrect prediction to database"
            }
        ]
    }

app.include_router(router, prefix="/api")