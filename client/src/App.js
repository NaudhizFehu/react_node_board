import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Redirect, Route, Switch } from "react-router-dom";

//View
import Board from "./View/Board";
import Login from "./View/Login";
import Register from "./View/Register";
import MyInfo from "./View/MyInfo";
import View from "./View/Read";
import WriteForm from "./View/WriteForm";

//인증 모듈
import auth from "./Logic/Auth";

//Route Component를 확장하여 인증이 필요한 Component 구현
function AuthRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth.loggedIn === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

class App extends React.Component {
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
        <Route exart path="/view/:no" component={View} />
        <AuthRoute exact path="/myinfo" component={MyInfo} />
        <AuthRoute exact path="/add" component={WriteForm} />
        <AuthRoute exact path="/edit/:no" component={WriteForm} />
      </Switch>
    );
  }
}

export default App;
