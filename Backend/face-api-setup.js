// Example structure for faceUtils.js (assuming this is required by the controller)
const faceapi = require('face-api.js');
const canvas = require('canvas');
const { JSDOM } = require('jsdom');
const path = require('path');
const { Image } = canvas; // Import Image specifically for loadImage

// 1. Setup (Monkey-patching should only run once)
const { window } = new JSDOM();
faceapi.env.monkeyPatch({
    ImageData: canvas.ImageData,
    Canvas: canvas.Canvas,
    Image: canvas.Image,
    createCanvas: canvas.createCanvas,
    HTMLVideoElement: window.HTMLVideoElement
});

// 2. Model Loading (Assuming this runs when the server starts)
const MODEL_URL = process.env.MODEL_PATH || path.join(__dirname, '../ML model'); // Adjust the path as necessary
let isModelsLoaded = false;

const loadModels = async () => {
    if (isModelsLoaded) return;
    try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
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
        img.onerror = (err) => reject(new Error('Failed to load image from data URL'));
        img.src = dataUrl;
    });
};

// 4. Face Description Utility
const getFullFaceDescription = async (image) => {
    if (!isModelsLoaded) {
        throw new Error("Face API models are not loaded.");
    }
    const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
    return detection;
};

// 5. EXPORT EVERYTHING NEEDED BY THE CONTROLLER
module.exports = {
    faceapi, // CRITICAL: Export faceapi for euclideanDistance
    loadModels,
    loadImage, // Export loadImage for image processing
    getFullFaceDescription // Export getFullFaceDescription
};
