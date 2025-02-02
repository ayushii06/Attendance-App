import base64
import cv2
import json
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# MongoDB client (adjust as necessary)
client = MongoClient("mongodb+srv://Devansh:Dz7fpUyzw4BAdwK1@backendbasics.p6v49pw.mongodb.net/Upasthit")
db = client["Upasthit"]
collection = db["users"]

def draw_boundary(img, classifier, scaleFactor, minNeighbors, color, clf):
    with open("models/label_map.json", "r") as f:
        reverse_label_map = json.load(f)
        
    gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    features = classifier.detectMultiScale(gray_image, scaleFactor, minNeighbors)
    print("Detected faces:", features)  # Add this line to see if any faces are detected

    coords = []
    verified_face_info = None

    for (x, y, w, h) in features:
        cv2.rectangle(img, (x, y), (x+w, y+h), color, 2)
        id_num, predict = clf.predict(gray_image[y:y+h, x:x+w])
        confidence = int((100 * (1 - predict / 300)))
        
        id = reverse_label_map.get(str(id_num), "Unknown")
        firstName = lastName = roll_no = "Unknown"
        capital_id = id.upper()
        print("Predicted ID:", capital_id, "Confidence:", confidence)

        if confidence >= 70:
            # Fetch from MongoDB
            data = collection.find_one({"rollNo": capital_id})
            if data:
                firstName = data["firstName"]
                lastName = data["lastName"]
                roll_no = data["rollNo"]
                verified_face_info = {"roll_no": roll_no, "firstName": firstName, "lastName": lastName, "confidence": confidence}

        # Display information
        cv2.putText(img, f"ID: {id}", (x, y-75), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 1, cv2.LINE_AA)
        cv2.putText(img, f"Name: {firstName} {lastName}", (x, y-55), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 1, cv2.LINE_AA)
        cv2.putText(img, f"Confidence: {confidence}", (x, y-35), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 1, cv2.LINE_AA)
        coords = [x, y, w, h]

    return coords, verified_face_info


@app.route('/recognize', methods=['POST'])
def recognize_face():
    try:
        data = request.json
        if "image" not in data:
            return jsonify({"error": "No image data received"}), 400

        # Get the base64 image string
        image_data = data["image"]

        # If the image data starts with 'data:image/jpeg;base64,' or similar, remove the prefix
        if image_data.startswith("data:image"):
            image_data = image_data.split(",")[1]

        # Decode the base64 image
        image_bytes = base64.b64decode(image_data)
        np_img = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({"error": "Decoded image is empty"}), 400

        # Face recognition setup
        face_classifier = cv2.CascadeClassifier("models/haarcascade_frontalface_default.xml")
        clf = cv2.face.LBPHFaceRecognizer_create()
        clf.read("models/classifier.xml")
        color = {"blue": (255, 0, 0)}

        coords, verified_face_info = draw_boundary(img, face_classifier, 1.1, 10, color["blue"], clf)

        # Encode the image to base64 to send it back in the response
        _, img_buffer = cv2.imencode('.jpg', img)
        img_base64 = base64.b64encode(img_buffer).decode('utf-8')

        # Return the image with face recognition results and verified info
        return jsonify({
            "message": "Face recognized successfully",
            "image": img_base64,
            "verified_face_info": verified_face_info
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
