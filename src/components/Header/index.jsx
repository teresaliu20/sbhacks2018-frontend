import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import styles from './styles.css';

const enhance = _.identity;

const Header = ({ watchers, forks, repositories }) => (
  <div className="header">
      <h1 id="title">Crime Report</h1>
      <Link to={`/`} id="home-button">Home</Link>
  </div>
);

export default enhance(Header);
