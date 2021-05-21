import React, { Component, Fragment } from "react";
import auth from "../Logic/Auth";
import axios from "axios";
import ReactPaginate from "react-js-pagination";
import {
  Form,
  FormControl,
  Navbar,
  Row,
  Col,
  NavDropdown,
  Table,
} from "react-bootstrap";
import "../css/Board.css";
import "../css/Navbar.css";
import { Link } from "react-router-dom";

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

//Board 클래스
class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [], //게시글 데이터
      page: 0, //현재 페이지
      count: 0, //게시글 총 갯수
      perPage: 0, //현재 페이지에 보일 글갯수(express에서 설정)
      search: null, //검색어
      searchType: "TITLE", //검색타입
    };

    //게시글 전체 목록 불러오기
  }

  componentDidMount() {
    this.getData();
  }

  //게시글 목록 불러오기
  getData() {
    axios.get("/board").then((res) => {
      const data = res.data;

      console.log("getData");
      //기존의 리스트에 값을 추가하려면 concat을 사용하면 된다.
      this.setState({
        data: data.data,
        ...data,
      });
    });
  }

  //검색한 게시글 목록 불러오기(async를 하지않으면 화면이 reload되어 검색정보가 날아감)
  search = async (e) => {
    e.preventDefault();
    const { search, searchType } = this.state;

    //검색어 쿼리로 요청 및 저장
    axios.get("/board", { params: { search, searchType } }).then((res) => {
      const data = res.data;
      this.setState({
        data: data.data,
        ...data,
      });
    });
  };

  handlePage(page) {
    const { search, searchType } = this.state;

    //페이지 업데이트. 검색어와 페이지 정보로 읽어와 저장
    axios
      .get("/board", { params: { search, searchType, page } })
      .then((res) => {
        const data = res.data;
        this.setState({
          data: data.data,
          ...data,
        });
      });
  }

  //검색 타입을 변경할 시 state에 적용
  handleDropdownChange = (e) => {
    this.setState(() => {
      return { searchType: e.target.value };
    });
  };

  render() {
    //변수 설정
    const { data, page, count, perPage } = this.state;

    return (
      <div>
        <Navbar bg="light" expand="lg">
          {/* Navbar 왼쪽 */}
          <div className="nav_left">
            <Navbar.Brand href="/">메인으로</Navbar.Brand>
          </div>

          {/* Navbar 중앙 - 검색 */}

          <div className="nav_right">
            <Form inline>
              <Row>
                <Col>
                  <Form.Group as={Col} controlId="formGridTypeSelect">
                    <Form.Control
                      as="select"
                      defaultValue={this.state.searchType}
                      onChange={this.handleDropdownChange}
                    >
                      <option value="TITLE">제목</option>
                      <option value="CONTENT">내용</option>
                      <option value="WRITER">작성자</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <FormControl
                    type="text"
                    placeholder="Search..."
                    className="mr-sm-2"
                    onChange={(event) =>
                      this.setState({ search: event.target.value })
                    }
                  />
                </Col>
                <Col>
                  <button className="btn outline-search" onClick={this.search}>
                    Search
                  </button>
                </Col>
              </Row>
            </Form>
          </div>
          {/* Navbar 오른쪽 - 로그인, 회원가입 */}
          <div className="nav_last">
            <ViewLogFunc isloggedIn={auth.loggedIn} />
          </div>
        </Navbar>
        {/* 내용 */}
        <div className="board-wrapper">
          <Table hover>
            {/* 테이블 헤더 */}
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>등록일</th>
                <th>조회수</th>
              </tr>
            </thead>
            {/* 테이블 바디(게시글) */}
            <tbody>
              {data.map((obj, index) => (
                <tr key={index}>
                  <td>{obj.no}</td>
                  <td>
                    <Link to={`/view/${obj.no}`}>{obj.title}</Link>
                  </td>
                  <td>{obj.writer_name}</td>
                  <td>{obj.article_regdate}</td>
                  <td>{obj.read_cnt}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="tfoot_btn">
              <tr>
                <td colSpan="5" className="none-border-bottom">
                  <div className="d-flex justify-content-end">
                    <Link to="/add">
                      <button className="btn loginBtn">글쓰기</button>
                    </Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan="5" className="none-border">
                  <div className="d-flex justify-content-center">
                    {/* 페이징 처리(react-js-pagination 라이브러리 사용) */}
                    <ReactPaginate
                      activePage={page}
                      totalItemsCount={count}
                      itemsCountPerPage={perPage}
                      onChange={(event) => this.handlePage(event)}
                      innerClass="pagination"
                      itemClass="page-item"
                      activeClass="active"
                      nextPageText="다음"
                      prevPageText="이전"
                      className="d-flex justify-content-center"
                    />
                  </div>
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    );
  }
}

export default Board;
