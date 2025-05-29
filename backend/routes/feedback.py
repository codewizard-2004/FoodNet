from fastapi import APIRouter, HTTPException, Form, File, UploadFile
from backend.supabase_client import get_supabase_client
from fastapi.responses import JSONResponse
import os
from uuid import uuid4

router = APIRouter()
BUCKET = os.getenv("SUPABASE_BUCKET")

@router.post("/feedback")
async def submit_feedback(
    model_name:str = Form(...),
    image: UploadFile = File(...),
    predicted: str = Form(...),
    response: str = Form(...),
):
    try:
        if not image.content_type.startswith('image/'):#type: ignore
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")
        
        file_ext = image.filename.split('.')[-1] # type: ignore
        image_id = f"{uuid4()}.{file_ext}"
        file_path = f"feedback/{image_id}"


        contents = await image.read()
        
        #upload the image to Supabase
        supabase = get_supabase_client()
        supabase.storage.from_(BUCKET).upload(file_path, contents, {"content-type": image.content_type}) # type: ignore

        # Get the public URL of the uploaded file
        file_url = supabase.storage.from_(BUCKET).get_public_url(file_path) # type: ignore
        # Safely extract the public URL
        public_url = None
        if isinstance(file_url, dict):
            public_url = file_url.get("data", {}).get("publicUrl")
        elif hasattr(file_url, "public_url"):
            public_url = file_url.public_url # type: ignore
        elif isinstance(file_url, str):
            public_url = file_url
        else:
            public_url = None

        supabase.table("feedback").insert({
            "model": model_name,
            "predicted": predicted,
            "response": response,
            "image": public_url # type: ignore
        }).execute()

        return JSONResponse({
            "success": True,
            "message": "Feedback received successfully",
            "model_name": model_name,
            "predicted": predicted,
            "response": response,
            "file_path": file_path
        })

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error at feedback route: {str(e)}")