// face-api-setup.js
const faceapi = require('face-api.js');
const canvas = require('canvas');
const { JSDOM } = require('jsdom');
const path = require('path');

// 1. Set up the JSDOM and monkey-patching environment
const { window } = new JSDOM();
const { ImageData, Image, Canvas, createCanvas } = canvas;

faceapi.env.monkeyPatch({
    ImageData: ImageData,
    Canvas: Canvas,
    Image: Image,
    createCanvas: createCanvas,
    // Note: Older versions might not need HTMLVideoElement, but it's good practice to include it.
    HTMLVideoElement: window.HTMLVideoElement
});

// 2. Load the models
const MODEL_URL = path.join(__dirname, 'models');
let isModelsLoaded = false;

const loadModels = async () => {
    if (isModelsLoaded) {
        return;
    }
    try {
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL);
        console.log("Face API models loaded successfully!");
        isModelsLoaded = true;
    } catch (error) {
        console.error("Failed to load Face API models:", error);
    }
};

const getFullFaceDescription = async (image) => {
    if (!isModelsLoaded) {
        throw new Error("Face API models are not loaded.");
    }
    const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
    return detection;
};

module.exports = {
    loadModels,
    getFullFaceDescription
};