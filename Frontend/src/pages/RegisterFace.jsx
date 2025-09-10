// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import { useSelector } from 'react-redux';
// import { registerFace } from '../services/operations/faceRecognitionAPI';

// const RegisterFace = () => {
//     const id = useSelector((state) => state.profile.user.rollNo)?.toLowerCase();
//     const navigate = useNavigate();
//     const videoRef = useRef(null);
//     const imagesCaptured = useRef(0); // Use useRef for proper tracking
//     const [capturing, setCapturing] = useState(false);
//     const [progress, setProgress] = useState(0);
//     const [success, setSuccess] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");

//     useEffect(() => {
//         const startWebcam = () => {
//             navigator.mediaDevices.getUserMedia({ video: true })
//                 .then(stream => {
//                     videoRef.current.srcObject = stream;
//                 })
//                 .catch(err => {
//                     console.error("Error accessing webcam", err);
//                     toast.error("Webcam access denied or unavailable.");
//                 });
//         };

//         startWebcam();

//         // Cleanup function to stop the webcam when the component unmounts
//         return () => {
//             if (videoRef.current?.srcObject) {
//                 videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//             }
//         };
//     }, []);

//     const captureAndSendImages = async () => {
//         if (!videoRef.current) return;
//         const totalImages = 15;
//         imagesCaptured.current = 0; // Reset counter
//         setCapturing(true);
//         setProgress(0);

//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         canvas.width = videoRef.current.videoWidth;
//         canvas.height = videoRef.current.videoHeight;

//         let imageArray = []; // Store all images before sending

//         const captureImage = async () => {
//             if (imagesCaptured.current >= totalImages) {
//                 console.log("Image capture completed!");
//                 // toast.success("100 images successfully captured and sent to the backend!");
//                 setLoading(true);

//                 // Send all images in a single request
//                registerFace(id, imageArray, setLoading, setSuccess, setErrorMessage,setError, navigate);

//                 // Close the webcam after capturing images
//                 if (videoRef.current?.srcObject) {
//                     videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//                 }
//                 return;
//             }

//             ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//             const image = canvas.toDataURL('image/jpeg'); // Convert to Base64

//             imageArray.push(image); // Add image to array
//             imagesCaptured.current += 1;
//             setProgress((imagesCaptured.current / totalImages) * 100);

//             setTimeout(captureImage, 200); // Capture next image after 200ms
//         };

//        captureImage() // Start capturing images
//     };


//     return (
//         <>
//             {loading && <>
//             <div className="my-10  h-full w-8/12 mx-auto">
//                 <DotLottieReact
//                     src="https://lottie.host/a75a8e88-4671-4f6c-be2c-d814534be665/0v6THaooo5.lottie"
//                     loop
//                     autoplay
//                     className='w-80 mx-auto font-bold'
//                 />
//                 <div className="text-center my-5 font-medium text-2xl ">
//                     <div className="">Wait for backend to detect face and store embeddings!</div>

//                 </div>

//                 </div>

//             </>}

//             {!loading && !success && !error &&
//                 <div className="text-center">
//                     <video ref={videoRef} className="w-fit h-fit mx-auto" autoPlay
//                         style={{ transform: "scaleX(-1)" }}
//                     ></video>

//                     {capturing ? (
//                         <div className="mt-4 my-5">
//                             <div className="h-3 bg-gray-200 rounded">
//                                 <div
//                                     className="h-3 bg-green-500 rounded"
//                                     style={{ width: `${progress}%` }}
//                                 ></div>
//                             </div>
//                             <p className='font-medium '>{Math.round(progress)}% Completed</p>
//                         </div>
//                     ) : (
//                         <button
//                             onClick={captureAndSendImages}
//                             className="bg-green-500 my-2 text-white p-2 rounded"
//                             disabled={capturing}
//                         >
//                             {capturing ? "Capturing..." : "Capture 100 Images"}
//                         </button>
//                     )}
//                 </div>
//             }

//             {success &&
//                 <div className="text-center my-10 font-medium text-2xl ">
//                     <DotLottieReact className='w-80 mx-auto font-bold'
//                         src="https://lottie.host/92c241f0-e3bd-4244-99c9-6c899e7d7e3d/er9dkaK8tt.lottie"
//                         loop
//                         autoplay
//                     />
//                     <div className="">Successfully captured the face and trained by model</div>
//                     <div className="">You will be redirected to the home page shortly</div>
//                 </div>
//             }

//             {error &&
//                 <div className="text-center my-10 font-medium text-2xl ">
//                     <DotLottieReact className='w-80 mx-auto font-bold'
//                         src="https://lottie.host/cdcd5c2a-b2d8-4b15-8505-beb78e717d6b/jrIik8tJpI.lottie"
//                         loop
//                         autoplay
//                     />
//                     <div className="">Error : {errorMessage}</div>
//                     <div className="">You will be redirected to the home page shortly</div>
//                 </div>
//             }




//         </>
//     );
// };

// export default RegisterFace;
