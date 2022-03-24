import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
    name: "game",
    initialState: {
        rankings: [],
        games: [],
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

export default gameSlice.reducer