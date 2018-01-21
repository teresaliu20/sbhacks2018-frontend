import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { connect } from "react-redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import marker from "./icon.png";
import warning from "./warning.png";
import MarkerBlock from "../MarkerBlock";

// import styles from './styles.css';

let height = window.innerHeight - 60;

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.setState({ reports: [] });
  }

  componentWillMount() {
    var DATAREF = this.props.firebase.database().ref();
    DATAREF.on("value", snapshot => {
      if (snapshot.val() && snapshot.val().reports)
        this.setState({ reports: snapshot.val().reports });
      // console.log(this.state)
    });
    // console.log(this.props)
  }
  render() {
    return (
      <div>
        {this.state === null ||
        this.state.reports === null ||
        this.state.reports === undefined ? (
          <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
          >
            <Marker
              position={{ lat: this.props.lat, lng: this.props.lng }}
              icon={warning}
            />
          </GoogleMap>
        ) : (
          <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
          >
            <Marker
              position={{ lat: this.props.lat, lng: this.props.lng }}
              icon={warning}
            />
            {this.state.reports.map(report => {
              return <MarkerBlock report={report} />;
            })}
          </GoogleMap>
        )}
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
  })),
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env
      .REACT_APP_GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: height }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(MapView);
