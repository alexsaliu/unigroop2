import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from "firebase/app";
import 'firebase/auth';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import Header from './components/Header.js';
import Grid from './components/Grid.js';

firebase.initializeApp({
    apiKey: "AIzaSyDXFz7ffl9-K9OQDTV8DrOaRoyJcHITxnk",
    authDomain: "unigroop.firebaseapp.com"
})

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    // signInSuccessUrl: '/signedIn',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => {
            // setIsSignedIn(true);
            return false
        }
    }
};

function App() {
    const [isSignedIn, setIsSignedIn] = useState(localStorage.getItem("firebaseui::rememberedAccounts"));

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
        })
    }, [])

    if (isSignedIn) {
        return (
          <div className="App">
              Signed in
              <button onClick={()=>firebase.auth().signOut()}>Sign out!</button>
          </div>
        );
    }
    else {
        return (
            <div className="App">
                <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebase.auth()}
                />
            </div>
        );
    }
}

export default App;
