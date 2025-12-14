import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiArrowUp, FiCamera, FiCheckCircle, FiSmile, FiUserX } from 'react-icons/fi';
import {useCreateFaceEnrollmentMutation} from '../../../services/faceApi'
import { UserCheck, RefreshCw, ShieldAlert, PartyPopper } from 'lucide-react';
import { useDispatch } from 'react-redux';

function FaceRegistration({ isFaceRegistered,user_id }) {
    const [createFaceEnrollment, { isLoading }] = useCreateFaceEnrollmentMutation();
    const dispatch = useDispatch();

    // Set initial status based on prop
    const [status, setStatus] = useState(isFaceRegistered ? 'registered' : 'notRegistered');
    
    const [capturedImages, setCapturedImages] = useState([]);
    const [currentCommand, setCurrentCommand] = useState({ text: "", icon: "FiCamera" });
    const [progress, setProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [stream, setStream] = useState(null);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const commandsRef = useRef([]);

    const captureCommands = [
        { text: "Get ready...", icon: "FiCamera" },
        { text: "Look straight at the camera", icon: "FiArrowUp" },
        { text: "Hold still", icon: "FiUserX" },
        { text: "Turn your head slightly to the left", icon: "FiArrowLeft" },
        { text: "Hold still", icon: "FiUserX" },
        { text: "Turn your head slightly to the right", icon: "FiArrowRight" },
        { text: "Hold still", icon: "FiUserX" },
        { text: "Smile!", icon: "FiSmile" },
        { text: "Hold still", icon: "FiUserX" },
        { text: "All photos captured!", icon: "FiCheckCircle" },
    ];
    
    // Corrected Icon Component to map from string to component
    const LucideIcon = ({ name, ...props }) => {
        const icons = { FiCamera, FiArrowUp, FiUserX, FiArrowLeft, FiArrowRight, FiSmile, FiCheckCircle };
        const Icon = icons[name];
        return Icon ? <Icon {...props} /> : null;
    };

    const stopWebcam = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    useEffect(() => {
        // Cleanup webcam on component unmount
        return () => stopWebcam();
    }, [stopWebcam]);

    const capturePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            return canvas.toDataURL('image/jpeg');
        }
        return null;
    }, []);

    const startCaptureProcess = async () => {
        setStatus('capturing');
        setCapturedImages([]);
        setProgress(0);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
            setErrorMessage("Webcam access denied. Please enable camera permissions.");
            setStatus('error');
            return;
        }

        // Wait for video to be ready before starting capture loop
        await new Promise(resolve => {
            if (videoRef.current) {
                videoRef.current.onloadedmetadata = () => resolve();
            }
        });
        
        const imagesToSubmit = [];
        for (let i = 0; i < captureCommands.length; i++) {
            const command = captureCommands[i];
            setCurrentCommand(command);

            // Capture photo only for 'Hold still' and 'Smile!' commands
            if (['Hold still', 'Smile!'].includes(command.text)) {
                await new Promise(resolve => setTimeout(resolve, 500)); // Delay for a better user experience
                const photo = capturePhoto();
                if (photo) {
                    imagesToSubmit.push(photo);
                    setCapturedImages(prev => [...prev, photo]);
                }
            }
            setProgress((i / (captureCommands.length - 1)) * 100);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

         stopWebcam();
         setStatus('submitting');
        
        try {
            await createFaceEnrollment({ images: imagesToSubmit }).unwrap();
            dispatch({ type: 'face/setFaceEnroll', payload: true });
            
            // If the API call is successful, change status to 'success'
            setStatus('success');
        } catch (err) {
            console.error("Enrollment Error:", err);
            setErrorMessage(err.data?.message || "Failed to enroll face. Please try again.");
            stopWebcam();
            // If the API call fails, change status to 'error'
            setStatus('error');
        }
    };
    

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
                        <svg className="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <h2 className="text-xl font-semibold text-slate-700">Checking Status</h2>
                        <p className="text-slate-500 mt-1">Please wait while we check your registration status...</p>
                    </div>
                );
            case 'notRegistered':
                return (
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
                        <div className="bg-amber-100 p-4 rounded-full mb-4"><FiUserX className="h-10 w-10 text-amber-500" /></div>
                        <h2 className="text-2xl font-bold text-slate-800">Face Not Registered</h2>
                        <p className="text-slate-500 mt-2 max-w-md">Please complete the registration to continue.</p>
                        <button onClick={startCaptureProcess} className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"><FiCamera className="h-5 w-5 mr-2" /> Register Your Face</button>
                    </div>
                );
            case 'registered':
                return (
                     <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
                        <div className="bg-green-100 p-4 rounded-full mb-4"><UserCheck className="h-10 w-10 text-green-600" /></div>
                        <h2 className="text-2xl font-bold text-slate-800">Face Successfully Registered</h2>
                        <button onClick={() => setStatus('retakeInfo')} className="mt-8 inline-flex items-center justify-center px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-300 hover:bg-slate-200 transition-colors duration-200"><RefreshCw className="h-5 w-5 mr-2" /> Retake Photo</button>
                    </div>
                );
            case 'retakeInfo':
                return (
                     <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
                        <div className="bg-sky-100 p-4 rounded-full mb-4"><ShieldAlert className="h-10 w-10 text-sky-600" /></div>
                        <h2 className="text-2xl font-bold text-slate-800">Admin Permission Required</h2>
                        <p className="text-slate-500 mt-2 max-w-md">Please contact your system administrator to request a photo update.</p>
                        <button onClick={() => setStatus('registered')} className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"><FiArrowLeft className="h-5 w-5 mr-2" /> Go Back</button>
                    </div>
                );
            case 'capturing':
                 return (
                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Registration in Progress</h2>
                        <div className="relative w-full max-w-lg aspect-video bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-300 shadow-lg">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            <canvas ref={canvasRef} className="hidden"></canvas>
                            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center"><div className="w-3/4 h-5/6 border-4 border-dashed border-white/50 rounded-3xl"></div></div>
                        </div>
                        <div className="w-full max-w-lg mt-6">
                            <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                <div className="flex items-center justify-center text-indigo-700 font-semibold text-lg">
                                    <LucideIcon name={currentCommand.icon} className="h-6 w-6 mr-3 flex-shrink-0" />
                                    <span>{currentCommand.text}</span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-6">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                            </div>
                            <div className="mt-4 flex justify-center space-x-2 h-16">
                                {capturedImages.map((src, index) => (
                                    <img key={index} src={src} className="h-16 w-16 object-cover rounded-md border-2 border-indigo-300 shadow-sm" alt={`Capture ${index + 1}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'submitting':
                return (
                     <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
                        <svg className="animate-spin h-12 w-12 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <h2 className="text-xl font-semibold text-slate-700">Processing...</h2>
                        <p className="text-slate-500 mt-1">Sending photos for verification. Please hold on.</p>
                    </div>
                );
            case 'success':
                 return (
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
                        <div className="bg-green-100 p-4 rounded-full mb-4"><PartyPopper className="h-10 w-10 text-green-600" /></div>
                        <h2 className="text-2xl font-bold text-slate-800">Registration Complete!</h2>
                        <p className="text-slate-500 mt-2 max-w-md">Your face has been successfully registered.</p>
                    </div>
                );
            case 'error':
            return (
                <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 h-full">
                    <div className="bg-red-100 p-4 rounded-full mb-4"><ShieldAlert className="h-10 w-10 text-red-600" /></div>
                    <h2 className="text-2xl font-bold text-slate-800">Registration Failed</h2>
                    <p className="text-slate-500 mt-2 max-w-md">{errorMessage}</p>
                    <button onClick={startCaptureProcess} className="mt-8 inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-200"><RefreshCw className="h-5 w-5 mr-2" /> Try Again</button>
                </div>
            );
            default:
                return <p>Something went wrong.</p>;
        }
    };
    
    return (
         <div className="w-full">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Manage Face Registration</h1>
            <div className="min-h-[600px]">
               {renderContent()}
            </div>
        </div>
    );
};

export default FaceRegistration