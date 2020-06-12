import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import {Link} from 'react-router-dom'
import { FirebaseContext } from '../API/firebase'
import './navbar.css';

class Navbar extends Component{
	constructor(){
		super()
		this.state = {
			isSignedIn : false,
		}	
	}


	signOut(){
		this.context.auth.signOut().then(()=>{
			console.log('succesfully signed out')
		}).catch(error=>{
			console.log('error in signing out ' + error)
		})
	}

	componentDidMount(){
		this.context.auth.onAuthStateChanged(user=>{
			if(user!=null) this.setState({isSignedIn :  true});
			else this.setState({isSignedIn : false});
		})
	}

	render(){
		if(this.props.location.pathname !== '/signup'){
			return(
				<div className = 'navbar noselect'>
					<Link to = './'><p className = 'in-my-onion-link'>In My Onion</p></Link>
					<div  className = 'sign-button nodisplay' style={{marginLeft : 'auto'}}>
					<Link to = './AskQuest'><button>Ask</button></Link>
					</div>
					<div className = 'sign-button' style={{marginRight : '4%'}}>
						{
							this.state.isSignedIn ?
							<button onClick = {this.signOut.bind(this)}>Sign out</button>
							:<Link to = '/signup'><button>Sign in</button></Link>
						}
					</div>
				</div>
			)
		}
		else return null
	}
}

Navbar.contextType = FirebaseContext;

export default withRouter(Navbar);