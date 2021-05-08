const orabledb = require("oracledb"); //오라클 모듈
const config = require("../../../config"); //DB설정파일
orabledb.autoCommit = true; //오토커밋

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

  //Oracle DB에 연결
  const db = await orabledb.getConnection(config.db);
  const query = "";
};
