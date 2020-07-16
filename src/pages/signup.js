import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseContext } from '../components/API/firebase/'
import '../components/API/firebase/firebaseUI.css'
import {Input , Button , Divider} from '@material-ui/core'
import './signup.css'
//todo : dont display signup if already signed in

const createuser = (firebase) =>{
  // console.log(document.getElementById('email-input'))
  firebase.createEmailUser(document.getElementById('email-input').value , document.getElementById('password-input').value)
}

const signUp = () => (
  <FirebaseContext.Consumer> 
  {firebase => 
    {return (
      <div className = 'sign'>
      <div className = 'sign-transparent-div'>
        <h1>In My Onion</h1>
        <p>A place to share your onion on some weird stuff</p>
        <form className = 'email-password-form' onSubmit = {(event)=>firebase.createEmailUser(event.target.email.value , event.target.password.value)}
          style = {{display : 'flex' ,flexDirection : 'column'}}>
          <Input required={true} name = 'email' id = 'email-input' type='email' placeholder = 'email' /><br/>
          <Input required={true} name = 'password' id = 'password-input' type = 'password' placeholder = 'password'/>
          <Button size = 'small' fullWidth = {false} type='button' onClick = {() =>createuser(firebase)}>login</Button>
          <br/>
          <Divider/>
          <span style = {{color : 'grey' , fontSize : '.8rem'}}>or sign in with</span>
        </form>
        <StyledFirebaseAuth uiConfig={firebase.uiConfig} firebaseAuth={firebase.auth}/>
      </div>
      </div>
    );
  }}  
  </FirebaseContext.Consumer>
)

export default signUp;
