import React, { Component, Fragment } from "react";
import axios from "axios";
import { Button, Navbar, NavDropdown, Table } from "react-bootstrap";
import auth from "../Logic/Auth";
import { Link } from "react-router-dom";

import "../css/Read.css";

//로그인 상태일때와 아닐때 보여줘야하는 함수를 return
function ViewLogFunc(props) {
  const isloggedIn = props.isloggedIn;
  if (isloggedIn) return <LoginFunc />;
  else return <NotLoginFunc />;
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

//로그인이 아닐시 상단탭의 우측 버튼
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

class Read extends Component {
  constructor(props) {
    super(props);

    //파라미터 데이터 확인
    this.state = {
      //component에서 componen로 props.match.params를
      //이용하여 데이터를 넘겨 줄 수 있음
      no: props.match.params.no,

      //게시글 정보
      info: {},
    };
  }

  componentDidMount() {
    //게시글 번호를 불러옴
    const { no } = this.state;

    //게시글 정보를 읽어와서 저장
    axios.get(`/board/${no}`).then((res) => this.setState({ info: res.data }));
  }

  deleteArticle = () => {
    //게시글 번호를 가져옴
    const { no } = this.state;

    //게시글을 삭제함
    axios.delete(`/board/delete/${no}`).then((res) => {
      alert(res.data.msg);
      this.props.history.goBack();
    });
  };

  render() {
    const { info, no } = this.state;

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
        <div className="article-wrapper">
          <Table>
            <thead>
              <tr>
                <td>
                  <h1>제목 : {info.title}</h1>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>작성자 : {info.writer_name}</td>
              </tr>
              <tr>
                <td className="info-content">{info.content}</td>
              </tr>
            </tbody>
            {info.writer_idx === auth.idx ? (
              <tfoot className="tfoot_btn">
                <tr>
                  <td>
                    <Link to={`/edit/${no}`}>
                      <button className="btn loginBtn">수정</button>
                    </Link>
                    &emsp;
                    <Button variant="danger" onClick={this.deleteArticle}>
                      삭제
                    </Button>
                  </td>
                </tr>
              </tfoot>
            ) : (
              ""
            )}
          </Table>
        </div>
      </div>
    );
  }
}

export default Read;
