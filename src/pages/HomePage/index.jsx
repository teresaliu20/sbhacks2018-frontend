import React, { Component } from "react";
import styles from "./styles.css";
import firebase from "firebase";
import firebaseui from "firebaseui";
import firebasestyles from "./firebaseui.css";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

class HomePage extends Component {
  render() {
    return (
      <div className="home-page">
        <h1 id="title">Crime Report</h1>
        <div id="firebaseui-auth-container" />
      </div>
    );
  }
}

export default compose(firebaseConnect(), connect())(HomePage);
