import React, { Component } from "react";
import marker from "./icon.png";
import warning from "./warning.png";
import { Marker } from "react-google-maps";
import Modal from "react-modal";
import alert3 from "./alert3.png";
import alert2 from "./alert2.png";
import alert1 from "./alert1.png";
import styles from "./styles.css";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.50)",
    zIndex: 10
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    color: "#360D60",
    fontFamily: "Lato"
  }
};

class MarkerBlock extends Component {
  state = {
    isOpen: false
  };

  onOpenModal() {
    this.setState({
      isOpen: true
    });
  }

  onCloseModal() {
    this.setState({
      isOpen: false
    });
  }

  render() {
    console.log("HERE", this.props.report);
    return (
      <div>
        <Marker
          position={{
            lat: parseInt(this.props.report.lat),
            lng: parseInt(this.props.report.lng)
          }}
          icon={marker}
          animation={window.google.maps.Animation.DROP}
          onClick={() => this.onOpenModal()}
        />
        <Modal
          isOpen={this.state.isOpen}
          contentLabel="Modal"
          style={customStyles}
        >
          <div className="modal-inner">
            <h1>{this.props.report.name}</h1>
            <hr noshade="true" className="line" />
            <h2>{this.props.report.description}</h2>
            <img className="alert-image" src={require(`./alert2.png`)} />
            <div className="close-button" onClick={() => this.onCloseModal()}>
              Close
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default MarkerBlock;
