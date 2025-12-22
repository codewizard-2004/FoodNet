from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

#from app.rag.chain import get_rag_chain

router = APIRouter()

class RecipeRequest(BaseModel):
    food: str

class RecipeResponse(BaseModel):
    food: str
    instructions: str
    ingredients: list[str]

@router.get("/recipe", response_model=RecipeResponse)
def generate_recipe(request: RecipeRequest):
    """
    Generate grounded preparation instructions for a given food item.
    """

    food_label = request.food.lower().strip()

    if not food_label:
        raise HTTPException(status_code=400, detail="Food item cannot be empty")

    try:
        # rag_chain = get_rag_chain()
        # instructions = rag_chain.invoke({"food": food_label})
        print("Generating recipe for", food_label)
        return {
            "food": food_label,
            "instructions": "Step 1: Preheat oven. Step 2: Cook.",
            "ingredients": ["Salt", "Pepper", "Main Item"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail = "Failed to generate recipe\n"+ str(e))
        
        
    