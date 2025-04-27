from ultralytics import YOLO
import cv2, numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MRI tumour API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("best.pt")      # ← YOLO handles device & eval mode

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img_bytes = await file.read()
    nparr     = np.frombuffer(img_bytes, np.uint8)
    img       = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results   = model(img, verbose=False)   # list with one element
    res       = results[0]

    tumour_found = len(res.boxes) > 0
    conf = float(res.boxes.conf.max().cpu()) if tumour_found else 0.0
    label = "tumour" if tumour_found else "healthy"
    return JSONResponse({"label": label, "confidence": round(conf, 4)})
