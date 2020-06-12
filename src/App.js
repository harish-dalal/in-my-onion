import React , {Component} from 'react';
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import './App.css';
import {Switch , Route} from 'react-router-dom'
import Filldata from './components/test/filldatabase'
import Addquest from './components/addQuestion/Addquest'
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
        <div className='home-body'> 
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/AskQuest' component={Addquest}/>
            <Route exact path='/signup' component = {Signup}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
