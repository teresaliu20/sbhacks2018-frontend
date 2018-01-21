import React, { Component } from "react";
import styles from "./styles.css";
import firebase from "firebase";
import firebaseui from "firebaseui";
import firebasestyles from "./firebaseui.css";
import logo from "./alfie.png";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

class HomePage extends Component {
  render() {
    return (
      <div className="home-page">
        <img id="logo" src={logo} />
        <h1 id="title">Alpha</h1>
        <h2 id="phrase">Security through numbers</h2>
        <div id="firebaseui-auth-container" />
      </div>
    );
  }
}

export default compose(firebaseConnect(), connect())(HomePage);
