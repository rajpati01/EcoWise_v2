from fastapi import APIRouter
from services.db_service import get_db

router = APIRouter()
db = get_db()
waste_guides = db.wasteguides

@router.get("/")
def read_root():
    return {"message": "FastAPI is running ✅"}

@router.get("/test-db")
def test_db_connection():
    try:
        guide = waste_guides.find_one()
        if guide:
            return {
                "message": "DB Connected",
                "sample_guide": {
                    "type": guide.get("type"),
                    "category": guide.get("category")
                }
            }
        else:
            return {"message": "DB connected but no data in wasteguides"}
    except Exception as e:
        return {"error": str(e)}
