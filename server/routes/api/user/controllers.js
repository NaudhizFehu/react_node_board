const jwt = require("jsonwebtoken"); //인증 모듈
const oracledb = require("oracledb"); //오라클 모듈
const config = require("../../../config"); //DB설정파일

oracledb.autoCommit = true; //오토커밋

//네이버 아이디로 로그인하기 관련 변수
const clint_id = "bvalxhmZV3EXFcCRlxde";
const clint_secret = "qC1nxggNpU";
var state = "RANDOM_STATE";
var redirectURI = encodeURI("/");
var api_url = "";

//Register
exports.register = async (req, res, next) => {
  const { email, name, password, phonenumber } = req.body; //바디에서 데이터를 읽어옴
  //데이터가 정상적으로 넘어오는지 검사하는 로그
  //   console.log(
  //     "userControllers[email : " +
  //       email +
  //       " | name : " +
  //       name +
  //       " | password : " +
  //       password +
  //       " | phonenumber : " +
  //       phonenumber +
  //       "]"
  //   );

  //statuscode 422 : 요청이 잘 만들어 졌으나 문법 오류로 인하여 실행할 수 없습니다.
  if (!email) return res.status(422).json({ msg: "이메일을 입력해주세요." });
  else if (!name) return res.status(422).json({ msg: "이름을 입력해주세요." });
  else if (!password)
    return res.status(422).json({ msg: "비밀번호를 입력해주세요." });
  else if (!phonenumber)
    return res.status(422).json({ msg: "전화번호를 입력해주세요." });

  //현재 날짜(today.toLocalDateString() : Date 객체의 날짜 부분을 지역의 언어에 맞는 문자열 표현으로 반환한다.)
  let today = new Date();

  //Oracle DB에 연결
  const conn = await oracledb.getConnection(config.db);
  const query = `INSERT INTO MEMBER (ID, PASSWORD, EMAIL, NAME, BIRTHDAY, PHONENUMBER, MANAGER, REGDATE)
   VALUES(ID_SEQ.NEXTVAL, '${password}', '${email}', '${name}', '${today.toLocaleDateString()}', '${phonenumber}', ${0}, '${today.toLocaleDateString()}')`;

  //쿼리문 실행(err : 에러발생시 값이 있음)
  conn.execute(query, function (err, result) {
    if (err) {
      console.log("등록중 에러 발생 : " + err);
      res.writeHead(500, { ContentType: "text/html" });
      res.end("fail");
    } else {
      console.log("result : " + result);
      res.json({ msg: "회원가입이 완료되었습니다." });
      res.writeHead(200, { ContentType: "text/html" });
      res.end("success");
    }
  });
};

//Login
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //예외 처리
  if (!email) return res.status(422).json({ msg: "이메일을 입력해주세요." });
  else if (!password)
    return res.status(422).json({ msg: "비밀번호를 입력해주세요." });

  // Oracle DB에 연결
  const conn = await oracledb.getConnection(config.db);
  const query = `SELECT * FROM MEMBER WHERE EMAIL='${email}' AND PASSWORD='${password}'`;
  const result = await conn.execute(query);
  conn.close();

  //계정이 올바르지 않은 경우
  if (!result.rows.length)
    return res.status(400).json({ msg: "일치하는 계정이 없습니다." });

  // 인증정보 생성(유저 정보)
  const user = result.rows[0];

  //계정이 올바르다면 JWT발행
  const token = jwt.sign(
    {
      id: user[0],
      email: user[2],
      name: user[3],
      manager: user[9],
      //exp: Math.floor(today.getTime() / 1000) + 60 * 60, //유효기간은 현재시간보다 늦어야함(현재 설정은 1시간)
    },
    config.secret, //비밀키
    { expiresIn: "1h" } //토큰 유효기간(1시간)
  );

  return res.json({
    msg: `'${user[3]}'님이 로그인하였습니다.`,
    token,
    name: user[3],
    id: user[0],
    manager: user[9],
  });
};

//네이버 login
exports.naverlogin = async (req, res, next) => {
  //react에서 헤더로 보낸 토큰값을 받아온다.
  const token = req.header("Authorization");
  //접근 토큰을 전달하는 헤더 - 토큰 타입은 Bearer로 고정 (형식: {토큰타입} {접근 토큰})
  const header = "Bearer " + token; //Bearer 다음에 공백 추가

  //프로필 조회 URL
  const api_url = "https://openapi.naver.com/v1/nid/me";
  const request = require("request"); //request 모듈이 필요함(npm install request)
  const options = {
    url: api_url,
    headers: { Authorization: header },
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      //정상적으로 통신이 완료되었다면 db에 저장한다.
      console.log("body: " + body); //전체 데이터 로그
      const requestData = JSON.parse(body); //전체 데이터를 JSON으로 파싱

      //필요한 정보 추출
      const email = requestData.response.email;
      const name = requestData.response.name;
      const phonenumber = requestData.response.mobile.replace(/\-/g, "");

      //Oracle DB연동
      oracledb.getConnection(
        config.db,
        //callback 함수
        function (err, connection) {
          //에러가 났다면
          if (err) {
            console.error(err.message);
          } else {
            //DB에 연결
            connection
              //해당 email사용자가 있는지 검사
              .execute(`SELECT * FROM MEMBER WHERE EMAIL='${email}'`)
              .then((selectResult) => {
                //정보가 없다면 회원가입후 로그인
                if (selectResult.rows.length < 1) {
                  let today = new Date(); //가입을 위한 오늘의 날짜
                  //회원가입 쿼리문
                  const joinquery = `INSERT INTO MEMBER (ID, PASSWORD, EMAIL, NAME, BIRTHDAY, PHONENUMBER, MANAGER, REGDATE)
   VALUES(ID_SEQ.NEXTVAL, '0000', '${email}', '${name}', '${today.toLocaleDateString()}', '${phonenumber}', ${0}, '${today.toLocaleDateString()}')`;
                  //쿼리문사용
                  connection.execute(joinquery).then(() => {
                    //end메서드를 통해 해당 함수를 종료시킨다.
                    return res.end(
                      naverReturnFuc(token, email, name, res, true)
                    );
                  });
                } else {
                  //정보가 있다면 로그인시킨다.
                  return res.end(naverReturnFuc(token, email, name, res, true));
                }
              });
          }
        }
      );
    } else {
      //error라면 success를 false로 리턴하고 error코드를 띄워줌
      console.log("error");
      if (response != null) {
        res.status(response.statusCode);
        console.log("error: " + response.statusCode);
        return res.end(naverReturnFuc(token, null, null, res, false));
      }
    }
  });
};

//네이버 로그인시 반환되는 json 값
const naverReturnFuc = (token, email, name, res, bool) => {
  return res.json({
    msg: `'${name}'님이 로그인하였습니다.`,
    token,
    name: name,
    id: email,
    manager: 0,
    success: bool,
  });
};

//Info
exports.info = async (req, res, next) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ msg: "잘못된 접근입니다." });

  //Oracle DB에 연결
  const conn = await oracledb.getConnection(config.db);
  const query = `SELECT * FROM MEMBER WHERE ID=${id}`; //유저정보를 읽어옴
  const result = await conn.execute(query);
  conn.close();

  //예외처리
  if (!result.rows.length)
    return res.status(400).json({ msg: "잘못된 접근입니다." });

  const user = result.rows[0]; //유저정보
  const manager = user[9] == "1" ? "관리자" : "일반회원";
  //date에 값을 넣기위한 yyyy-mm-dd 포멧
  const tmpStr = user[4].split("-");
  const strToDate = new Date(tmpStr[0], tmpStr[1] - 1, tmpStr[2]);
  const localDate = new Date(
    strToDate.getTime() - strToDate.getTimezoneOffset() * 60000
  );
  const birthday = localDate.toISOString().substring(0, 10);

  //결과 리턴
  return res.json({
    email: user[2],
    name: user[3],
    birthday: birthday,
    phonenumber: user[5],
    address1: user[6],
    address2: user[7],
    zipcode: user[8],
    manager: manager,
    regDate: user[10],
  });
};

//유저 기본정보 변경
exports.changeDefaultInfo = async (req, res, next) => {
  const { id, birthday, phonenumber } = req.body;

  if (!phonenumber)
    return res.status(422).json({ msg: "전화번호는 공백일 수 없습니다." });
  if (!birthday)
    return res.status(422).json({ msg: "생일은 공백일 수 없습니다." });

  //Oracle DB에 연결
  const conn = await oracledb.getConnection(config.db);
  const query = `UPDATE MEMBER SET BIRTHDAY='${birthday}', PHONENUMBER='${phonenumber}' WHERE ID=${id}`;
  const result = await conn.execute(query);
  conn.close();

  //리턴
  return res.status(200).json({ msg: "정보가 변경되었습니다." });
};

//유저 비밀번호 변경
exports.changePassword = async (req, res, next) => {
  const { id, password, newpassword } = req.body;

  //예외 처리
  if (!password)
    return res.status(422).json({ msg: "비밀번호는 공백일 수 없습니다." });
  if (!newpassword)
    return res.status(422).json({ msg: "새 비밀번호는 공백일 수 없습니다." });

  //Oracle DB 조회
  const conn = await oracledb.getConnection(config.db);
  const selectQuery = `SELECT * FROM MEMBER WHERE ID=${id} AND PASSWORD='${password}'`;
  const result = await conn.execute(selectQuery);

  //비밀번호 체크
  if (!result.rows.length)
    return res.status(400).json({ msg: "비밀번호를 틀렸습니다." });

  //Oracle DB 등록(비밀번호 변경)
  const changeQuery = `UPDATE MEMBER SET PASSWORD='${newpassword}' WHERE ID=${id}`;
  const result1 = await conn.execute(changeQuery);
  conn.close();

  //리턴
  return res.status(200).json({ msg: "정보가 변경되었습니다." });
};

//회원 탈퇴
exports.quit = async (req, res, next) => {
  const { id } = req.body;

  //Oracle DB연결
  const conn = await oracledb.getConnection(config.db);
  const query = `DELETE FROM MEMBER WHERE ID=${id}`;
  const result = await conn.execute(query);
  conn.close();

  //리턴
  return res.status(200).json({ msg: "회원탈퇴가 되셨습니다." });
};
