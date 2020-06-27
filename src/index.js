import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import About from "./components/About";

import App from "./components/App";
import "./index.scss";

ReactDOM.render(
  <BrowserRouter>
    <React.Fragment>
      <Route path="/" exact component={App} />
      <Route path="/about" component={About} />
    </React.Fragment>
  </BrowserRouter>,
  document.getElementById("root")
);
