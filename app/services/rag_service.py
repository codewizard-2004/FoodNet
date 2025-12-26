import os
import glob
import time
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.documents import Document
from pinecone import Pinecone, ServerlessSpec
from app.core.config import settings
from app.schemas import RecipeResponse

class RAGService:
    def __init__(self):
        self.vectorstore = None
        self.llm = ChatGoogleGenerativeAI(model=settings.LLM_MODEL, temperature=0)
        self.embeddings = GoogleGenerativeAIEmbeddings(model=settings.EMBEDDING_MODEL)

    def _load_documents(self):
        docs = []
        if not os.path.exists(settings.DATA_PATH):
            os.makedirs(settings.DATA_PATH)
            
        files = glob.glob(os.path.join(settings.DATA_PATH, "*.md"))
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        
        for fpath in files:
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
                chunks = splitter.split_text(content)
                for chunk in chunks:
                    docs.append(Document(page_content=chunk, metadata={"source": fpath}))
        return docs

    # ... inside RAGService class ...

    async def initialize(self):
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        index_name = settings.INDEX_NAME

        # 1. Create Index if missing
        existing_indexes = [i.name for i in pc.list_indexes()]
        if index_name not in existing_indexes:
            print(f"Creating index: {index_name}")
            pc.create_index(
                name=index_name,
                dimension=768, 
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
            while not pc.describe_index(index_name).status['ready']:
                time.sleep(1)
        
        # 2. Connect
        print(f"Connecting to index: {index_name}")
        self.vectorstore = PineconeVectorStore(
            index_name=index_name, 
            embedding=self.embeddings
        )

        # 3. Check & Index Data
        try:
            index_stats = pc.Index(index_name).describe_index_stats()
            if index_stats['total_vector_count'] == 0:
                print("Index is empty. Loading documents...")
                docs = self._load_documents()
                
                if docs:
                    # Batch size 1 + Sleep is safer
                    print(f"Found {len(docs)} chunks. Indexing...")
                    for i, doc in enumerate(docs):
                        try:
                            # Add 1 doc at a time
                            self.vectorstore.add_documents([doc])
                            print(f"Indexed chunk {i+1}/{len(docs)}")
                            time.sleep(1.5) # Short sleep to avoid RPM limit
                        except Exception as e:
                            if "429" in str(e):
                                print(f"⚠️ QUOTA EXHAUSTED on chunk {i+1}. Stopping indexing.")
                                print("The server will start, but RAG results might be incomplete.")
                                break # STOP loop, but let server start
                            else:
                                print(f"Error on chunk {i+1}: {e}")
            else:
                print(f"Index ready. Total vectors: {index_stats['total_vector_count']}")
                
        except Exception as e:
            print(f"⚠️ Initialization Warning: {e}")
            print("Server starting without full RAG initialization.")

    async def get_recipe(self, food_name: str) -> RecipeResponse:
        if not self.vectorstore:
            await self.initialize()

        retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})
        structured_llm = self.llm.with_structured_output(RecipeResponse)

        template = """You are a chef. Use the context provided to extract the recipe details for {food_name}.
        Context: {context}
        Extract the exact name, ingredients list, and instruction steps.
        If information is missing, add some context to it."""
        
        prompt = ChatPromptTemplate.from_template(template)
        
        chain = (
            {"context": retriever, "food_name": RunnablePassthrough()}
            | prompt
            | structured_llm
        )
        
        return chain.invoke(food_name)

rag_service = RAGService()