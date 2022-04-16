import { createSlice } from "@reduxjs/toolkit";
import { createDummyGame, createDummyGames, getGameById } from "./gameHelper";

export const gameSlice = createSlice({
    name: "game",
    initialState: {
        games: [],
    },
    reducers: {
        setGames: (state, action) => {
            state.games = action.payload
        },
        updateGame: (state, action) => {
            var {id, game} = action.payload
            state.games.forEach((value, index) => {
                if(id == value.id)
                    state.games[index] == game  
            })
        },
        joinGame: (state, action) => {
            var {id, player} = action.payload
            state.games.forEach((value, index) => {
                if(id == value.id)
                    state.games[index].players.push(player)
            })
        },
        leaveGame: (state, action) => {
            var {id, player} = action.payload
            state.games.forEach((value, index) => {
                if(id == value.id){
                    var indexToRemove = state.games[index].players.indexOf(player)
                    state.games[index].players.splice(indexToRemove, 1)
                }
            })
        },
        addGame: (state, action) => {
            var game = action.payload
            state.games.push(game)
        },
        removeGame: (state, action) => {
            var { id } = action.payload
            state.games.forEach((value, index) => {
                if(id == value.id)
                    state.games.splice(index, 1)
            })
        },
        
    }
})

export const { setGames, updateGame, addGame, removeGame } = gameSlice.actions

export const fetchGames = () => async dispatch => {
    try{
        dispatch( setGames(createDummyGames()) )
    }
    catch(e){
        return console.error(e.message);
    }
}

export const sendMove = (id) => async dispatch => {
    try{
        var game = getGameById()
    }
    catch(e){
        return console.error(e.message);
    }
}

export const createGame = () => async dispatch => {
    try{
        var newGame = createDummyGame()
        dispatch(addGame(newGame))
    }
    catch(e){
        return console.error(e.message);
    }
}

export const joinGame = () => async dispatch => {
    try{
        setGames(createDummyGames())
    }
    catch(e){
        return console.error(e.message);
    }
}

export const leaveGame = () => async dispatch => {
    try{
        setGames(createDummyGames())
    }
    catch(e){
        return console.error(e.message);
    }
}

export default gameSlice.reducer