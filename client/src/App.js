import React, { Component } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Route, Switch } from "react-router-dom";

//View
import Board from "./View/Board";
import Login from "./View/Login";
import Register from "./View/Register";

//인증 모듈
import auth from "./Logic/Auth";

class App extends Component {
  constructor(props) {
    super(props);
    auth.checkAuth();
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Board} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>
    );
  }
}

export default App;
