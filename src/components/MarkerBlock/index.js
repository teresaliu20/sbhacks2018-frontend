import React, { Component } from "react";
import marker from "./icon.png";
import warning from "./warning.png";
import { Marker } from "react-google-maps";

class MarkerBlock extends Component {
  render() {
    return (
      <Marker
        position={{ lat: this.props.report.lat, lng: this.props.report.lng }}
        icon={marker}
      />
    );
  }
}

export default MarkerBlock;
