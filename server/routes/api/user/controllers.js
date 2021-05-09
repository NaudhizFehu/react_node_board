const jwt = require("jsonwebtoken"); //인증 모듈
const oracledb = require("oracledb"); //오라클 모듈
const config = require("../../../config"); //DB설정파일
oracledb.autoCommit = true; //오토커밋

//register
exports.register = async (req, res, next) => {
  const { email, name, password, phonenumber } = req.body; //바디에서 데이터를 읽어옴
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

  //현재 날짜
  let today = new Date();
  console.log("날짜 : " + today.toLocaleDateString());
  //Oracle DB에 연결
  const conn = await oracledb.getConnection(config.db);
  const query = `INSERT INTO MEMBER VALUES(ID_SEQ.NEXTVAL, '${password}', '${email}', '${name}', '${today.toLocaleDateString()}', '${phonenumber}', 'null', 'null', 'null', ${0}, '${today.toLocaleDateString()}', 'null')`;

  //쿼리문 실행
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
    },
    config.secret, //비밀키
    {
      expiresIn: "30m", //토큰 유효 시간(30분)
    }
  );

  return res.json({
    msg: `'${user[3]}'님이 로그인하였습니다.`,
    token,
    name: user[3],
    manager: user[9],
  });
};
