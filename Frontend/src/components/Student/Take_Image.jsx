import React, { useState } from 'react';
import axios from 'axios';
import face from '../../assets/face.svg';
import { useNavigate } from 'react-router-dom';

const Take_Image = (props) => {
    const [train, setTrain] = useState(false);
    const [load, setLoad] = useState(false);
    const id = props.id;
    console.log(id);
    const navigate = useNavigate();

    const takeImg = async () => {
        try {
            const res = await axios.post(`http://localhost:1000/take_image/${id}`);
            if (res.status === 200) {
                alert('Image Taken Successfully');
                setTrain(true);
                trainModel();
            } else {
                console.error('Error');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const trainModel = async () => {
        setLoad(true); // Set loading state to true
        try {
            const res = await axios.get(`http://localhost:1000/train`);
            if (res.status === 200) {
                alert('Model Trained Successfully');
                navigate('/login');
            } else {
                console.error('Error');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoad(false); // Ensure loading state is reset
        }
    };

    return (
        <div>
            {train ? (
                <div className="flex flex-col justify-center items-center gap-6">
                    <div>
                        {load && (
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
                        )}
                    </div>
                    <div className="text-center mt-24">
                        <p className="text-4xl font-bold">Train Model</p>
                        <button
                            className="text-2xl my-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                            onClick={trainModel}
                        >
                            Train Model
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center py-5 items-center gap-6">
                    <div>
                        <img width={500} src={face} alt="Face" />
                    </div>
                    <div>
                        <p className="text-4xl w-8/12 font-bold">
                            Register your face for Recognition
                        </p>
                        <button
                            className="py-2 px-4 text-2xl my-8"
                            onClick={takeImg}
                        >
                            Take Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Take_Image;
