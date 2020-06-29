import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import {Link} from 'react-router-dom'
import Profile from '../profilePic/ProfilePic'
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
					<div className = 'sign-button nodisplay-saved' style = {{marginLeft : 'auto'}}>
						<Link to = './Bookmarked'>
							<button>Saved</button>
						</Link>
					</div>
					<div  className = 'sign-button ask-quest-txt nodisplay-ask' style={{marginLeft : 'auto'}}>
						<Link to = './AskQuest'>
							<button><svg height="20px" viewBox="0 -1 401.52289 401" width="20px"><g style={{stroke : 'white' , strokeWidth : '20px'}}><path d="m370.589844 250.972656c-5.523438 0-10 4.476563-10 10v88.789063c-.019532 16.5625-13.4375 29.984375-30 30h-280.589844c-16.5625-.015625-29.980469-13.4375-30-30v-260.589844c.019531-16.558594 13.4375-29.980469 30-30h88.789062c5.523438 0 10-4.476563 10-10 0-5.519531-4.476562-10-10-10h-88.789062c-27.601562.03125-49.96875 22.398437-50 50v260.59375c.03125 27.601563 22.398438 49.96875 50 50h280.589844c27.601562-.03125 49.96875-22.398437 50-50v-88.792969c0-5.523437-4.476563-10-10-10zm0 0" data-original="#000000" data-old_color="#000000" fill="#FFFFFF"/><path d="m376.628906 13.441406c-17.574218-17.574218-46.066406-17.574218-63.640625 0l-178.40625 178.40625c-1.222656 1.222656-2.105469 2.738282-2.566406 4.402344l-23.460937 84.699219c-.964844 3.472656.015624 7.191406 2.5625 9.742187 2.550781 2.546875 6.269531 3.527344 9.742187 2.566406l84.699219-23.464843c1.664062-.460938 3.179687-1.34375 4.402344-2.566407l178.402343-178.410156c17.546875-17.585937 17.546875-46.054687 0-63.640625zm-220.257812 184.90625 146.011718-146.015625 47.089844 47.089844-146.015625 146.015625zm-9.40625 18.875 37.621094 37.625-52.039063 14.417969zm227.257812-142.546875-10.605468 10.605469-47.09375-47.09375 10.609374-10.605469c9.761719-9.761719 25.589844-9.761719 35.351563 0l11.738281 11.734375c9.746094 9.773438 9.746094 25.589844 0 35.359375zm0 0" data-original="#000000" data-old_color="#000000" fill="#FFFFFF"/></g> </svg>Ask</button>
						</Link>
					</div>
					<div className = 'sign-button' style={{marginRight : '4%'}}>
						{
							this.state.isSignedIn ?
							<div style = {{display : 'flex' , flexDirection : 'row' , alignItems : 'center' , height : '100%'}}>
								<button onClick = {this.signOut.bind(this)}>Sign out</button>
								<div style = {{height : '35px' , width : '35px'}}><Profile imageUrl = {this.context.auth.currentUser.photoURL}/></div>
							</div>
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