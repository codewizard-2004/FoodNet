from fastapi import Form, HTTPException, APIRouter
from fastapi.responses import JSONResponse
from backend.supabase_client import get_supabase_client


router = APIRouter()


@router.get("/nutrients")
def get_nutrients(
    id: int = Form(...)
):
    try:
        if id <= 0 or id > 101:
            raise HTTPException(status_code=400, detail="Invalid food ID. Should be in range 1-101")
        
        #get supabase client
        supabase = get_supabase_client()
        #fetch the nutrients data from the database
        response = supabase.table("Nutrients").select("*").eq("id", id).execute()
        if not response.data: # type: ignore
            raise HTTPException(status_code=500, detail="Error fetching data from the database for id:" + str(id)) # type: ignore
        
        return JSONResponse({
            "success": True,
            "data": response.data[0]  # Assuming the response contains a list with one item
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail="Error at nutrients route:" + str(e))