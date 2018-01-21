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

const enhance = _.identity;

class ReactGoogleMaps extends Component {
  componentWillMount() {
    // var DATAREF = this.props.firebase.database().ref();
    // DATAREF.on("value", function(snapshot) {
    //  console.log(snapshot.val())
    // })
  }
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
        <div className="buttons">
          <div id="report-button" onClick={() => this.openReportModal()}>
            Report
          </div>
        </div>
        <MapView
          key="map"
          lat={this.props.coords.latitude}
          lng={this.props.coords.longitude}
        />
        <Modal isOpen={this.state.isOpen} contentLabel="Modal">
          <h1>Modal Content</h1>
          <p>Etc.</p>
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
