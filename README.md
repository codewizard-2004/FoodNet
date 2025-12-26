# FoodNet-RAG Server

A high-performance, lightweight microservice built with **FastAPI** and **LangChain**. This server provides Retrieval-Augmented Generation (RAG) capabilities to fetch detailed food recipes and context-aware cooking videos.

It is designed to run alongside the main FoodNet CNN prediction server, offloading heavy NLP and external API tasks.

## 🚀 Features

* **RAG Engine:** Uses **Google Gemini 1.5 Flash** and **Pinecone** (Serverless) to retrieve accurate recipe details from local Markdown knowledge bases.
* **Smart Indexing:** Auto-detects new data, initializes vector indexes, and handles API rate limits (Safe Mode) gracefully.
* **Structured Output:** Guarantees strict JSON responses for ingredients and instructions using Pydantic models.
* **Video Integration:** Fetches top-rated cooking tutorials from YouTube without requiring a paid API key.
* **Modern Stack:** Built with `uv` for lightning-fast dependency management and **Python 3.11**.

## 🛠️ Tech Stack

* **Framework:** FastAPI + Uvicorn
* **LLM & Embeddings:** Google Gemini (`gemini-1.5-flash`, `text-embedding-004`)
* **Vector Database:** Pinecone (Serverless)
* **Orchestration:** LangChain (v0.3+)
* **Package Manager:** uv

---

## ⚙️ Setup & Installation

### Prerequisites
* Python 3.11+
* [uv](https://github.com/astral-sh/uv) installed
* API Keys for Google Gemini and Pinecone

### 1. Clone & Install
```bash
git clone [https://github.com/your-username/foodnet-rag.git](https://github.com/your-username/foodnet-rag.git)
cd foodnet-rag

# Install dependencies and sync virtual environment
uv sync
```
### 2. Environment Variables
Create a .env file in the root directory:

```bash
GOOGLE_API_KEY=your_google_ai_key
PINECONE_API_KEY=your_pinecone_key
```

### 3. Prepare Data
Place your knowledge base files (Markdown format) in the data/ folder.

- data/pizza.md
- data/sushi.md
- ...

### 4. Run Locally
```bash
uv run app/main.py
```
The server will start at http://localhost:8000. On the first run, it will automatically index your data into Pinecone.

### 📂 Project Structure
```
foodnet-rag/
├── app/
│   ├── api/
│   │   └── routes.py         # API Endpoints
│   ├── core/
│   │   └── config.py         # Settings & Env Vars
│   ├── services/
│   │   ├── rag_service.py    # LangChain & Pinecone Logic
│   │   └── youtube_service.py# YouTube Scraper
│   ├── schemas.py            # Pydantic Data Models
│   └── main.py               # Application Entry Point
├── data/                     # Markdown Knowledge Base
├── pyproject.toml            # Dependencies
└── README.md
```
### 📡 API Documentation
#### 1. Get Recipe Details (RAG)
Retrieves structured ingredients and instructions based on the knowledge base.

* Endpoint: POST /api/recipe

Body:

```JSON
{
  "food_name": "Sushi"
}
```
Response:
```JSON
{
  "food": "Sushi",
  "ingredients": [
    "Sushi rice",
    "Nori sheets",
    "Fresh fish (salmon or tuna)"
  ],
  "instructions": [
    "Wash the rice thoroughly.",
    "Cook rice and season with vinegar.",
    "Roll the ingredients in nori."
  ]
}
```

#### 2. Get Cooking Video
Fetches the most relevant YouTube tutorial.

* Endpoint: POST /api/video

Body:

```JSON
{
  "food_name": "Sushi"
}
```
Response:
```JSON
{
  "title": "How to Make Sushi at Home",
  "url": "[https://www.youtube.com/watch?v=](https://www.youtube.com/watch?v=)...",
  "thumbnail": "[https://img.youtube.com/](https://img.youtube.com/)...",
  "duration": "10:45"
}
```
