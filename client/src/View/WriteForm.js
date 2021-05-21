import React, { Component, Fragment } from "react";
import {
  Button,
  Col,
  Form,
  Navbar,
  NavDropdown,
  Row,
  Table,
} from "react-bootstrap";
import auth from "../Logic/Auth";
import "../css/WriteForm.css";
import { Link } from "react-router-dom";
import axios from "axios";

function ViewLogFunc(props) {
  const isloggedIn = props.isloggedIn;
  if (isloggedIn) return <LoginFunc />;
}

//로그인일시 상단탭의 우측 버튼
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

//글 작성 | 글 수정
class WriteForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      no: props.match.params.no, // 글 번호를 받아옴
      mode: props.match.params.no ? "edit" : "add", // 글 번호가 있다면 수정, 없다면 생성

      title: null,
      content: null,
    };
  }

  componentDidMount() {
    const { no } = this.state;
    if (!no) return; //no가 없다면 값을 채울필요가 없음

    //게시글 정보를 읽어와서 저장
    axios.get(`/board/${no}`).then((res) => this.setState({ ...res.data }));
  }

  //상단 제목을 공통으로 사용하므로 no값에 따라 분리
  addOrEdit = () => {
    const { no } = this.state;
    if (!no) {
      return (
        <Fragment>
          <h1 className="form-title">글 쓰기</h1>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <h1 className="form-title">글 수정</h1>
        </Fragment>
      );
    }
  };

  //등록시 사용할 핸들러
  handleRegisterArticle = async (event) => {
    event.preventDefault(); //form 이벤트 멈추기
    const { title, content, mode, no } = this.state;

    if (mode == "add") {
      axios
        .put("/board/create", { title, content })
        .then((res) => {
          alert(res.data.msg);
          this.props.history.goBack();
        }) //성공시 알림 및 페이지 되돌리기
        .catch((err) => alert(err.response.data.msg)); //실패시 알림
    } else {
      axios
        .post("/board/update", { title, content, no })
        .then((res) => {
          alert(res.data.msg);
          this.props.history.goBack();
        }) //성공시 알림 및 페이지 되돌리기
        .catch((err) => alert(err.response.data.msg)); //실패시 알림
    }
  };

  render() {
    const { title, content } = this.state;

    return (
      <div>
        <Navbar bg="light" expand="lg">
          {/* Navbar 왼쪽 */}
          <div className="nav_left">
            <Navbar.Brand href="/">메인으로</Navbar.Brand>
          </div>

          {/* Navbar 오른쪽 - 로그인, 회원가입 */}
          <div className="nav_last">
            <ViewLogFunc isloggedIn={auth.loggedIn} />
          </div>
        </Navbar>
        {/* 내용 */}
        <div className="article-wrapper">
          <this.addOrEdit />
          <div className="write-content">
            <Form onSubmit={this.handleRegisterArticle}>
              <Table>
                {/* 입력구간 */}
                <tbody>
                  <Row>
                    <Col className="label-title">제목</Col>
                    <Col>
                      <input
                        className="control-form input-title"
                        name="title"
                        id="title"
                        value={title || ""}
                        autoFocus="autoFocus" //페이지가 로드될 때 자동으로 포커스가 input 요소로 이동됨을 명시
                        onChange={(event) => {
                          this.setState({ title: event.target.value });
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="label-title">내용</Col>
                    <Col>
                      <textarea
                        className="control-form input-textarea"
                        name="content"
                        id="content"
                        value={content || ""}
                        wrap="physical" //줄바꿈 속성(virtual : 화면에 맞게 자동 줄바꿈, 전송시는 입력대로 전송)
                        cols="110" //텍스트 입력 영역 중 보이는 영역의 너비를 명시
                        rows="20" //텍스트 입력 영역 중 보이는 영역의 라인수를 명시
                        onChange={(event) => {
                          this.setState({ content: event.target.value });
                        }}
                      />
                    </Col>
                  </Row>
                </tbody>
                {/* 하단 버튼 */}
                <tfoot>
                  <Row>
                    <Col colSpan="2">
                      <button className="btn loginBtn centerBtn" type="submit">
                        등록
                      </button>
                      &emsp;
                      <Link to="/">
                        <Button variant="danger">취소</Button>
                      </Link>
                    </Col>
                  </Row>
                </tfoot>
              </Table>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default WriteForm;
