from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import os
import uuid
import sqlite3
from twilio.rest import Client

app = Flask(__name__)
CORS(app)

model = YOLO("best.pt")

UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "static/results"
DB_NAME = "database.db"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

# ==============================
# DATABASE SETUP
# ==============================
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS detections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        count INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()

def insert_detection(data_type, count):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO detections (type, count) VALUES (?, ?)",
        (data_type, count)
    )

    conn.commit()
    conn.close()

def get_total_count():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT SUM(count) FROM detections")
    total = cursor.fetchone()[0]

    conn.close()
    return total if total else 0

init_db()

# ==============================
# TWILIO CONFIG (FILL YOUR DATA)
# ==============================
ACCOUNT_SID = "ACacd5e1a449bb3bfeab54dd34063cce51"
AUTH_TOKEN = "e4eb4eb28526b1e87fb9a78e5868129a"
FROM_WHATSAPP = "whatsapp:+14155238886"
TO_WHATSAPP = "whatsapp:+916367442723"

THRESHOLD = 3  # 🔥 change this

def send_whatsapp_alert(total):
    try:
        client = Client(ACCOUNT_SID, AUTH_TOKEN)

        message = client.messages.create(
            body=f"🚨 Garbage Alert! Total waste detected: {total}",
            from_=FROM_WHATSAPP,
            to=TO_WHATSAPP
        )

        print("✅ WhatsApp alert sent:", message.sid)

    except Exception as e:
        print("❌ WhatsApp error:", e)

def check_threshold():
    total = get_total_count()

    # 🔥 Avoid spam (only trigger occasionally)
    if total >= THRESHOLD and total % THRESHOLD < 10:
        send_whatsapp_alert(total)

# ==============================
# IMAGE DETECTION
# ==============================
@app.route("/detect", methods=["POST"])
def detect():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    img_id = str(uuid.uuid4())

    ext = image_file.filename.split('.')[-1].lower()
    img_path = f"{UPLOAD_FOLDER}/{img_id}.{ext}"
    result_path = f"{RESULT_FOLDER}/{img_id}.jpg"

    image_file.save(img_path)

    img = cv2.imread(img_path)
    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    results = model.predict(source=img, verbose=False)[0]

    garbage_count = 0
    detected_classes = []

    for box in results.boxes:
        garbage_count += 1
        cls_id = int(box.cls[0])
        label = results.names[cls_id]
        detected_classes.append(label)

        x1, y1, x2, y2 = map(int, box.xyxy[0])
        confidence = float(box.conf[0])

        cv2.rectangle(img, (x1, y1), (x2, y2), (0,255,0), 2)
        cv2.putText(img, f"{label} {confidence:.2f}",
                    (x1, y1 - 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                    (0,255,0), 2)

    cv2.putText(img, f"Count: {garbage_count}", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 3)

    cv2.imwrite(result_path, img)

    # ✅ SAVE TO DB
    insert_detection("image", garbage_count)
    check_threshold()

    return jsonify({
        "garbage_count": garbage_count,
        "classes": detected_classes,
        "result_image_url": f"http://127.0.0.1:5000/{result_path}"
    })

# ==============================
# VIDEO DETECTION
# ==============================
@app.route("/detect_video", methods=["POST"])
def detect_video():
    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400

    video_file = request.files["video"]
    vid_id = str(uuid.uuid4())

    ext = video_file.filename.split('.')[-1].lower()
    input_path = f"{UPLOAD_FOLDER}/{vid_id}.{ext}"
    output_path = f"{RESULT_FOLDER}/{vid_id}.mp4"

    video_file.save(input_path)

    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        return jsonify({"error": "Cannot open video"}), 500

    fps = cap.get(cv2.CAP_PROP_FPS) or 24
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc = cv2.VideoWriter_fourcc(*"avc1")
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    total_detections = 0
    frame_count = 0
    detected_classes = []

    while True:
        ret, frame = cap.read()
        if not ret or frame is None:
            break

        frame_count += 1

        results = model.predict(source=frame, imgsz=512, conf=0.3, verbose=False)[0]

        count = len(results.boxes) if results.boxes is not None else 0
        total_detections = max(total_detections, count)

        if results.boxes is not None:
            for box in results.boxes:
                cls_id = int(box.cls[0])
                label = results.names[cls_id]
                detected_classes.append(label)

        annotated = results.plot()

        cv2.putText(
            annotated,
            f"Frame: {frame_count} Count: {count}",
            (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2
        )

        out.write(annotated)

    cap.release()
    out.release()

    detected_classes = list(set(detected_classes))

    # ✅ SAVE TO DB
    insert_detection("video", total_detections)
    check_threshold()

    return jsonify({
        "total_detections": total_detections,
        "frames_processed": frame_count,
        "classes": detected_classes,
        "output_video_url": f"http://127.0.0.1:5000/static/results/{vid_id}.mp4?{uuid.uuid4()}"
    })

# ==============================
# RUN
# ==============================
if __name__ == "__main__":
    app.run(debug=True)