import * as React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import Navbar from './components/Navbar';
import Body from './components/Body';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"; 
import Game from './components/Game';
import store from "./store/index";
import { Provider } from 'react-redux';
console.log(store)
function App() {
  return (
    <Provider store={store}>
      <Router>
        <NextUIProvider>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="about" element={<Body />} />
            <Route path="rankings" element={<Body />} />
            <Route path="game" element={<Game />} />
          </Routes>
        </NextUIProvider>
      </Router>
    </Provider>
  );
}

export default App;
