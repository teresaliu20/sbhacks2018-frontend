import React, { Component } from "react";
import styles from "./styles.css";
import firebase from "firebase";
import firebaseui from "firebaseui";
import firebasestyles from "./firebaseui.css";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

// var config = {
//       apiKey: process.env.REACT_APP_FIREBASE_KEY,
//       authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//       databaseURL: 'https://sbhacks-corefour.firebaseio.com/',
//       projectId: process.env.REACT_APP_PROJECT_ID,
//       storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//       messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
//   };

//   console.log("Initialized")
//   firebase.initializeApp(config);
//   var uiConfig = {
//       signInSuccessUrl: 'http://localhost:3000/#/map',
//       signInOptions: [
//           // Leave the lines as is for the providers you want to offer your users.
//           firebase.auth.EmailAuthProvider.PROVIDER_ID,
//           firebase.auth.PhoneAuthProvider.PROVIDER_ID
//       ],
//       // Terms of service url.
//       tosUrl: '<your-tos-url>'
//   };
//   // Initialize the FirebaseUI Widget using Firebase.
//   var ui = new firebaseui.auth.AuthUI(firebase.auth());
//   // The start method will wait until the DOM is loaded.
//   ui.start('#firebaseui-auth-container', uiConfig);

//   var DATAREF = firebase.database().ref();

class HomePage extends Component {
  componentWillMount() {
    // var DATAREF = this.props.firebase.database().ref();
    // DATAREF.on("value", function(snapshot) {
    //  console.log(snapshot.val())
    // })
  }

  render() {
    return (
      <div className="home-page">
        <h1 id="title">Crime Report</h1>
        <div id="firebaseui-auth-container" />
      </div>
    );
  }
}

export default compose(
  firebaseConnect([
    "todos" // { path: '/todos' } // object notation
  ]),
  connect(state => ({
    todos: state.firebase.data.todos,
    profile: state.firebase.profile // load profile
  }))
)(HomePage);
