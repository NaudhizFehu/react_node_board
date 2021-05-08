import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/Login.css";

export default class Login extends Component {
  render() {
    return (
      <div className="content">
        <div className="login-wrapper">
          <form>
            <h2>로그인</h2>
            <div className="input-content">
              <div className="form-group">
                <label>이메일</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
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
