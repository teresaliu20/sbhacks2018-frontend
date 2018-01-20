import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import MapPage from "./pages/MapPage";
import HomePage from "./pages/HomePage";
import "./App.css";

const App = () => (
	<HashRouter>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/map" component={MapPage} />
      <Route render={() => "404 Page"} />
    </Switch>
    </HashRouter>
);

export default (App);
