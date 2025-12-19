import React, { useRef, useState, useEffect, useCallback } from "react";
import { useVerifyFaceMutation } from "../../../../services/faceApi";

// Helper function to promisify navigator.geolocation.getCurrentPosition
const getPosition = (options) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

const VerifyingFace = ({ setStep, course, markAttendance }) => {
  const [verifyFace, { isLoading: isVerifying }] = useVerifyFaceMutation();
  const [hasError, setHasError] = useState(false);

                                                           
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [message, setMessage] = useState("Click 'Start Webcam' to begin verification.");
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  
  // State for location remains, but we use local variables for the API call
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  // Stop webcam when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null); // Clear stream reference
      }
    };
  }, [stream]);

  // Start webcam
  const startWebcam = async () => {
    setLoading(true);
    setMessage("Starting your webcam...");
    // Stop any existing stream before starting a new one
    if (stream) stream.getTracks().forEach((track) => track.stop());

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCapturedImage(null);
        setMessage("Webcam is live. Position your face clearly and click 'Capture & Verify'.");
      }
    } catch (err) {
      console.error("Webcam error:", err);
      setHasError(true);
      setMessage(`❌ Unable to access webcam: ${err.name || 'Unknown error'}. Please check camera permissions.`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * CRITICAL FIX: This function now correctly handles the async chain:
   * 1. Acquire Geolocation (using await on a Promise-wrapped function)
   * 2. Call Attendance API (awaiting the result of the parent's markAttendance prop)
   * 3. Handle success or error for both steps.
   */
    const getUserLocationAndMarkAttendance = async () => {
    setLoading(true);
    setMessage("Acquiring your location, please wait...");

    let currentLatitude = null;
    let currentLongitude = null;

    try {
      // 1. Get Location
      const position = await getPosition({ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
      currentLatitude = position.coords.latitude;
      currentLongitude = position.coords.longitude;
      
      setLocation({ latitude: currentLatitude, longitude: currentLongitude, error: null });

      setMessage("Location acquired. Marking attendance...");

      // 2. Call the attendance marking API using the prop
      // This relies on the parent's markAttendance prop to return the .unwrap() promise, 
      // which throws an error on API failure.
      await markAttendance({ latitude: currentLatitude, longitude: currentLongitude });

      // 3. Success (Only reached if no errors were thrown above)
      setMessage("✅ Attendance marked successfully!");
      setStep(3);

    } catch (error) {
      setHasError(true);
      let errorMessage = "❌ An error occurred during verification or attendance marking. Please try again.";
      
      // 1. Check for Geolocation Errors (Code 1: DENIED, 2: UNAVAILABLE, 3: TIMEOUT)
      // We rely on the 'code' property for robust cross-browser Geolocation error detection.
      if (error && error.code && typeof error.code === 'number' && error.code >= 1 && error.code <= 3) { 
        if (error.code === 1) { 
          errorMessage = "❌ Location access denied. Please allow geolocation to mark attendance.";
        } else if (error.code === 2) { 
          errorMessage = "❌ Location unavailable. Check device settings or try moving to a different spot.";
        } else if (error.code === 3) { 
          errorMessage = "❌ Failed to get location in time. Ensure you have a strong signal.";
        }
      } 
      
      // 2. Check for Attendance API Errors (RTK Query failure)
      else if (error && error.data) {
        // Assuming RTK Query error structure for backend failure
        errorMessage = `❌ Attendance API Error: ${error.data.message || 'Server rejected attendance.'}`;
      } 
      
      // 3. General Error (e.g., network failure, or other unexpected rejection)
      else if (error && error.message) {
         errorMessage = `❌ Error: ${error.message}`;
      } 

      console.error("Attendance/Geolocation failed:", error);
      
    // Set the error message and display button to return to step 1
      setMessage(errorMessage);
      // setStep(1); 
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
  // Stop camera if running
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  setStream(null);
  setCapturedImage(null);
  setHasError(false);
  setMessage("Click 'Start Webcam' to begin verification.");

  setStep(1); // 👈 GO BACK TO STEP 1
};


  // Capture image and verify
  const captureAndVerify = async () => {
    if (!videoRef.current || !stream) {
      setMessage("Please start the webcam before capturing.");
      return;
    }

    setLoading(true);
    setMessage("Capturing your image...");

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Ensure video is playing and has dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setMessage("Webcam stream is not active. Please wait a moment and try again.");
        setLoading(false);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Stop the stream after capture
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);

      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedImage(imageDataUrl);

      setMessage("Verifying your face, please wait...");
      
      // Use .unwrap() to throw an error on API failure, caught below
      const response = await verifyFace({ images: [imageDataUrl] }).unwrap();
      console.log("Face verification response:", response);

      if (response.success) {
        setMessage("✅ Face verified successfully! Proceeding to location check.");

        // *** Face is verified, now proceed to the location and attendance step ***
        getUserLocationAndMarkAttendance();

      } else {
        setHasError(true);
        setMessage("❌ Face not recognized. Please try again.");
        
      


        // Show return to step 1 button
        // setStep(1); // Go back to start
      }
    } catch (error) {
      setHasError(true);
      console.error("Verification failed:", error);
      let errorMessage = "An error occurred during verification.";
      if (error && error.data && error.data.message) {
         errorMessage = `❌ Face API Error: ${error.data.message}`;
      }
      setMessage(errorMessage);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-gray-800 ">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-lg p-8 space-y-6">
        <h2 className="text-xl font-bold text-gray-800 text-center">Step 2: Face Verification & Attendance</h2>
        
        {/* Webcam preview */}
        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
          {!capturedImage ? (
            // Only show video element if stream is active and no image captured
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${stream ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : (
            // Show captured image if available
            <img
              src={capturedImage}
              alt="Captured Face"
              className="w-full h-full object-cover rounded-lg"
            />
          )}
          
          {/* Placeholder when video isn't running or image hasn't loaded */}
          {!stream && !capturedImage && (
             <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-semibold text-lg">
                Camera View 
            </div>
          )}

          <canvas ref={canvasRef} className="hidden"></canvas>
        </div>

        {/* Message box */}
        <div className="text-center text-sm md:text-md font-medium">
          <p
            className={`p-4 rounded-xl transition-all duration-300 ${
              loading || isVerifying
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse"
                : "bg-gray-50 text-gray-700 border border-gray-200"
            }`}
          >
            {message}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={startWebcam}
            disabled={(!!stream && !capturedImage) || loading || isVerifying}
            className="px-6 py-3 bg-gray-200 text-gray-800 text-xs md:text-md font-semibold rounded-full shadow-sm hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && message.includes("Starting") ? "Starting..." : "Start Webcam"}
          </button>

          <button
            onClick={captureAndVerify}
            disabled={!stream || loading || isVerifying}
            className="px-6 py-3 bg-indigo-600 text-white text-xs md:text-md font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {(loading && message.includes("Capturing")) || isVerifying ? "Verifying..." : "Capture & Verify"}
          </button>

          {hasError && (
  <div className="flex justify-center pt-4">
    <button
      onClick={handleRetry}
      className="px-6 py-3 bg-red-600 text-white text-xs md:text-md font-semibold rounded-full shadow hover:bg-red-700 transition"
    >
      🔄 Retry Verification
    </button>
  </div>
)}
        </div>
        
        {/* Display Location Debug Info (Optional but useful) */}
        {location.latitude && (
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
            Current Location: Lat {location.latitude.toFixed(4)}, Lon {location.longitude.toFixed(4)}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyingFace;
