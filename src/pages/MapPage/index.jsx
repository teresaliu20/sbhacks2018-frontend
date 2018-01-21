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
    backgroundColor: "rgba(0, 0, 0, 0.50)",
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
  state = {
    isOpen: false
  };

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
