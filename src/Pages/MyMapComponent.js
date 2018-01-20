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

class MyMapComponent extends React.Component {
  render(){
    console.log(this.props)
    return <GoogleMap defaultZoom={8} defaultCenter={{ lat: 51.503364, lng: -0.1276250 }}>
        <Marker position={{ lat: 51.503364, lng: -0.1276250 }} icon={ 'https://image.flaticon.com/icons/svg/33/33622.svg' } />
      </GoogleMap>
  }
}

export default compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyD1sQZEjthJsilgBk4vIqhA_rjNjTuBPvQ&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <MyMapComponent />
));