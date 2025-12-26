from pydantic import BaseModel
from typing import List

# Request Model
class FoodRequest(BaseModel):
    food_name: str

# Response Models
class RecipeResponse(BaseModel):
    food: str
    background: str
    ingredients: List[str]

class VideoResponse(BaseModel):
    title: str
    url: str
    thumbnail: str
    duration: str