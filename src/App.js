import React from 'react';
import Navbar from './components/Navbar/Navbar'
import SignUp from './pages/signup'
import Test from './pages/test'
import './App.css';

function App() {
  return (
    <div className = "App">
    <Navbar/>
    <SignUp/>
    <Test/>
    </div>
  );
}

export default App;
