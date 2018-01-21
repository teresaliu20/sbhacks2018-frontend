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
import marker from "./marker.png";
import warning from "./warning.png";
import Modal from "react-modal";
import nighttimeStyles from "./nighttimeStyles.json";
import daytimeStyles from "./daytimeStyles.json";
import styles from "./styles.css";
import $ from "jquery";
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import CustomUploadButton from "react-firebase-file-uploader/lib/CustomUploadButton";
import axios from "axios";
import alert3 from "./alert3.png";
import alert2 from "./alert2.png";
import alert1 from "./alert1.png";
import alfie from "./alfie_light.png";
import speech from "./speech.png";
import TimeAgo from "javascript-time-ago";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.50)",
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
    fontFamily: "Lato",
    zIndex: 10
  }
};

let height = window.innerHeight - 60;

class MapView extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    isOpen: false,
    reports: [],
    isOpen1: false,
    isOpen2: false,
    night: false,
    lat: 0,
    lng: 0,
    userID: 0,
    isMarkerOpen: false,
    currentReport: null,
    announceReport: null
  };

  componentDidMount() {
    Modal.setAppElement("body");
    console.log(this.props.firebase);
    var DATAREF = this.props.firebase.database().ref();
    DATAREF.on("value", snapshot => {
      if (snapshot.val() && snapshot.val().reports) {
        let reportsArr = [];
        let reports = snapshot.val().reports;
        console.log("HERE", snapshot.val().reports);
        for (var key in reports) {
          reportsArr.push(reports[key]);
        }
        this.setState({
          reports: reportsArr,
          announceReport: reportsArr[reportsArr.length - 1]
        });
        console.log(reportsArr);
      }
    });
  }

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
    setTimeout(() => {
      this.setState({ night: !this.state.night }, function() {
        this.render();
      });
    }, 10);
  }

  onMarkerClose() {
    this.setState({
      isMarkerOpen: false
    });
  }

  onMarkerOpen(report) {
    this.setState({
      currentReport: report,
      isMarkerOpen: true
    });
  }

  // REPORT CRIME STUFF
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
    var lat = this.state.lat;
    var lng = this.state.lng;

    console.log("REQ", {
      user: this.state.userID,
      name: document.getElementById("name").value,
      description: document.getElementById("description").value,
      lat: lat,
      lng: lng,
      time: timestamp,
      severity: document.getElementById("severity").value
    });

    var tname = document.getElementById("name").value;
    var tdesc = document.getElementById("description").value;

    axios
      .post(
        "https://us-central1-sbhacks-corefour.cloudfunctions.net/api/report",
        {
          user: this.state.userID,
          name: document.getElementById("name").value,
          description: document.getElementById("description").value,
          lat: lat,
          lng: lng,
          time: timestamp,
          severity: document.getElementById("severity").value
        }
      )
      .then(response => {
        console.log("RESP", response);
        $("#message").hide();
        this.hideModal();
        var msg =
          tname + " - " + tdesc + " - " + " (text 'STOP' to unsubscribe)";
        axios
          .get(
            "https://us-central1-sbhacks-corefour.cloudfunctions.net/api/notifyAll/" +
              msg
          )
          .then(function(response) {
            console.log(response);
          })
          .catch(function(error) {
            console.log(error);
          });
      });
  }

  selectPositionEnabled = false;

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

  beginReport() {
    console.log("Clicked report!");
    $("#message").show();
    this.selectPositionEnabled = true;
  }

  ///////////////////////////

  onClickMap(data) {
    if (this.selectPositionEnabled) {
      let lat = data.latLng.lat();
      let lng = data.latLng.lng();
      this.setState({ lat: lat, lng: lng });
      this.openModal();
      this.selectPositionEnabled = false;
    }
  }

  render() {
    console.log("REPS", this.state.reports);
    var style = {
      styles: this.state.night ? daytimeStyles : nighttimeStyles
    };
    return (
      <div>
        <p id="message">Click on the map to select a location.</p>
        <Modal
          isOpen={this.state.isOpen}
          contentLabel="Modal"
          style={customStyles}
        >
          <div className="modal-inner">
            <h1 className="title">Submit an Anonymous Report</h1>
            <p className="description">
              <p>Provide a keyword for what you are reporting </p>
              <input className="form-input" type="text" id="name" name="name" />
              <br />
              <p className="description">
                Briefly describe what you are reporting{" "}
              </p>
              <input
                className="form-input"
                type="text"
                id="description"
                name="description"
              />
              <br />
              <p className="description">
                How severe is the event you are reporting? (1-3){" "}
              </p>
              <input
                className="form-input"
                type="text"
                id="severity"
                name="severity"
              />
              <br />
              <br />
              <div id="custom-button">
                <CustomUploadButton
                  accept="image/*"
                  name="avatar"
                  filename={file =>
                    this.state.userID +
                    "-" +
                    document.getElementById("name").value
                  }
                  storageRef={firebase.storage().ref("images")}
                  style={{
                    backgroundColor: "#f5ae2a",
                    color: "white",
                    padding: 10,
                    borderRadius: 5,
                    fontSize: 16,
                    margin: 20
                  }}
                >
                  Upload Image
                </CustomUploadButton>
              </div>
            </p>
            <br />
            <hr />
            <div id="button-row">
              <div
                id="close-button"
                className="button"
                onClick={this.hideModal}
              >
                Cancel
              </div>
              <div
                id="submit-button"
                className="button"
                onClick={() => this.reportCrime()}
              >
                Submit
              </div>
            </div>
          </div>
        </Modal>
        <div className="buttons">
          <div id="report-button" onClick={() => this.beginReport()}>
            Report
          </div>
          <div id="time-button" onClick={() => this.toggleDayNight()}>
            Mode
          </div>
        </div>
        {this.state === null ||
        this.state.reports === undefined ||
        this.state.reports.length === 0 ||
        this.state.reports === undefined ||
        this.state.night === undefined ? (
          <GoogleMap
            defaultZoom={15}
            defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
            defaultOptions={style}
            onClick={data => this.onClickMap(data)}
          >
            <Marker
              position={{ lat: this.props.lat, lng: this.props.lng }}
              icon={marker}
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
                <div id="you-button" onClick={() => this.onCloseModal1()}>
                  Close
                </div>
              </Modal>
            </div>
          </GoogleMap>
        ) : (
          <GoogleMap
            defaultZoom={15}
            defaultCenter={{ lat: this.props.lat, lng: this.props.lng }}
            defaultOptions={style}
            onClick={data => this.onClickMap(data)}
          >
            <div>
              <Modal
                id="modal2"
                isOpen={this.state.isOpen2}
                contentLabel="Modal"
                style={customStyles}
              >
                <h1>This is you!</h1>
                <div id="you-button" onClick={() => this.onCloseModal2()}>
                  Close
                </div>
              </Modal>
            </div>
            <Marker
              position={{ lat: this.props.lat, lng: this.props.lng }}
              icon={marker}
              animation={window.google.maps.Animation.DROP}
              onClick={() => this.onOpenModal2()}
            />
            {this.state.reports.map((report, i) => {
              return (
                <Marker
                  position={{ lat: report.lat, lng: report.lng }}
                  icon={warning}
                  animation={window.google.maps.Animation.DROP}
                  onClick={() => this.onMarkerOpen(report)}
                />
              );
            })}
          </GoogleMap>
        )}
        {this.state.currentReport && (
          <Modal
            isOpen={this.state.isMarkerOpen}
            contentLabel="Modal"
            style={customStyles}
          >
            <div className="modal-inner-marker">
              <h1>{this.state.currentReport.name}</h1>
              <img
                id="modal-img"
                src={
                  "https://firebasestorage.googleapis.com/v0/b/sbhacks-corefour.appspot.com/o/images%2F" +
                  this.state.userID +
                  "-" +
                  this.state.currentReport.name +
                  ".jpg?alt=media"
                }
              />
              <hr noshade="true" className="line" />
              <h2>{this.state.currentReport.description}</h2>
              <img
                className="alert-image"
                src={require(`./alert${this.state.currentReport.severity}.png`)}
              />
              <div
                className="close-button"
                onClick={() => this.onMarkerClose()}
              >
                Close
              </div>
            </div>
          </Modal>
        )}
        <div id="alfie-box">
          <img id="alfie" src={alfie} />
          {this.state.announceReport && (
            <div>
              <img id="speech" src={speech} />
              <div id="speech-text">
                <p className="bold">
                  {" " +
                    this.state.announceReport.name +
                    ": " +
                    this.state.announceReport.description}
                </p>
                <p id="time">{this.state.announceReport.time}</p>
              </div>
            </div>
          )}
        </div>
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
