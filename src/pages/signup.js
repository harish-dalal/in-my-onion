import React from 'react';
import './signup.css'

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseContext } from '../components/API/firebase/index'

//todo : dont display signup if already signed in
const signUp = () => (
  <FirebaseContext.Consumer> 
  {firebase => 
    {return (
      <div className = 'sign'>
        <h1>In my onion</h1>
        <p>A place to share your onion on some weird stuff</p>
        <StyledFirebaseAuth uiConfig={firebase.uiConfig} firebaseAuth={firebase.auth}/>
      </div>
    );
  }}  
  </FirebaseContext.Consumer>
)

export default signUp;
