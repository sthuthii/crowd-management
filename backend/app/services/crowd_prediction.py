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
# Looks for the .pth file in the same folder as this script
model_path = Path(__file__).parent / "crowd_counting.pth"

if not model_path.exists():
    raise FileNotFoundError(f"Model file not found at {model_path}. Please download it!")

# -------------------- Load Model --------------------
model = CSRNet()
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)
model.eval()

# -------------------- Image Transform --------------------
transform = T.Compose([
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225])
])

# -------------------- Predict Crowd in Image --------------------
def predict_image_file(file_path: str) -> int:
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

        img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        img_tensor = transform(img).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(img_tensor)
            count = int(output.detach().cpu().sum().numpy())

        cv2.putText(frame, f"Crowd: {count}", (20,50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0,0,255), 3)
        out.write(frame)

    cap.release()
    out.release()
