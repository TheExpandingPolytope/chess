import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { NextUIProvider } from '@nextui-org/react';
import store from "./store/index";
import { Provider } from 'react-redux';
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { BrowserRouter as Router } from "react-router-dom";

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000; // frequency provider is polling
  return library;
};

ReactDOM.render(
  <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
          <NextUIProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
          </NextUIProvider>
        </Router>
      </Web3ReactProvider>
  </Provider>,

  document.getElementById('root')
)
