"""
FastAPI backend for MRI‑tumour detection – fixed version
-------------------------------------------------------
• Loads YOLOv12 weights (yolo12n_2.pt) that sit next to this file
• Accepts POST /predict with multipart‑form image
• Returns JSON {label, confidence}
• Includes /health endpoint for quick status checks
"""

import os
import cv2
import numpy as np
from ultralytics import YOLO
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# ──────────────── FastAPI app ────────────────
app = FastAPI(title="MRI Tumour Detection API")

# Allow the React dev server (both hostnames)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────── Load YOLO model ────────────────
# Ensure the weight file sits in the same folder as this script.
MODEL_FILE = "yolo12n_3.pt"
model_path = os.path.join(os.path.dirname(__file__), MODEL_FILE)
if not os.path.isfile(model_path):
    raise FileNotFoundError(f"❌ Model file not found: {model_path}")

model = YOLO(model_path)
print(f"✅ Loaded model from {model_path}")

# ──────────────── Utility endpoints ────────────────
@app.get("/health")
def health():
    return {"status": "ok"}

# ──────────────── Prediction endpoint ────────────────
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts a single image and returns tumour / healthy + confidence.
    """
    try:
        print(f"📥 Received file: {file.filename}")

        img_bytes = await file.read()
        img_array = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Could not decode image")

        results = model(img, verbose=False)[0]
        tumour_found = len(results.boxes) > 0
        conf = (
            float(results.boxes.conf.max().cpu())
            if tumour_found and results.boxes.conf.numel() > 0
            else 0.0
        )
        label = "tumour" if tumour_found else "healthy"
        print(f"✅ Predicted {label} ({conf:.4f})")

        return JSONResponse({"label": label, "confidence": round(conf, 4)})

    except Exception as e:
        # Log full stack trace in real applications
        print(f"❌ Error in /predict: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})
