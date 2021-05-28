import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

//기본리턴
export default {
  loggedIn: false, //로그인 여부
  name: null, //사용자명
  manager: null, //관리자 권한
  idx: null, //유니크 ID

  defaultURL() {
    axios.defaults.baseURL = "http://localhost:3000";
  },

  //로그아웃
  logout() {
    this.loggedIn = false;
    sessionStorage.clear();
    //localStorage.clear();
  },
  //로그인 체크
  checkAuth() {
    //axios.defaults.baseURL = "http://localhost:3000";

    //로그인 데이터 체크
    const token = sessionStorage.getItem("token");
    const name = sessionStorage.getItem("name");
    const manager = sessionStorage.getItem("manager");
    const idx = sessionStorage.getItem("idx");
    if (!token) return; //토큰이 없다면 비로그인 상태

    this.loggedIn = true; //로그인
    this.name = name;
    this.manager = manager;
    this.idx = idx;

    // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; //기본값 변경
    axios.defaults.headers.get["Authorization"] = `Bearer ${token}`; //get값 변경
    axios.defaults.headers.post["Authorization"] = `Bearer ${token}`; //post값 변경
  },

  //로그인 세팅
  setAuth(data) {
    axios.defaults.baseURL = "http://localhost:3000";

    //데이터 세팅
    this.loggedIn = true; //로그인
    this.name = data.name; //이름 설정
    this.manager = data.manager; //관리자 권한
    this.idx = data.idx; //아이디 겸 이메일

    //localStorage : pc저장(동일pc, 동일브라우저 사용시 데이터 유지)
    //sessionStorage : 브라우저 저장(브라우저 종료시 데이터 소멸)
    sessionStorage.setItem("name", data.name);
    sessionStorage.setItem("manager", data.manager);
    sessionStorage.setItem("idx", data.idx);
    sessionStorage.setItem("token", data.token);

    // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`; //기본값 변경
    axios.defaults.headers.get["Authorization"] = `Bearer ${data.token}`; //get값 변경
    axios.defaults.headers.post["Authorization"] = `Bearer ${data.token}`; //post값 변경
  },
};
