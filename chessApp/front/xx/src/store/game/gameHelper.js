import { Chess } from 'chess.js'

export const  generateUUID = () => { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export const createGame = (id, fen) => {
    return { id, fen, players: ["0xD319edC71026080c2F4c320ab19A8Dc06e90623e", "0xD319edC71026080c2F4c320ab19A8Dc06e90623e"] }
}

export const createDummyGame = () => {
    var board = new Chess(fen);
    return createGame(generateUUID(), board.fen())
}

export const getGameById = (games, id) => {
    return games.find(game => game.id == id)
}

export const submitMove = (game, move) => {
    var { id, fen } = game;
    var board = new Chess(fen);
    board.move(move)
    return createGame(
        id,
        board.fen()
    )
}

export const createDummyGames = () => {
    return [
        createGame("ABFV53", "rnb1kbnr/pp1p1p1p/2p3p1/4p3/1P5q/5P1P/P1PPP1P1/RNBQKBNR"),
        createGame("GTDDG6", "rnb1kbnr/pp1p1p1p/2p3p1/4p3/1P5q/5P1P/P1PPP1P1/RNBQKBNR"),
        createGame("56HYUI", "1nb3nr/3pkp1p/2p3p1/1p2p3/pP2r3/5P1P/P1PPPK2/RNBQ1BNq"),
        createGame("12CDG5", "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
    ]
}