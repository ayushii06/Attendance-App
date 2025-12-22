// Optimized enrollFace controller
const User = require('../models/User');
// const faceapi = require('face-api.js'); 
const { getFullFaceDescription,faceapi } = require('../face-api-setup');
const { JSDOM } = require('jsdom');
const { createCanvas, loadImage } = require('canvas');

exports.enrollFace = async (req, res) => {
    const userId = req.user.id;
    const { images } = req.body;

    console.log("user id ", userId);

    if (!userId || !images || !Array.isArray(images) || images.length < 3) {
        return res.status(400).json({ message: 'User ID and at least 3 images are required.' });
    }

    // Setup JSDOM and Canvas once
    const { window } = new JSDOM();
    global.window = window;
    global.document = window.document;
    global.HTMLImageElement = window.HTMLImageElement;

    try {
        // 💡 OPTIMIZATION: Process all images in parallel
        // Map each base64 string to a promise that loads and processes the image
        const imageProcessingPromises = images.map(async (base64Image) => {
            const img = await loadImage(base64Image);
            const description = await getFullFaceDescription(img);
            return description ? description.descriptor : null;
        });

        // Use Promise.all() to wait for all promises to resolve
        const faceDescriptors = await Promise.all(imageProcessingPromises);

        // Filter out any null values if face detection failed on an image
        const validFaceDescriptors = faceDescriptors.filter(d => d !== null);

        if (validFaceDescriptors.length < 3) {
            return res.status(400).json({ message: 'Could not detect a clear face in at least 3 images.' });
        }

        const masterDescriptor = validFaceDescriptors[0].map((val, i) =>
            validFaceDescriptors.reduce((acc, desc) => acc + desc[i], 0) / validFaceDescriptors.length
        );

        const user = await User.findByIdAndUpdate(
            userId,
            {
                isFaceRegistered: true,
                faceDescriptor: Array.from(masterDescriptor)
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Face profile created and linked successfully!', success: true });

    } catch (error) {
        console.error("Enrollment Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.', success: false });
    }
};

exports.verifyFace = async (req, res) => {
    // Assuming 'req.user.id' is populated by preceding authentication middleware
    const userId = req.user.id;
    const { images } = req.body;
    const DISTANCE_THRESHOLD = 0.6; 

    // 1. Improved Input Validation: Ensure 'images' is a non-empty array
    if (!userId || !images || !Array.isArray(images) || images.length === 0) {
        // IMPORTANT: Returning 'success: false' to match the frontend expectation
        return res.status(400).json({ success: false, data: { message: 'User ID and face image array are required.' } });
    }

    try {
        const user = await User.findById(userId);

        if (!user || !user.isFaceRegistered || !user.faceDescriptor) {
            return res.status(404).json({ success: false, data: { message: 'User not found or face profile not enrolled.' } });
        }
        
        // FIX: The frontend sends an array of data URLs. We only need the first one.
        const imageDataUrl = images[0]; 

        // Load the stored master descriptor (stored as an array/Buffer, converted back to Float32Array)
        const storedDescriptor = new Float32Array(user.faceDescriptor);

        // Load the new image and get its descriptor
        const img = await loadImage(imageDataUrl); // loadImage needs to handle the data URL string
        const description = await getFullFaceDescription(img);
        
        if (!description) {
            return res.status(400).json({ success: false, data: { message: 'Could not detect a face in the provided image.' } });
        }
        
        const newDescriptor = description.descriptor;

        // Calculate the Euclidean distance
        const distance = faceapi.euclideanDistance(storedDescriptor, newDescriptor);

        if (distance < DISTANCE_THRESHOLD) {
            // FIX: Aligning response structure with frontend's mock, which checks for `response.success`
            res.status(200).json({ 
                success: true,
                data: { 
                    message: 'Face verified successfully! Access granted.', 
                    isMatch: true, 
                    distance: distance.toFixed(4) // Include distance for debugging/tuning
                } 
            });
        } else {
            // FIX: Aligning response structure with frontend's mock, which expects a structure even on rejection
            res.status(401).json({ 
                success: false,
                data: { 
                    message: 'Face verification failed. No match found.', 
                    isMatch: false, 
                    distance: distance.toFixed(4) 
                } 
            });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        // FIX: Ensure all error responses contain `success: false`
        res.status(500).json({ success: false, data: { message: 'An internal server error occurred.' } });
    }
};