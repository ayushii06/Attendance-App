import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useSelector } from 'react-redux';

function WebcamCapture() {
    const course = window.location.pathname.split('/')[2];
    const [image, setImage] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const intervalRef = useRef(null);
    const navigate = useNavigate();
    let rollNo = useSelector((state) => state.profile.user.rollNo);
    const rollNoCapitalized = rollNo.toString().toUpperCase();

    useEffect(() => {
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
                videoRef.current.srcObject = stream;
            } catch (error) {
                setErrorMessage("Error accessing webcam: " + error.message);
            }
        };
        startWebcam();

        return () => stopWebcam();
    }, [1]);

    const captureFrameAndSend = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        sendImageToBackend(dataUrl);
    };

    const sendImageToBackend = async (imageData) => {
        try {
            const response = await fetch("http://127.0.0.1:5001/recognize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: imageData }),
            });
            const data = await response.json();
            const id = data?.verified_face_info?.roll_no;

            if (id !== rollNoCapitalized) {
                setErrorMessage("Can't recognise Face");
                setIsVerified(false);
                clearInterval(intervalRef.current);
                stopWebcam();
                return;
            }

            if (data.message === "Face recognized successfully") {
                setIsVerified(true);
                setErrorMessage("");
                clearInterval(intervalRef.current);
                stopWebcam();
                setTimeout(() => navigate(`/verify_location/${course}/${id}`), 10000);
            }
        } catch (error) {
            clearInterval(intervalRef.current);
                stopWebcam();
            setErrorMessage("Error sending image to backend: " + error.message);
        }
    };

    const stopWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    useEffect(() => {
        if (!isVerified) {
            intervalRef.current = setInterval(captureFrameAndSend, 2000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isVerified]);

    return (
        <div>
            {!isVerified  ? (
                <>
            {!errorMessage &&<video ref={videoRef} autoPlay playsInline className='w-auto h-auto mx-auto rounded-sm' />
}</>) : (
                <>
                    <DotLottieReact
                    className='mx-auto w-80'
                        src="https://lottie.host/92c241f0-e3bd-4244-99c9-6c899e7d7e3d/er9dkaK8tt.lottie"
                        loop
                        autoplay
                    />
                    <div className="text-center my-5 font-medium text-2xl ">
                        <div className="">Face Recognized Successfully!</div>
                    </div>
                    <div className="text-center my-2 font-medium text-2xl ">
                        <div className="">You will be redirected to next page. Do not press back button.</div>
                    </div>
                </>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {errorMessage && <p className='mx-auto text-2xl my-32 font-bold w-1/2 text-center text-rose-400' >ERROR! {errorMessage}!</p>}
        </div>
    );
}

export default WebcamCapture;
