import React from 'react';
import './signup.css'

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseContext } from '../components/API/firebase/index'
import '../components/API/firebase/firebaseUI.css'
//todo : dont display signup if already signed in
const signUp = () => (
  <FirebaseContext.Consumer> 
  {firebase => 
    {return (
      <div className = 'sign'>
      <div className = 'sign-transparent-div'>
        <h1>In My Onion</h1>
        <p>A place to share your onion on some weird stuff</p>
        <StyledFirebaseAuth uiConfig={firebase.uiConfig} firebaseAuth={firebase.auth}/>
      </div>
      </div>
    );
  }}  
  </FirebaseContext.Consumer>
)

export default signUp;
