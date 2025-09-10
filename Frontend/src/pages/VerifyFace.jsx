// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import { startLivenessCheck, sendImageToBackend } from "../services/operations/faceRecognitionAPI";

// const FaceRecognition = ({ setStep }) => {
//     const rollNo = useSelector((state) => state.profile.user.rollNo);
//     const rollNoCapitalized = rollNo.charAt(0).toUpperCase() + rollNo.slice(1);
//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);
//     const [isVerified, setIsVerified] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const navigate = useNavigate();


//     const captureFrameAndSend = (sendToRecognition = false, initialNoseX = null) => {
//         if (!videoRef.current || !canvasRef.current) return;
//         const canvas = canvasRef.current;
//         const context = canvas.getContext("2d");
//         const video = videoRef.current;

//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);

//         const dataUrl = canvas.toDataURL("image/jpeg");

//         if (sendToRecognition && initialNoseX !== null) {
//             sendImageToBackend(dataUrl, initialNoseX, rollNoCapitalized, setErrorMessage, setStep);  // Send fresh image to recognize
//         } else {
//             startLivenessCheck(dataUrl, setErrorMessage, videoRef, canvasRef, setStep, rollNoCapitalized);  // Start liveness check with first image
//         }
//     };

//     useEffect(() => {
//         let stream = null;

//         const startCamera = async () => {
//             if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//                 try {
//                     stream = await navigator.mediaDevices.getUserMedia({ video: true });
//                     if (videoRef.current) {
//                         videoRef.current.srcObject = stream;
//                     }
//                 } catch (error) {
//                     console.error("Error accessing camera:", error);
//                     setErrorMessage("Unable to access camera. Please check permissions.");
//                     toast.error("Camera access denied!");
//                 }
//             } else {
//                 setErrorMessage("Camera not supported in this browser.");
//                 toast.error("Camera not supported!");
//             }
//         };

//         startCamera();

//         return () => {
//             if (videoRef.current && videoRef.current.srcObject) {
//                 videoRef.current.srcObject.getTracks().forEach(track => track.stop()); // Stop all video tracks
//                 videoRef.current.srcObject = null; // Remove reference to the stream
//             }
//         };
//     }, []);

//     return (
//         <div className="flex flex-col justify-center items-center">
//             {!isVerified ? (
//                 <>
//                     {!errorMessage &&
//                         <>
//                             <div className=" text-center">
//                                 <video ref={videoRef} autoPlay playsInline className="md:w-auto w-auto mx-auto  rounded-md" />
//                                 <button
//                                     onClick={captureFrameAndSend}
//                                     className="mt-4 text-xs md:text-sm bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5"
//                                 >
//                                     Verify Face
//                                 </button>
//                             </div>
//                         </>}
//                 </>
//             ) : (
//                 <>
//                     <div className="bg-black mx-auto  text-white px-10 py-10">
//                         <DotLottieReact className='w-80 mx-auto font-bold'
//                             src="https://lottie.host/92c241f0-e3bd-4244-99c9-6c899e7d7e3d/er9dkaK8tt.lottie"
//                             loop
//                             autoplay
//                         />
//                         <div className="text-center my-5 font-medium text-2xl ">
//                             <div className="">Face Recognised Successfully!</div>

//                         </div>
//                         <div className="text-center my-2 font-medium text-2xl ">
//                             <div className="">Starting location check. Do not press back button.</div>

//                         </div>
//                     </div>
//                 </>
//             )}
//             <canvas ref={canvasRef} className="hidden" />

//             {errorMessage && <>
//                 <div className="h-screen bg-black bg-opacity-90 mx-auto  text-white px-10 py-10">
//                     <DotLottieReact className='w-80 my-10 mx-auto font-bold'
//                         src="https://lottie.host/cdcd5c2a-b2d8-4b15-8505-beb78e717d6b/jrIik8tJpI.lottie"
//                         loop
//                         autoplay
//                     />
//                     <div className="text-center mt-5 mb-5 font-medium text-2xl ">
//                         <div className="text-2xl font-medium my-2">ERROR : {errorMessage}</div>
//                     </div>
//                 </div>
//             </>}
//         </div>

//     );
// };

// export default FaceRecognition;
