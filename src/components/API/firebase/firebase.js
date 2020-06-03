import firebase, { firestore } from 'firebase'

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
      signInFlow: 'popup',
      signInSuccessUrl: './',
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          console.log("HELLO!!!!");
          console.log(authResult.user)
          console.log(authResult.user.displayName)
          console.log(authResult.user.uid);
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
              // window.location.assign('./') 
            })
            .catch(error=>{
              console.log('error in adding ' +error);
              this.auth.signOut().then(()=>console.log('signed out')).catch(error=>console.log("can't even sign out"))
            })
          }
          return false;

        },
      },
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
    }
  }
}
 
export default Firebase;