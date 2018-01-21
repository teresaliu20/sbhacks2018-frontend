import React from "react";
import { compose, withProps, withStateHandlers } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Animation
} from "react-google-maps";
import { connect } from "react-redux";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import marker from "./icon.png";
import warning from "./warning.png";
import MarkerBlock from "../MarkerBlock";
import Modal from "react-modal";
import nighttimeStyles from "./nighttimeStyles.json";
import daytimeStyles from "./daytimeStyles.json";
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

let height = window.innerHeight - 60;

class MapView extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    reports: [],
    isOpen1: false,
    isOpen2: false,
    night: false
  };

  componentDidMount() {
    Modal.setAppElement("body");
    console.log(this.props.firebase);
    var DATAREF = this.props.firebase.database().ref();
    DATAREF.on("value", snapshot => {
      let reportsArr = [];
      let reports = snapshot.val();
      for (var key in reports) {
        reportsArr.push(reports[key]);
      }
      this.setState({ reports: reportsArr });
      console.log(reportsArr);
    });
    // console.log(this.props)
  }

  onOpenModal1() {
    this.setState({
      isOpen1: true
    });
  }

  onOpenModal2() {
    this.setState({
      isOpen2: true
    });
  }

  onCloseModal1() {
    this.setState({
      isOpen1: false
    });
  }

  onCloseModal2() {
    this.setState({
      isOpen2: false
    });
  }

  toggleDayNight() {
    console.log("here", this.state.night);
    setTimeout(() => {
      this.setState({ night: !this.state.night }, function() {
        this.render();
      });
    }, 10);
  }

  render() {
    console.log("RENDER", this.state.night);
    var style = {
      styles: this.state.night ? daytimeStyles : nighttimeStyles
    };
    return (
      <div>
        <div className="buttons">
          <div id="time-button" onClick={() => this.toggleDayNight()}>
            Mode
          </div>
        </div>
        {this.state === null ||
        this.state.reports === null ||
        this.state.reports.length === 0 ||
        this.state.reports === undefined ||
        this.state.night === undefined ? (
          <GoogleMap
            defaultZoom={15}
            defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
            defaultOptions={style}
          >
            <Marker
              position={{ lat: this.props.lat, lng: this.props.lng }}
              icon={warning}
              animation={window.google.maps.Animation.DROP}
              onClick={() => this.onOpenModal1()}
            />
            <div>
              <Modal
                id="modal1"
                isOpen={this.state.isOpen1}
                contentLabel="Modal"
                style={customStyles}
              >
                <h1>This is you!</h1>
                <div onClick={() => this.onCloseModal1()}>Close</div>
              </Modal>
            </div>
          </GoogleMap>
        ) : (
          <GoogleMap
            defaultZoom={15}
            defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
            defaultOptions={style}
          >
            <div>
              <Modal
                id="modal2"
                isOpen={this.state.isOpen2}
                contentLabel="Modal"
                style={customStyles}
              >
                <h1>This is you!</h1>
                <div onClick={() => this.onCloseModal2()}>Close</div>
              </Modal>
            </div>
            <Marker
              position={{ lat: this.props.lat, lng: this.props.lng }}
              icon={warning}
              onMouseOver={() => this.hoverOverYourself()}
              animation={window.google.maps.Animation.DROP}
              onClick={() => this.onOpenModal2()}
            />
            {this.state.reports.map((report, i) => {
              return <MarkerBlock report={report} key={i} />;
            })}
          </GoogleMap>
        )}
      </div>
    );
  }
}

export default compose(
  firebaseConnect([]),
  connect(state => ({
    todos: state.firebase.data.todos,
    profile: state.firebase.profile // load profile
  })),
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${
      process.env.REACT_APP_GOOGLE_KEY
    }&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: height }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(MapView);
