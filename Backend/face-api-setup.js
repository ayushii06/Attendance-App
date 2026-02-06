// require("@tensorflow/tfjs-node");

// Example structure for faceUtils.js (assuming this is required by the controller)
const faceapi = require("face-api.js");
// const fetch = require("node-fetch");
const canvas = require("canvas");
const { JSDOM } = require("jsdom");
const path = require("path");
const { Image } = canvas; // Import Image specifically for loadImage
const BASE_URL = process.env.MODEL_BASE_URL;
const fs = require("fs");
const fetch = global.fetch;
const SAS = process.env.MODEL_SAS;

// 1. Setup (Monkey-patching should only run once)
const { window } = new JSDOM();
faceapi.env.monkeyPatch({
  ImageData: canvas.ImageData,
  Canvas: canvas.Canvas,
  Image: canvas.Image,
  createCanvas: canvas.createCanvas,
  HTMLVideoElement: window.HTMLVideoElement,

  fetch: (url, options) => {
    const separator = url.includes("?") ? "&" : "?";
    const signedUrl = `${url}${separator}${SAS}`;
    return fetch(signedUrl, options);
  },
});


const MODEL_DIR = "/tmp/models";

const MODEL_FILES = [
  "age_gender_model-shard1",
  "age_gender_model-weights_manifest.json",
  "face_expression_model-shard1",
  "face_expression_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_tiny_model-shard1",
  "face_landmark_68_tiny_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_recognition_model-shard2",
  "face_recognition_model-weights_manifest.json",
  "mtcnn_model-shard1",
  "mtcnn_model-weights_manifest.json",
  "ssd_mobilenetv1_model-shard1",
  "ssd_mobilenetv1_model-weights_manifest.json",
  "ssd_mobilenetv1_model-shard2",
  "tiny_face_detector_model-shard1",
  "tiny_face_detector_model-weights_manifest.json",
];

async function downloadModels() {
  if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
  }

  for (const file of MODEL_FILES) {
    const url = `${process.env.MODEL_BASE_URL}/${file}?${process.env.MODEL_SAS}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download ${file}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(MODEL_DIR, file), buffer);
  }
}



// Patch fetch so SAS is appended AFTER filename


// 2. Model Loading (Assuming this runs when the server starts)
// const MODEL_URL = process.env.MODEL_PATH || path.join(__dirname, '../ML model'); // Adjust the path as necessary
// const MODEL_UR/L = path.join(__dirname, '/models'); // Adjust the path as necessary
let isModelsLoaded = false;

const loadModels = async () => {
  if (isModelsLoaded) return;
  try {
    await downloadModels();

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_DIR);
await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_DIR);
await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_DIR);
    isModelsLoaded = true;
  } catch (error) {
    console.error("Failed to load Face API models:", error);
    // Throwing the error here will prevent the server from starting if critical models fail to load.
    throw error;
  }
};

// 3. Image Loading Utility (Necessary for base64 data URL)
const loadImage = (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) =>
      reject(new Error("Failed to load image from data URL"));
    img.src = dataUrl;
  });
};

// 4. Face Description Utility
const getFullFaceDescription = async (image) => {
  if (!isModelsLoaded) {
    throw new Error("Face API models are not loaded.");
  }
  const detection = await faceapi
    .detectSingleFace(image)
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection;
};

// 5. EXPORT EVERYTHING NEEDED BY THE CONTROLLER
module.exports = {
  faceapi, // CRITICAL: Export faceapi for euclideanDistance
  loadModels,
  loadImage, // Export loadImage for image processing
  getFullFaceDescription, // Export getFullFaceDescription
};
