import { createSlice } from '@reduxjs/toolkit';

const faceSlice = createSlice({
    name: 'face',
    initialState: {
        isFaceEnrolled:false,
        isFaceVerified:false,
    },
    reducers: {
        setFaceEnroll: (state, action) => {
            state.isFaceEnrolled = action.payload
        },
        getFaceVerified: (state, action) => {
            state.isFaceVerified = action.payload
        },
        
    }
});

export const {setFaceEnroll,getFaceVerified} = faceSlice.actions;
export default faceSlice.reducer;
