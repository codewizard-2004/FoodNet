from fastapi import APIRouter, HTTPException
from app.schemas import FoodRequest, RecipeResponse, VideoResponse
from app.services.rag_service import rag_service
from app.services.youtube_service import get_cooking_videos

router = APIRouter()

@router.post("/recipe", response_model=RecipeResponse)
async def get_recipe_details(request: FoodRequest):
    """
    Endpoint 1: Returns structured recipe data (JSON) using RAG.
    """
    try:
        # Returns the Pydantic object directly
        recipe_data = await rag_service.get_recipe(request.food_name)
        return recipe_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/video", response_model=VideoResponse)
async def get_food_video(request: FoodRequest):
    """
    Endpoint 2: Returns the best matching YouTube video.
    """
    video_data = get_cooking_videos(request.food_name)
    
    if not video_data:
        raise HTTPException(status_code=404, detail="No video found")
        
    return video_data