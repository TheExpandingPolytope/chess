import * as React from 'react';

// 1. import `NextUIProvider` component
import { NextUIProvider } from '@nextui-org/react';
import Navbar from './components/Navbar';
import Body from './components/Body';

function App() {
  return (
    <NextUIProvider>
      <Navbar/>
      <Body/>
    </NextUIProvider>
  );
}

export default App;
