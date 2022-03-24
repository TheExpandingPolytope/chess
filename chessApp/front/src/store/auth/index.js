import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        isSignedIn: false,
        isAuthenticating: false,
    },
    reducers: {
        setIsSignedIn: (state, action) => {
            state.isSignedIn = action.payload
        },
        setIsAuthenticating: (state, action) => {
            state.isAuthenticating = action.payload
        }
    }
})

export const { setIsSignedIn, setIsAuthenticating } = authSlice.actions

export default authSlice.reducer