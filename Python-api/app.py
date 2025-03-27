import base64
import cv2
import json
import numpy as np
import dlib
from flask import Flask, request, jsonify
from flask_cors import CORS
from imutils import face_utils
from deepface import DeepFace  # DeepFace for face recognition
from scipy.spatial.distance import cosine
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)
JSON_FILE = "face_data.json"

# Load Face Detector and Landmark Predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("models/shape_predictor_68_face_landmarks.dat")

# Load Haarcascade for face detection
face_classifier = cv2.CascadeClassifier("models/haarcascade_frontalface_default.xml")

# Load LBPH Face Recognizer as fallback
clf = cv2.face.LBPHFaceRecognizer_create()
clf.read("models/classifier.xml")  # Load trained model

# Ensure JSON file exists
if not os.path.exists(JSON_FILE):
    with open(JSON_FILE, "w") as f:
        json.dump({}, f)  # Start with an empty JSON

def get_embedding(image):
    """Extracts face embedding from an image using DeepFace"""
    try:
        embedding = DeepFace.represent(image, model_name="Facenet", enforce_detection=True)[0]["embedding"]
        return np.array(embedding)
    except:
        return None  # Face not detected

def get_average_embedding(image_list):
    """Computes the average embedding from multiple images"""
    embeddings = [get_embedding(img) for img in image_list]
    embeddings = [e for e in embeddings if e is not None]  # Remove failed detections

    if not embeddings:
        return None  # No valid embeddings found

    return np.mean(embeddings, axis=0).tolist()  # Convert to list for JSON storage

def load_embeddings():
    try:
        with open(JSON_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return {}

def save_embeddings(data):
    """Saves embeddings to a JSON file."""
    with open(JSON_FILE, "w") as file:
        json.dump(data, file, indent=4)


@app.route("/is_registered", methods=["POST"])
def is_registered():
    """Checks if a roll number is already registered."""
    """return True if registered, False if not registered"""
    try:
        req = request.json
        id = req.get("rollNo", "").lower()
        if not id:
            return jsonify({"error": "Roll number not provided"}), 400

        face_data = load_embeddings()
        for entry in face_data:
            if entry["rollNo"] == id:
                return jsonify({"registered": True}), 200
        return jsonify({"registered": False}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    

@app.route("/register", methods=["POST"])
def register_user():
    """Receives base64 images, extracts embeddings, and stores in JSON file with duplicate checks."""
    try:
        req = request.json
        print(f"[DEBUG] Received registration request: {req}", flush=True)
        id = req.get("rollNo", "").lower()
        print(f"[DEBUG] Received registration request for ID: {id}", flush=True)
        if not id:
            print("[ERROR] Roll number not provided", flush=True)
            return jsonify({"error": "Roll number not provided"}), 400
    
        
        data = req.get("images", [])

        # data = request.json.get("images", [])  
        if len(data) < 10:
            print("[ERROR] Less than 10 images provided", flush=True)
            return jsonify({"error": "Provide at least 10 images"}), 400

        # Load existing embeddings
        face_data = load_embeddings()
        print(f"[DEBUG] Loaded embeddings, total entries: {len(face_data)}", flush=True)

        if not isinstance(face_data, list):
            print("[WARNING] Face data is not a list, resetting to empty list.", flush=True)
            face_data = []

        # **🔎 Check for duplicate roll number**
        for entry in face_data:
            if entry["rollNo"] == id.lower():
                print(f"[ERROR] Roll number {id.lower()} already exists.", flush=True)
                return jsonify({"error": "Roll number already exists"}), 409

        # Decode images
        image_list = []
        for idx, base64_str in enumerate(data):
            if "," in base64_str:
                base64_str = base64_str.split(",", 1)[1]  # Remove header if exists
            image_bytes = base64.b64decode(base64_str)
            np_arr = np.frombuffer(image_bytes, np.uint8)
            image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            if image is not None:
                image_list.append(image)
            print(f"[DEBUG] Decoded image {idx+1}/{len(data)} successfully.", flush=True)

        # Compute and store embedding
        avg_embedding = get_average_embedding(image_list)
        if avg_embedding is None:
            print("[ERROR] Failed to extract facial features.", flush=True)
            return jsonify({"error": "Failed to extract facial features"}), 500
        print(f"[DEBUG] Computed average face embedding of length: {len(avg_embedding)}", flush=True)

        # **🔎 Check for duplicate face embeddings using cosine similarity**
        threshold = 0.7  # Adjust threshold as needed
        for entry in face_data:
            stored_embedding = np.array(entry["face_embedding"])
            similarity = 1 - cosine(stored_embedding, avg_embedding)

            print(f"[DEBUG] Comparing with stored embedding of rollNo {entry['rollNo']}, Similarity: {similarity:.4f}", flush=True)

            if similarity >= threshold:
                print(f"[ERROR] Face already registered with roll number {entry['rollNo']}. Similarity: {similarity:.4f}", flush=True)
                return jsonify({"error": "Face already registered with another roll number"}), 409

        # **✅ Add new entry**
        new_entry = {
            "rollNo": id.lower(),
            "face_embedding": avg_embedding

        }
        face_data.append(new_entry)
        print(f"[DEBUG] Added new entry for rollNo {id.lower()}. Total entries now: {len(face_data)}", flush=True)

        # Save the updated list
        save_embeddings(face_data)
        print(f"[DEBUG] Successfully saved updated face embeddings.", flush=True)

        return jsonify({"message": "User registered successfully"}), 200

    except Exception as e:
        print(f"[ERROR] Exception occurred: {str(e)}", flush=True)
        return jsonify({"error": str(e)}), 500

def detect_face(image):
    """Detects if a face is present in the image."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5, minSize=(50, 50))
    return len(faces) > 0

def detect_head_movement(image):
    """Detects head movement for liveness detection."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)
    if len(faces) == 0:
        return None
    landmarks = predictor(gray, faces[0])
    landmarks = face_utils.shape_to_np(landmarks)
    return landmarks[30][0]  # Nose tip x-coordinate

def recognize_with_deepface(image, roll_no):
    """Recognizes the face using DeepFace with debug logs."""
    print(f"🔍 Recognizing face for rollNo: {roll_no}",flush=True)  # Debugging

    embeddings = load_embeddings()  # Now it's a list, not a dictionary
    print(f"📂 Loaded embeddings: {len(embeddings)} entries found",flush=True)  # Debugging

    # Search for the roll_no in the list
    stored_embedding = None
    for entry in embeddings:
        print(f"🔎 Checking entry: {entry['rollNo']}",flush=True)  # Debugging
        if entry["rollNo"] == roll_no:  # Match rollNo
            stored_embedding = np.array(entry["face_embedding"])
            print(f"✅ Found stored embedding for {roll_no}",flush=True)  # Debugging
            break  # Stop searching once found

    if stored_embedding is None:
        print("❌ No face embedding found for this user.",flush=True)  # Debugging
        return False, None, "No face embedding found for this user."

    if not detect_face(image):
        print("⚠️ No face detected in the provided image.",flush=True)  # Debugging
        return False, None, "No face detected in the provided image."

    try:
        print("🖼️ Preprocessing image...",flush=True)  # Debugging
        rgb_img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        rgb_img = cv2.resize(rgb_img, (160, 160))

        print("🤖 Extracting face embedding with DeepFace...",flush=True)  # Debugging
        face_embedding = DeepFace.represent(rgb_img, model_name="Facenet", enforce_detection=False)[0]["embedding"]
        face_embedding = np.array(face_embedding)

        print("✅ Face embedding extracted successfully!",flush=True)  # Debugging
    except Exception as e:
        print(f"❌ DeepFace Error: {str(e)}",flush=True)  # Debugging
        return False, None, f"DeepFace Error: {str(e)}"

    similarity = 1 - cosine(stored_embedding, face_embedding)
    print(f"🔢 Similarity score: {similarity}",flush=True)  # Debugging

    result = similarity >= 0.7
    print(f"🎯 Match result: {'✔️ Match' if result else '❌ No Match'}",flush=True)  # Debugging
    return result, similarity, None

def decode_base64_image(image_data):
    """Decodes a base64 image to OpenCV format."""
    if image_data.startswith("data:image"):
        image_data = image_data.split(",")[1]
    try:
        image_bytes = base64.b64decode(image_data)
        np_img = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        return img if img is not None and img.size > 0 else None
    except Exception:
        return None

@app.route('/liveness_start', methods=['POST'])
def start_liveness():
    try:
        data = request.json
        img = decode_base64_image(data.get("image", ""))
        if img is None:
            return jsonify({"success": False, "error": "Invalid image format"}), 400
        initial_nose_x = detect_head_movement(img)
        if initial_nose_x is None:
            return jsonify({"success": False, "error": "No face detected"}), 400
        return jsonify({"success": True, "message": "Move your head left/right", "initial_nose_x": int(initial_nose_x)})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/recognize', methods=['POST'])
def recognize_face():
    try:
        data = request.json
        roll_no = data.get("rollNo", "").lower()
        roll_no = roll_no.lower()
        initial_nose_x = data.get("initial_nose_x")
        img = decode_base64_image(data.get("image", ""))
        if img is None:
            return jsonify({"error": "Invalid image format"}), 400
        new_nose_x = detect_head_movement(img)
        if new_nose_x is None or abs(new_nose_x - initial_nose_x) < 50:
            return jsonify({"error": "Liveness test failed. Possible spoofing detected."}), 400
        match_status, similarity, error = recognize_with_deepface(img, roll_no)
        if error:
            return jsonify({"error": error}), 400
        return jsonify({"match": bool(match_status), "similarity": float(similarity)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "Hello, Flask on Azure!"
  
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Default to 5000 if PORT is not set
    app.run(host="0.0.0.0", port=port)