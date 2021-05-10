import React, { Component, Fragment } from "react";
import auth from "../Logic/Auth";
import {
  Form,
  FormControl,
  Navbar,
  Button,
  Row,
  Col,
  NavDropdown,
} from "react-bootstrap";
import "../css/Board.css";
import "../css/Navbar.css";
import { Link } from "react-router-dom";

function ViewLogFunc(props) {
  const isloggedIn = props.isloggedIn;
  if (isloggedIn) return <LoginFunc />;
  else return <NotLoginFunc />;
}

function LoginFunc(props) {
  const handleClick = () => {
    console.log("로그아웃 눌림");
    auth.logout();
    window.location.reload();
  };

  return (
    <Fragment>
      <NavDropdown title={auth.name} id="basic-nav-dropdown">
        <NavDropdown.Item href="/myinfo">내정보보기</NavDropdown.Item>
        <NavDropdown.Item onClick={handleClick}>로그아웃</NavDropdown.Item>
      </NavDropdown>
    </Fragment>
  );
}

function NotLoginFunc(props) {
  return (
    <Fragment>
      <div className="logBtn">
        <Link to="/login">
          <button className="btn loginBtn">로그인</button>
        </Link>
        &emsp;
        <Link to="/register">
          <button className="btn loginBtn">회원가입</button>
        </Link>
      </div>
    </Fragment>
  );
}

class Board extends Component {
  // ViewLogFunc = () => {
  //   if (auth.loggedIn === true) return <LoginFunc />;
  //   else return <notLoginFunc />;
  // };

  render() {
    return (
      <div>
        <Navbar bg="light" expand="lg">
          <div className="nav_left">
            <Navbar.Brand href="/">메인으로</Navbar.Brand>
          </div>
          <div className="nav_right">
            <Form inline>
              <Row>
                <Col>
                  <FormControl
                    type="text"
                    placeholder="Search..."
                    className="mr-sm-2"
                  />
                </Col>
                <Col>
                  <button className="btn outline-search">Search</button>
                </Col>
              </Row>
            </Form>
          </div>
          <div className="nav_last">
            <ViewLogFunc isloggedIn={auth.loggedIn} />
          </div>
        </Navbar>
        {/* 내용 */}
        <div className="container">
          <Row>
            <Col>
              <div className="content-entry align-selt-center">
                <div className="text">
                  <h3 className="heading">제목</h3>
                  <p>내~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~용</p>
                  <div className="meta">
                    <p>날짜 계정명 댓글수</p>
                    <p>
                      <Button type="button" className="btn btn-secondary">
                        Read more
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col>
              <div className="content-entry align-selt-center">
                <div className="text">
                  <h3 className="heading">제목</h3>
                  <p>내~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~용</p>
                  <div className="meta">
                    <p>날짜 계정명 댓글수</p>
                    <p>
                      <Button type="button" className="btn btn-secondary">
                        Read more
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col>
              <div className="content-entry align-selt-center">
                <div className="text">
                  <h3 className="heading">제목</h3>
                  <p>내~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~용</p>
                  <div className="meta">
                    <p>날짜 계정명 댓글수</p>
                    <p>
                      <Button type="button" className="btn btn-secondary">
                        Read more
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col>
              <div className="content-entry align-selt-center">
                <div className="text">
                  <h3 className="heading">제목</h3>
                  <p>내~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~용</p>
                  <div className="meta">
                    <p>날짜 계정명 댓글수</p>
                    <p>
                      <Button type="button" className="btn btn-secondary">
                        Read more
                      </Button>
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Board;
