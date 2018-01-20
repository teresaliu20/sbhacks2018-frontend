import _ from "lodash";
import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import Header from "../Header";
import { geolocated } from 'react-geolocated';
import MyMapComponent from './MyMapComponent';


const enhance = _.identity;

class ReactGoogleMaps extends React.Component {
  render() {
    return !this.props.isGeolocationAvailable
      ? <div>Your browser does not support Geolocation</div>
      : !this.props.isGeolocationEnabled
        ? <div>Geolocation is not enabled</div>
        : this.props.coords
          ? <div>
              <Header key="header" />
              <MyMapComponent
                key="map"
                lat={this.props.coords.latitude}
                long={this.props.coords.longitude}
              />
            </div>
          : <div>Getting the location data&hellip; </div>;
  }
}


export default enhance(geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(ReactGoogleMaps));
