import firebase from 'firebase'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);

    this.auth = firebase.auth();
    this.db = firebase.firestore();

    this.uiConfig = {
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'redirect',
      signInSuccessUrl: './',
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          const user = authResult.user
          if(user.metadata.creationTime !== user.metadata.lastSignInTime) return true;
          else{
            this.db.collection('Users').doc(user.uid).set({
              userid : user.uid,
              createdDate : firebase.firestore.Timestamp.now(),
              userName : user.displayName,
              userProfilePicUrl : user.photoURL,
              quest : {},
            }).then(()=>{
              console.log('successfully added')
              window.location.assign('./') 
            })
            .catch(error=>{
              console.log('error in adding ' +error);
              this.auth.signOut().then(()=>console.log('signed out')).catch(error=>console.log("can't even sign out"))
            })
          }
          return false;

        },
      },
      signInOptions: [{
        // Leave the lines as is for the providers you want to offer your users.
        provider : firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        customParameters: {
          // Forces account selection even when one account
          // is available.
          prompt: 'select_account'
        } ,
      },
      {
        provider : firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        customParameters:{
          prompt : 'select_account'
        },
      },

    ],
    }
  }

  signinWithEmail(email , password){
    console.log('attemp sign in')
    this.auth.signInWithEmailAndPassword(email, password).then(()=>window.location.assign('./')).catch(error=>{
      if(error.code === 'auth/wrong-password'){
        alert('invalid email password combination')
      }
    })
  }

  createEmailUser(email , password , firstName , lastName){
    this.auth.createUserWithEmailAndPassword(email, password).then(()=>{
      const user = this.auth.currentUser
      user.updateProfile({
        displayName : firstName + ' ' + lastName
      }).then(()=>{
        user.sendEmailVerification()
        this.db.collection('Users').doc(user.uid).set({
          userid : user.uid,
          createdDate : firebase.firestore.Timestamp.now(),
          userName : user.displayName,
          userProfilePicUrl : user.photoURL,
          quest : {},
        }).then(()=>window.location.assign('./'))
      })
    }).catch(function(error) {
      // Handle Errors here.
      console.log(error)
      // ...
    });
  }
}
 
export default Firebase;