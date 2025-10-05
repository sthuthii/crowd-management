import torch
from PIL import Image
import torchvision.transforms as T
import cv2
from pathlib import Path

# Relative import of CSRNet from the same folder
from app.services.csrnet_models import CSRNet  

# -------------------- Device --------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# -------------------- Model Path --------------------
# Updated to use weights.pth inside models folder
model_path = Path(__file__).parent.parent / "models" / "weights.pth"

# -------------------- Load Model (Safe Loading) --------------------
model = CSRNet()

if not model_path.exists():
    print(f"[Warning] ⚠️ Model file not found at {model_path}. Skipping model loading for now.")
    model = None
else:
    try:
        model.load_state_dict(torch.load(model_path, map_location=device))
        model.to(device)
        model.eval()
        print("[Info] ✅ Model loaded successfully.")
    except Exception as e:
        print(f"[Error] ❌ Failed to load model: {e}")
        model = None

# -------------------- Image Transform --------------------
transform = T.Compose([
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225])
])

# -------------------- Predict Crowd in Image --------------------
def predict_image_file(file_path: str) -> int:
    if model is None:
        print("[Warning] No model loaded. Returning dummy count 0.")
        return 0

    img = Image.open(file_path).convert("RGB")
    img_tensor = transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(img_tensor)
        count = int(output.detach().cpu().sum().numpy())
    return count

# -------------------- Predict Crowd in Video --------------------
def predict_frame_from_video(video_path: str, out_path: str):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise Exception("Cannot open video file.")

    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    out = cv2.VideoWriter(out_path, fourcc, fps, (width, height))

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if model is not None:
            img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            img_tensor = transform(img).unsqueeze(0).to(device)

            with torch.no_grad():
                output = model(img_tensor)
                count = int(output.detach().cpu().sum().numpy())
        else:
            count = 0  # Dummy fallback when model not loaded

        cv2.putText(frame, f"Crowd: {count}", (20, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 3)
        out.write(frame)

    cap.release()
    out.release()
