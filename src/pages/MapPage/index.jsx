import _ from "lodash";
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import Header from "../../components/Header";
import { geolocated } from 'react-geolocated';
import MapView from '../../components/MapView';
import styles from './styles.css';
import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'


const enhance = _.identity;

class ReactGoogleMaps extends Component {
  componentWillMount() {
    // var DATAREF = this.props.firebase.database().ref(); 
    // DATAREF.on("value", function(snapshot) {
    //  console.log(snapshot.val())
    // })
  }
  render() {
    return !this.props.isGeolocationAvailable
      ? <div className="loading-message">Your browser does not support Geolocation</div>
      : !this.props.isGeolocationEnabled
        ? <div className="loading-message">Geolocation is not enabled</div>
        : this.props.coords
          ? <div className="map-page">
              <Header key="header" />
              <MapView
                key="map"
                lat={this.props.coords.latitude}
                lng={this.props.coords.longitude}
              />
            </div>
          : <div className="loading-message">Getting the location data&hellip; </div>;
  }
}


export default compose(
  firebaseConnect([
    'todos' // { path: '/todos' } // object notation
  ]),
  connect(
    (state) => ({
      todos: state.firebase.data.todos,
      profile: state.firebase.profile // load profile
    })
  )
)(enhance(geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(ReactGoogleMaps)));

