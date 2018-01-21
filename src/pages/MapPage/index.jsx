import React, { Component } from "react";
import _ from "lodash";
import { compose } from "recompose";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Header from "../../components/Header";
import { geolocated } from "react-geolocated";
import MapView from "../../components/MapView";
import styles from "./styles.css";
import { connect } from "react-redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import Modal from "react-modal";
import $ from "jquery";
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import axios from "axios";

const enhance = _.identity;

console.log("HERE NISHIIIIRR");

const customStyles = {
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.50)",
    zIndex: 10
  },
  content: {
    top: "70%",
    left: "70%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    color: "#360D60",
    fontFamily: "Lato"
  }
};

class ReactGoogleMaps extends Component {
  reportCrime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var timestamp =
      year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

    axios
      .post(
        "https://us-central1-sbhacks-corefour.cloudfunctions.net/api/report",
        {
          user: this.state.userID,
          name: document.getElementById("name").value,
          description: document.getElementById("description").value,
          lat: "lat",
          lng: "lng",
          time: timestamp,
          severity: document.getElementById("severity").value
        }
      )
      .then(response => {
        console.log(response);
      });
  }

  state = {
    isOpen: false,
    userID: ""
  };

  componentWillMount() {
    var uid = "";
    this.props.firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        uid = user.uid;
        var providerData = user.providerData;
        console.log("USER ID IS: ", uid);
        this.setState({
          userID: uid
        });
      } else {
        // User is signed out.
        // ...
      }
    });
  }

  componentUpdate() {
    var uid = "";
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        uid = user.uid;
        var providerData = user.providerData;
        console.log("USER ID IS: ", uid);
      } else {
        // User is signed out.
        // ...
      }
    });
  }

  openModal = () => {
    this.setState({
      isOpen: true
    });
  };

  hideModal = () => {
    this.setState({
      isOpen: false
    });
  };

  openReportModal() {
    console.log("Clicked report!");
    this.openModal();
  }

  render() {
    return !this.props.isGeolocationAvailable ? (
      <div className="loading-message">
        Your browser does not support Geolocation
      </div>
    ) : !this.props.isGeolocationEnabled ? (
      <div className="loading-message">Geolocation is not enabled</div>
    ) : this.props.coords ? (
      <div className="map-page">
        <Header key="header" />
        <MapView
          key="map"
          lat={this.props.coords.latitude}
          lng={this.props.coords.longitude}
        />
        <Modal isOpen={this.state.isOpen} contentLabel="Modal">
          <button onClick={this.hideModal}>X</button>
          <h1>Submit an Anonymous Report</h1>
          <p>
            Provide a keyword for what you are reporting:{" "}
            <input type="text" id="name" name="name" />
            <br />
            Briefly describe what you are reporting:{" "}
            <input type="text" id="description" name="description" />
            <br />
            How severe is the event you are reporting? (1-3){" "}
            <input type="text" id="severity" name="severity" />
            <br />
            <FileUploader
              accept="image/*"
              name="avatar"
              filename={file =>
                this.state.userID + document.getElementById("name").value
              }
              storageRef={firebase.storage().ref("images")}
            />
            <button onClick={this.reportCrime}>Submit</button>
          </p>
        </Modal>
      </div>
    ) : (
      <div className="loading-message">Getting the location data&hellip; </div>
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
)(
  enhance(
    geolocated({
      positionOptions: {
        enableHighAccuracy: false
      },
      userDecisionTimeout: 5000
    })(ReactGoogleMaps)
  )
);
