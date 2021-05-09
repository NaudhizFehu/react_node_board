import axios from "axios";
import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import auth from "../Logic/Auth";
import "../css/Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    auth.defaultURL();
    this.state = {
      email: null,
      password: null,
      loggedIn: false,
    };
  }

  login = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;

    axios
      .post("/user/login", { email, password }, { withCredentials: true })
      .then((res) => {
        auth.setAuth(res.data); //서버에서 받은 데이터를 로그인여부에 세팅
        alert(res.data.msg); //로그인 완료 안내창
        this.setState({ loggedIn: true }); //로그인 여부를 변경
      })
      .catch((err) => alert(err.response.data.msg)); //에러시 메세지창
  };

  render() {
    const { loggedIn } = this.state;
    if (loggedIn) return <Redirect to="/" />; //로그인이 되면 Board로 보냄
    return (
      <div className="content">
        <div className="login-wrapper">
          <form onSubmit={this.login}>
            <h2>로그인</h2>
            <div className="input-content">
              <div className="form-group">
                <label>이메일</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={(event) =>
                    this.setState({ email: event.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={(event) =>
                    this.setState({ password: event.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="btn btn-dark btn-lg btn-block w-100"
                id="submit"
              >
                로그인
              </button>
              <p className="forgot-password text-right">
                <Link to="">Forgot password?</Link>
              </p>
            </div>
          </form>

          <div className="line"></div>

          <Link to="/register">
            <button
              type="button"
              className="btn btn-primary btn-lg btn-block w-100"
              id="submit"
            >
              회원가입
            </button>
          </Link>
        </div>
      </div>
    );
  }
}
