import React, { Component } from "react";
import { Col, Nav, Navbar, NavDropdown, Row, Tab } from "react-bootstrap";
import auth from "../Logic/Auth";
import "../css/Navbar.css";
import "../css/MyInfo.css";
import axios from "axios";
import { Redirect } from "react-router";

export default class MyInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      name: null,
      birthday: null,
      phonenumber: null,
      address1: null,
      address2: null,
      zipcode: null,
      manager: null,
      regDate: null,
      password: null,
      newpassword: null,
      quitmember: false,
    };
  }

  componentDidMount() {
    const id = auth.id;

    axios
      .post("/user/myinfo", { id })
      .then((res) => {
        this.setState({ ...res.data });
      })
      .catch((err) => alert(err.response.data.msg));
  }

  handleClick = () => {
    console.log("로그아웃");
    auth.logout();
    window.location.reload();
  };

  changeDefaultInfo = async (event) => {
    event.preventDefault();
    const id = auth.id;
    const { birthday, phonenumber } = this.state;

    axios
      .post("/user/changeDefaultInfo", { id, birthday, phonenumber })
      .then((res) => {
        alert(res.data.msg); //정보가 변경되었습니다
        console.log("res.data.msg : " + res.data.msg);
        window.location.reload(); //화면 새로고침
      })
      .catch((err) => alert(err.response.data.msg));
  };

  changePassword = async (event) => {
    event.preventDefault();
    const id = auth.id;
    const { password, newpassword } = this.state;

    axios
      .post("/user/changePassword", { id, password, newpassword })
      .then((res) => {
        alert(res.data.msg); //정보가 변경되었습니다
        console.log("res.data.msg : " + res.data.msg);
        window.location.reload(); //화면 새로고침
      })
      .catch((err) => alert(err.response.data.msg));
  };

  quitMember = async (event) => {
    event.preventDefault();
    const id = auth.id;

    axios
      .post("/user/quit", { id })
      .then((res) => {
        console.log("회원탈퇴");
        alert(res.data.msg);
        auth.logout();
        this.setState({ quitmember: true });
        window.location.reload();
      })
      .catch((err) => alert(err.response.data.msg));
  };

  render() {
    const {
      email,
      name,
      birthday,
      phonenumber,
      address1,
      address2,
      zipcode,
      manager,
      regDate,
      password,
      newpassword,
      quitmember,
    } = this.state;

    if (quitmember) return <Redirect to="/" />;
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

        <div className="container light-style flex-grow-1 container-p-y">
          <div className="card overflow-hidden">
            <h4 className="font-weigth-bold py-3 mb-4">계정 설정</h4>

            <Tab.Container
              id="left-tabs-example"
              defaultActiveKey="account-general"
            >
              <Row>
                <Col sm={2}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="account-general">기본 정보</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="account-info">상세 정보</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="account-change-password">
                        비밀번호 변경
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="account-delete">회원 탈퇴</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={10}>
                  <Tab.Content>
                    {/* 기본정보 */}
                    <Tab.Pane eventKey="account-general">
                      <form onSubmit={this.changeDefaultInfo}>
                        <div className="col-md-9">
                          <div className="tab-contant">
                            <div
                              className="tab-pane fade active show"
                              id="account-general"
                            >
                              <div className="card-body media align-items-center">
                                <Row>
                                  <img
                                    src="http://localhost:8080/images/default.png"
                                    alt=""
                                    className="d-block ui-w-80"
                                  />
                                  <div className="media-body ml-4">
                                    <label className="btn btn-outline-primary">
                                      사진 변경하기
                                      <input
                                        type="file"
                                        className="account-settings-fileinput"
                                      />
                                    </label>
                                    &nbsp;
                                    <button
                                      type="button"
                                      className="btn btn-default md-btn-flat"
                                    >
                                      초기화
                                    </button>
                                    <div className="text-gray small mt-1">
                                      이미지는 PNG만 사용이 가능하며, 크기는
                                      800KB를 넘을 수 없습니다.
                                    </div>
                                  </div>
                                </Row>
                              </div>
                              <hr className="border-light m-0" />

                              <div className="card-body">
                                <div className="form-group">
                                  <label className="form-label">
                                    사용자 이름
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control mb-1"
                                    value={name || ""}
                                    readOnly
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">생일</label>
                                  <input
                                    type="date"
                                    className="form-control mb-1"
                                    onChange={(event) => {
                                      this.setState({
                                        birthday: event.target.value,
                                      });
                                    }}
                                    value={birthday || ""}
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">
                                    이메일 및 계정
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control mb-1"
                                    value={email || ""}
                                    readOnly="readOnly"
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">전화번호</label>
                                  <input
                                    type="text"
                                    className="form-control mb-1"
                                    value={phonenumber || ""}
                                    onChange={(event) => {
                                      this.setState({
                                        phonenumber: event.target.value,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="d-flex flex-row-reverse">
                                  <button
                                    type="submit"
                                    className="btn outline-search mt-3"
                                  >
                                    정보 변경하기
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </Tab.Pane>
                    {/* 상세 정보 */}
                    <Tab.Pane eventKey="account-info">
                      <div className="card-body">
                        <div className="form-group">
                          <label className="form-label">우편번호</label>
                          <input
                            type="text"
                            className="form-control mb-1"
                            value={zipcode || ""}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">도로명 주소</label>
                          <input
                            type="text"
                            className="form-control mb-1"
                            value={address1 || ""}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">상세 주소</label>
                          <input
                            type="text"
                            className="form-control mb-1"
                            value={address2 || ""}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">유저 등급</label>
                          <input
                            type="text"
                            className="form-control mb-1"
                            value={manager || ""}
                            readOnly
                          />
                          <div className="form-group">
                            <label className="form-label">사이트 가입일</label>
                            <input
                              type="text"
                              className="form-control mb-1"
                              value={regDate || ""}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                    {/* 비밀번호 변경 */}
                    <Tab.Pane eventKey="account-change-password">
                      <form onSubmit={this.changePassword}>
                        <div className="form-group">
                          <label className="form-label">현재 비밀번호</label>
                          <input
                            type="password"
                            className="form-control"
                            defaultValue={password || ""}
                            onChange={(event) => {
                              this.setState({ password: event.target.value });
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">새로운 비밀번호</label>
                          <input
                            type="password"
                            className="form-control"
                            defaultValue={newpassword || ""}
                            onChange={(event) => {
                              this.setState({
                                newpassword: event.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="d-flex flex-row-reverse">
                          <button
                            type="submit"
                            className="btn outline-search mt-3"
                          >
                            정보 변경하기
                          </button>
                        </div>
                      </form>
                    </Tab.Pane>
                    {/* 회원 탈퇴 */}
                    <Tab.Pane eventKey="account-delete">
                      <form onSubmit={this.quitMember}>
                        <h3>회원을 탈퇴하시겠습니까?</h3>
                        <div>
                          회원 탈퇴를 할 경우 해당 계정에 대한 정보가 모두
                          삭제됩니다. 또한, 추후 데이터를 복구할 수 없습니다.
                        </div>
                        <div className="d-flex justify-content-center">
                          <button type="submit" className="btn btn-danger mt-3">
                            탈퇴하기
                          </button>
                        </div>
                      </form>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        </div>
      </div>
    );
  }
}
