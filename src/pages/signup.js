import React , {useState, useContext} from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseContext } from '../components/API/firebase/'
import '../components/API/firebase/firebaseUI.css'
import {Input , Button , Divider , TextField , withStyles} from '@material-ui/core'
import './signup.css'
//todo : dont display signup if already signed in



const createuser = (firebase) =>{
  // console.log(document.getElementById('email-input'))
  
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  if (reg.test(document.getElementById('signup-email').value) == false) 
  {
      alert('Invalid Email Address');
      return;
  }

  if(document.getElementById('signup-password').value !== document.getElementById('signup-retypepassword').value){
    alert("password dosen't match");
    return;
  }
  firebase.createEmailUser(document.getElementById('signup-email').value , document.getElementById('signup-password').value)
}


const SignUp = () => {
      const [signupDisplay , setSignupDisplay] = useState(false)
      const firebase = useContext(FirebaseContext)
      return (
      <div className = 'sign'>
      <div className = 'sign-transparent-div'>
        <h1>In My Onion</h1>
        <p>A place to share your onion on some weird stuff</p>
        <div style = {{alignSelf:'center' , display : 'flex' , flexDirection : 'row' , justifyContent : 'center'}}>
          <div className = {'container-signup '+ (signupDisplay && 'nodisplay')}>
            <form className = 'email-password-form' action = 'get' onSubmit = {(event)=>{event.preventDefault(); firebase.signinWithEmail(event.target.email.value , event.target.password.value)}}
              style = {{display : 'flex' ,flexDirection : 'column'}}>
              <TextField variant = 'outlined' size = 'small' style = {{width : '80%' , backgroundColor : 'none'}} required name = 'email' id = 'email-input' type='email' placeholder = 'email' /><br/>
              <TextField variant = 'outlined' size = 'small' style = {{width : '80%'}} required name = 'password' id = 'password-input' type = 'password' placeholder = 'password'/>
              <span><Button color = 'primary' size = 'small' fullWidth = {false} type='submit'>login</Button></span>
              <br/>
              <span style = {{color : 'grey' , fontSize : '.8rem' , display : 'flex' , flexDirection : 'row'}}>
                <hr style = {{width :'100px' , height : '0px' , borderLeft : '0'}}/>
                or sign in with
                <hr style = {{width :'100px' , height : '0px' , borderLeft : '0'}}/>
              </span>
            </form>
            <StyledFirebaseAuth uiConfig={firebase.uiConfig} firebaseAuth={firebase.auth}/>
            <br/>
            </div>
            <div className = {'container-signup email-signup-container ' +  (signupDisplay && 'display')} >
              <span style={{marginBottom:'20px' , color : 'grey'}}>sign up for new account</span>
              <form action = 'get' onSubmit = {(event)=>{event.preventDefault(); createuser(firebase)}}>
                <br/>
                <span>
                  <TextField className = 'signup-name' id = 'signup-firstname' required placeholder = 'first name' size = 'small' variant = 'outlined'/>
                  <TextField className = 'signup-name' id = 'signup-lastname' required placeholder = 'last name' size='small' variant = 'outlined'/>
                </span>
                <TextField className = 'signup-cred' id = 'signup-email' required type = 'email' placeholder = 'email' size='small' variant = 'outlined'/>
                <TextField className = 'signup-cred' size = 'small' required type = 'password' placeholder = 'password' id='signup-password' variant = 'outlined'/>
                <TextField className = 'signup-cred' size = 'small' required type = 'password' placeholder = 'retype-password' id='signup-retypepassword' variant = 'outlined'/>
                <Button type='submit' id = 'signup-button' color = 'primary'>Sign up</Button>
              </form>
              <br/>
            </div>
          <br/>
        </div>
        <div className='new-signup'>
            <span className = {'mobile ' + (signupDisplay ? 'nodisplay' : '')}>Or <span className = 'link-signup' onClick = {()=>setSignupDisplay(true)}>sign up</span> with email and password. </span>
            <span className = {'mobile link-signup '+ (signupDisplay ? '' : ' nodisplay')} onClick = {()=>setSignupDisplay(false)}>Back to sign in. </span>
          By signing up you indicate that you have read and agree to InMyOnion's Terms of Service and Privacy Policy.
        </div>
        <br/>
      </div>
      <p style = {{fontSize : '.8rem' , color : 'grey' , marginRight : '30px' , alignSelf : 'flex-end'}}>Developer Harish</p>
      </div>
    );
}

export default SignUp;
