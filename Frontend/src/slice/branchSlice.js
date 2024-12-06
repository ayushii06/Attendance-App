import { createSlice } from '@reduxjs/toolkit';

const branchSlice = createSlice({
    name: 'branch',
    initialState: {
        branch: [],
        
    },
    reducers: {
        setBranch: (state, action) => {
            state.branch = action.payload;
        },
    }
});

export const { setBranch } = branchSlice.actions;
export default branchSlice.reducer;
