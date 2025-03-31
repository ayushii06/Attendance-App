import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { recognitionEndpoints } from "../api"

const { START_LIVELINESS_API , START_RECOGNITION_API, REGISTER_FACE_API,CHECK_REGISTERED_FACE_API} = recognitionEndpoints

export async function isFaceRegistered(rollNo){
    try {
        const response = await apiConnector("POST", CHECK_REGISTERED_FACE_API, {
            rollNo
        })
        console.log("IS FACE REGISTERED API RESPONSE............", response)
        return response?.data?.is_registered
    }
    catch (error) {
        toast.error("Server error! Unable to check if face is registered.")
        setTimeout(() => {
            window.location.reload();
        }, 3000);
        console.error("Error checking if face is registered:", error)
        return false
    }
}

const captureFrame = (videoRef,canvasRef) => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg"); // Return new image
};

export async function startLivenessCheck(imageData,setErrorMessage,videoRef,canvasRef,setStep,rollNoCapitalized) {
    try {
        const response = await apiConnector("POST", START_LIVELINESS_API, {
            image: imageData
        })
        console.log("RECOGNIZE FACE API RESPONSE............", response)

        if(response?.data?.error){
            setErrorMessage(response?.data?.error)
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }

        const initialNoseX = response?.data?.initial_nose_x
        toast.success("Please move your head left or right to verify liveness.")

        setTimeout(() => {
            const newImageData = captureFrame(videoRef,canvasRef); // Capture new image
            sendImageToBackend(newImageData, initialNoseX,rollNoCapitalized,setErrorMessage,setStep)
        }, 2000);



    } catch (error) {
        setErrorMessage("Server error! Unable to start liveness check.")
        console.error("Error starting liveness check:", error)
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }
}

export async function sendImageToBackend(imageData, initialNoseX,rollNoCapitalized,setErrorMessage,setStep) {
    console.log("Sending image to backend for recognition...")
    try {
        const response = await apiConnector("POST", START_RECOGNITION_API, {
            image: imageData,
            rollNo: rollNoCapitalized,
            initial_nose_x: initialNoseX
        })
        console.log("RECOGNIZE FACE API RESPONSE............", response)

        if(response?.data?.error){
            setErrorMessage(response?.data?.error)
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        }
        setStep(3)

    } catch (error) {
        setErrorMessage(error?.response?.data?.error || "Server error! Unable to verify face.")
        console.error("Error recognizing face:", error)
        setTimeout(() => {
            window.location.reload();
        }, 4000);
    }
}

export async function registerFace(id,imageData,setLoading,setSuccess,setErrorMessage,setError,navigate) {
    try {
        console.log("id",id);

        const response = await apiConnector("POST", REGISTER_FACE_API,{
            rollNo: id,
            images: imageData
        })
        console.log("REGISTER FACE API RESPONSE............", response)
        setLoading(false);

        if(response?.status === 200){
           setSuccess(true)
            setTimeout(() => {
                navigate('/')
                window.location.reload();
            }, 4000);
        }
        else{
            setSuccess(false)
            setError(true)
            setErrorMessage(response?.data?.error || "Error registering face.")
            setTimeout(() => {
                navigate('/')
                window.location.reload();
            }, 4000);
        }
    } catch (error) {
        setLoading(false);
        setSuccess(false)
        setError(true)
        setErrorMessage(error?.response?.data?.error || "Server error! Unable to register face.")
        console.error("Error registering face:", error)
        setTimeout(() => {
            window.location.reload();
        }, 4000);
    }
}
