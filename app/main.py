#Server file
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io
from PIL import Image

from app.model_manager import ModelManager
from app.preprocessing import preprocess
from app.inference import run_inference
# from app.memory import get_memory_mb

app = FastAPI(
    title = "FoodVision API",
    description = "API for food image classification",
    version = "1.0.0"
)

# create model manager instance
model_manager = ModelManager()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASSES = ["pizza", "steak", "sushi"]

@app.get("/")
async def root():
    return {"status": "ok"}

@app.post("/predict/{model_name}")
async def predict(
    model_name: str,
    file: UploadFile = File(...)):
    """
    Predict the class of the image using the specified model.
    Args:
        model_name (str): Name of the model to use for prediction.
        file (UploadFile): Image file to be predicted.
    Returns:
        list: list containing probabilities of each class.
    """
    # ---- Load image safely ----
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to load image: " + str(e))
    
    # ---- load the model ----
    try:
        session = model_manager.load(model_name)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to load model: " + str(e))
    
    # ---- preprocess the image ----
    try:
        input_array = preprocess(image, model_name)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to preprocess image: " + str(e))
    
    # ---- run inference ----
    try:
        pred_index, probs = run_inference(session, input_array)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to run inference: " + str(e))
    
    return {
        "model": model_name,
        "prediction": CLASSES[pred_index],
        "confidence": float(probs[pred_index]),
        "probabilities":{
            CLASSES[i]: float(probs[i]) for i in range(len(CLASSES))
        }
    }

# @app.get("/memory")
# def memory_usage():
#     return {
#         "memory_mb": round(get_memory_mb(), 2)
#     }



