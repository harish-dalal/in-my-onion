import React , {Component} from 'react';
import Navbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import Footer from './components/footer/Footer'
import {Switch , Route} from 'react-router-dom'
import Addquest from './components/addQuestion/Addquest'
import Signup from './pages/signup'
import BookmarkHome from './components/bookmarkHome/BookmarkHome'
import MyQuestHome from './components/myQuestHome/MyQuestHome'
import './App.css';

class App extends Component {
  constructor(){
    super()
    this.state = {
      displayFoot : true,
    }
    this.lastScrollTop = window.pageYOffset
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
					<Route exact path='/Bookmarked' component = {BookmarkHome}/>
					<Route exact path='/MyQuestHome' component = {MyQuestHome}/>
					</Switch>
				</div>
				<Footer/>
			</div>
		);
	}
}

export default App;
