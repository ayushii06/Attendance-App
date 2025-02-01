import { createSlice } from '@reduxjs/toolkit';

const branchSlice = createSlice({
    name: 'branch',
    initialState: {
        branch: [],
        
    },
    reducers: {
        setBranch: (state, action) => {
            state.branch = action.payload
        },
        getBranches: (state, action) => {
            state.branch = action.payload
        },
        getBranchDetails: (state, action) => {
            state.branch = action.payload
        }
    }
});

export const {setBranch,getBranches,getBranchDetails} = branchSlice.actions;
export default branchSlice.reducer;
