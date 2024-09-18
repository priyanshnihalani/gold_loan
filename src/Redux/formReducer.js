import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
    name: 'form',
    initialState: {
        form1: {},
        form2: [],
    },
    reducers: {
        nameandphone: (state, action) => {
            state.form1 = {}
            state.form1 = {...action.payload}
        },
        goldinfo: (state, action) => {
            // [{image: binary, name: chain, weight: 34, carats: 22k},{image: binary, name: chain, weight: 34, carats: 22k}]
            state.form2 = []
            state.form2 = [...action.payload]
        }
        
    }
})
export const { goldinfo, nameandphone } = formSlice.actions;
export default formSlice.reducer;