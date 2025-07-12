from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from services.ml_service import predict_image
from services.db_service import get_db
import os
import shutil

router = APIRouter()
db = get_db()
# print("[DEBUG] Collections in DB:", db.list_collection_names())
waste_guides = db.wasteguides

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/classify")
async def classify(file: UploadFile = File(...)):
    try:
        # Save the uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        predicted_type, confidence = predict_image(file_path)
        normalized_type = predicted_type.strip().lower()

        print(f"[DEBUG] Predicted: {predicted_type}")
        print(f"[DEBUG] Normalized predicted type: {normalized_type}")

        guide = waste_guides.find_one({
            "$expr": {
                "$eq": [{"$toLower": "$type"}, normalized_type]
            }
        })

        # print("[DEBUG] All types in DB:")
        # for doc in waste_guides.find({}, {"type": 1}):
        #     print(f"- {doc.get('type')}")

        # print(f"[DEBUG] Predicted: {predicted_type}")
        # print(f"[DEBUG] Guide from DB: {guide}")

        # Default fallback values
        instructions = []
        category = "unknown"
        eco_points = 0

        if guide:
            category = guide.get("category", "unknown")
            instructions = guide.get("instructions", [])

            # Set eco points based on category (preferred over boolean flags)
            category_points = {
                "recyclable": 10,
                "biodegradable": 5,
                "hazardous": 2,
                "non-recyclable": 1,
                "unknown": 0
            }
            eco_points = category_points.get(category.lower(), 1)

            # Optionally log category and points
            print(f"[DEBUG] Category: {category}, Eco Points: {eco_points}")
        else:
            print("[DEBUG] No guide found, using defaults.")

        return {
            "type": predicted_type,
            "confidence": round(confidence, 2),
            "filename": file.filename,
            "instructions": instructions,
            "category": category,
            "pointsEarned": eco_points
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
