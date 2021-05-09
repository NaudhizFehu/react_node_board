import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import auth from "../Logic/Auth";

class Board extends Component {
  constructor(props) {
    super(props);
  }

  check() {
    console.log("auth.checkAuth() : " + auth.checkAuth());
    if (auth.loggedIn === true) {
      return (
        <div>
          <h3>{auth.name}님이 로그인중입니다.</h3>
          <button type="button" onClick={auth.logout()}>
            로그아웃
          </button>
        </div>
      );
    } else {
      return <h3>로그인 안됨</h3>;
    }
  }

  render() {
    return <div>{this.check()}</div>;
  }
}

export default Board;
