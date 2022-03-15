import * as React from 'react';

// 1. import `NextUIProvider` component
import { NextUIProvider } from '@nextui-org/react';
import Navbar from './components/Navbar';

function App() {
  return (
    <NextUIProvider>
      <Navbar/>
    </NextUIProvider>
  );
}

export default App;
