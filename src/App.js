import React , {Component} from 'react';
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import './App.css';
import {Switch , Route} from 'react-router-dom'
import Filldata from './components/test/filldatabase'
import Signup from './pages/signup'

class App extends Component {
  constructor(){
    super()
    this.state = {
      sign : ""
    }
  }


  render(){
    return (
      <div className = "App">
      <Navbar/>   
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/testdata' component={Filldata}/>
          <Route exact path='/signup' component = {Signup}/>
        </Switch>
      </div>
    );
  }
}

export default App;
