import React, { Component } from "react";
import { Navbar, NavDropdown } from "react-bootstrap";
import auth from "../Logic/Auth";
import "../css/Navbar.css";
import axios from "axios";

export default class MyInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      info: {},
    };
  }

  componentDidMount() {
    const id = auth.id;

    axios
      .post("/user/myinfo", { id })
      .then((res) => this.setState({ info: res.data }))
      .catch((err) => alert(err.response.data.msg));
  }

  handleClick = () => {
    console.log("로그아웃");
    auth.logout();
    window.location.reload();
  };

  render() {
    const { info } = this.state;
    return (
      <div className="body-content">
        <div className="topNavbar">
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">메인으로</Navbar.Brand>

            <div className="nav_last">
              <NavDropdown title={auth.name} id="basic-nav-dropdown">
                <NavDropdown.Item href="/myinfo">내정보보기</NavDropdown.Item>
                <NavDropdown.Item onClick={this.handleClick}>
                  로그아웃
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </Navbar>
        </div>
        {info.name}
      </div>
    );
  }
}
