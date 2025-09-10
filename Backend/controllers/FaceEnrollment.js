// Optimized enrollFace controller
const User = require('../models/User');
const { getFullFaceDescription } = require('../face-api-setup');
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

        res.status(200).json({ message: 'Face profile created and linked successfully!' });

    } catch (error) {
        console.error("Enrollment Error:", error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};