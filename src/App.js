import React from 'react';
import Navbar from './components/Navbar/Navbar'
import SignUp from './pages/signup'
import Home from './components/Home/Home'
import './App.css';

function App() {
  return (
    <div className = "App">
    <Navbar/> 
    <Home/>
    </div>
  );
}

export default App;
