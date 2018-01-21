import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.css";

const enhance = _.identity;

const AdminHeader = ({ watchers, forks, repositories }) => (
  <div id="admin-header" className="header">
    <h1 id="title">
      Alpha <span className="italic">ADMIN</span>
    </h1>
    <Link to={`/`} id="home-admin-button">
      Home
    </Link>
  </div>
);

export default enhance(AdminHeader);
