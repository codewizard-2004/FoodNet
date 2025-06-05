from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from PIL import Image
from fastapi.responses import JSONResponse
from backend.utils.inference import load_model, predict
import io
from backend.supabase_client import get_supabase_client
import torch

router = APIRouter()

device = "cuda" if torch.cuda.is_available() else "cpu"



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
        
        model = load_model(model_name, device=torch.device(device))  # Change to "cuda" if using GPU
        class_name, class_id , confidence_scores = predict(model, model_name, image)

        if class_id < 0 or class_id > 101:
            raise HTTPException(status_code=400, detail="Invalid class ID. Should be in range 0-101")
        print("\nClass\n:"+str(class_id))
        
        supabse = get_supabase_client()
        respose = supabse.table("Nutrients").select("*").eq("id", class_id).execute()
        if not respose.data:  # type: ignore
            raise HTTPException(status_code=404, detail="No data found for the given class ID.")

        return JSONResponse({
            "success": True,
            "model": model_name,
            "class_name": class_name,
            "confidence_scores": confidence_scores,
            "class_id": class_id,
            "nutrients": respose.data[0]
        })
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=404 , detail="Internal server error "+str(e))
