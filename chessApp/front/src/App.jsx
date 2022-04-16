import { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import Navbar from './components/Navbar';
import Body from './components/Body';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"; 
import Game from './components/Game';
import { useDispatch } from 'react-redux';
import { fetchGames } from './store/game/gameSlice';

function App() {
  const [count, setCount] = useState(0)
  var dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchGames())
  }, [])

  return (
    <div className="App">
      <Navbar/>
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="about" element={<Body />} />
            <Route path="rankings" element={<Body />} />
            <Route path="/game/:gameId" element={<Game />} />
          </Routes>
    </div>
  )
}

export default App
