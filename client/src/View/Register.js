import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";

import axios from "axios";
import "../css/Register.css";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      name: null,
      password: null,
      phonenumber: null,
      b_register: false,
    };
  }

  register = async (event) => {
    event.preventDefault(); //form 이벤트 멈추기
    const { email, name, password, phonenumber } = this.state; //데이터 로드

    console.log(
      "register[email : " +
        email +
        " | name : " +
        name +
        " | password : " +
        password +
        " | phonenumber : " +
        phonenumber +
        "]"
    );

    axios
      .post("/user/register", { email, name, password, phonenumber })
      .then((res) => {
        this.setState({ b_register: true }); //회원가입 완료시 true
      })
      .catch((err) => alert(err.response.data.msg)); //회원가입 실패시 응답 메시지 알림
  };

  render() {
    const { b_register } = this.state; //회원가입 여부 불러옴
    if (b_register) return <Redirect to="/login" />; //가입 완료시 로그인페이지로 이동시킴
    return (
      <div className="content">
        <div className="login-wrapper">
          <form onSubmit={this.register}>
            <h2>회원가입</h2>
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
                <label>이름</label>
                <input
                  type="name"
                  className="form-control"
                  placeholder="Enter name"
                  onChange={(event) =>
                    this.setState({ name: event.target.value })
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
              <div className="form-group">
                <label>전화번호</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter phonenumber"
                  onChange={(event) =>
                    this.setState({ phonenumber: event.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="btn btn-dark btn-lg btn-block w-100"
                id="submit"
              >
                회원가입
              </button>
            </div>
          </form>

          <div className="line"></div>

          <Link to="">
            <button
              type="button"
              className="btn btn-primary btn-lg btn-block w-100"
              id="submit"
            >
              네이버로 회원가입
            </button>
            <p className="login">
              <Link to="/login">Already have an account? Login</Link>
            </p>
          </Link>
        </div>
      </div>
    );
  }
}
