from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from PIL import Image
from fastapi.responses import JSONResponse
from backend.utils.inference import load_model, predict
import io

router = APIRouter()

@router.post("/predict")
async def predict_image(
    file: UploadFile = File(...),
    model_name: str = Form(...),
):
    try:
        if not file.content_type.startswith('image/'): # type: ignore
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
        
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image file.")
        
        model = load_model(model_name, device="cpu")  # Change to "cuda" if using GPU
        class_name, confidence_scores = predict(model, image)

        return JSONResponse({
            "success": True,
            "model": model_name,
            "class_name": class_name,
            "confidence_scores": confidence_scores
        })
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=404 , detail="Internal server error "+str(e))
