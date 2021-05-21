const oracledb = require("oracledb");
const jwt = require("jsonwebtoken"); //인증 모듈
const config = require("../../../config");
oracledb.autoCommit = true;

//글 목록 가져오기
exports.getArticleList = async (req, res, next) => {
  //get방식이므로 주소에있는 query문에서 값을 읽어옴(검색어, 현재페이지)
  let { searchType, search, page } = req.query;
  const perPage = 2; //perPage값 지정(한 페이지에서 보여줄 갯수)
  page = page ? parseInt(page) - 1 : 0; //page Int 처리

  let type = "TITLE";
  if (searchType == "CONTENT") type = "CONTENT";
  else if (searchType == "WRITER") type = "WRITER_NAME";

  //검색조건 작성
  let searchArticle = search ? ` WHERE ${type} LIKE '%${search}%'` : "";
  let searchT = search ? ` ${type} LIKE '%${search}%' AND ` : "";

  //Oracle DB에 연결
  const conn = await oracledb.getConnection(config.db);

  // 검색 데이터가 있을 경우 쿼리에 추가, 페이징 구분
  //(원문은 React 6강 - React 실무 게시판 프로그램 개발의 React_Express_Nodejs_OracleDB에 controllers.js에 있음)
  const query = `SELECT T.* FROM
  (SELECT T.*, rowNum as rowIndex FROM 
  (SELECT * FROM ARTICLE${searchArticle})T ORDER BY ARTICLE_NO DESC
  )T WHERE${searchT} rowIndex > ${page * perPage} AND rowIndex <= ${
    (page + 1) * perPage
  }`;
  const result = await conn.execute(query);

  //총 갯수 확인
  let searchCount = search ? ` WHERE ${type} LIKE '%${search}%'` : "";
  const countQuery = `SELECT COUNT(*) FROM ARTICLE${searchCount}`;
  const count = await conn.execute(countQuery);
  conn.close(); // DB Close

  //갯수로그
  console.log(
    "searchType : " +
      searchType +
      " | search : " +
      search +
      " | page : " +
      page +
      " | count : " +
      count.rows[0][0]
  );

  // 결과 데이터
  let data = [];
  for (let i in result.rows) {
    //데이터를 읽어와서 결과값에 추가
    const val = result.rows[i];
    data.push({
      no: val[0],
      title: val[1],
      writer_name: val[2],
      content: val[3],
      article_regdate: val[4],
      read_cnt: val[5],
    });
    // console.log(
    //   "data[no : " +
    //     val[0] +
    //     " | title : " +
    //     val[1] +
    //     " | writer_name : " +
    //     val[2] +
    //     " | content : " +
    //     val[3] +
    //     " | article_regdate : " +
    //     val[4] +
    //     " | read_cnt : " +
    //     val[5] +
    //     "]"
    // );
  }

  //값 리턴
  return res.json({ data, count: count.rows[0][0], page: page + 1, perPage });
};

//글 내용 읽기
exports.getArticle = async (req, res, next) => {
  const { no } = req.params; //article_no를 파라미터에서 읽어옴

  //예외처리
  if (!no) return res.status(400).json({ msg: "잘못된 접근입니다." });

  //Oracle DB에 연결
  oracledb.fetchAsString = [oracledb.CLOB]; //CLOB타입의 Oracle데이터를 String으로 가져오기위한 패치
  const conn = await oracledb.getConnection(config.db);
  const query = `SELECT * FROM ARTICLE WHERE ARTICLE_NO=${no}`;
  const result = await conn.execute(query);

  //예외처리
  if (!result.rows.length)
    return res.status(400).json({ msg: "잘못된 접근입니다." });

  //조회수를 1 증가
  const readQuery = `UPDATE ARTICLE SET READ_CNT=READ_CNT+1 WHERE ARTICLE_NO=${no}`;
  const readResult = await conn.execute(readQuery);
  conn.close();

  //게시글 정보
  const val = result.rows[0]; //게시글 정보
  //const content = val[3].replace(/(\n|\r\n)/g, "<br />");

  //결과 리턴
  return res.json({
    article_no: val[0],
    title: val[1],
    writer_name: val[2],
    content: val[3],
    article_regdate: val[4],
    read_cnt: val[5],
  });
};

//새글 등록
exports.registerArticle = async (req, res, next) => {
  const { title, content } = req.body; //body에서 데이터를 읽어옴

  //사용자 정보를 추가하기 위해 jwt를 디코딩
  const headers = req.headers.authorization; //jwt 토큰에서 사용자 데이터를 읽어옴
  const fullToken = headers.split(" ")[1]; //토큰 맨앞에 구분용 헤더를 제거하고 토큰값만 가져옴
  const payload = jwt.decode(fullToken, config.secret); //Header와 payload를 분리하여 json으로 내부 데이터를 사용가능하게 디코딩
  // console.log(
  //   "title : " +
  //     title +
  //     " | content : " +
  //     content +
  //     "\n" +
  //     " | fullToken : " +
  //     fullToken +
  //     "\n" +
  //     " | payload.name : " +
  //     payload.name
  // );

  //Oracle DB 연결
  const conn = await oracledb.getConnection(config.db);
  const query = `INSERT INTO ARTICLE VALUES(ARTICLE_ID_SEQ.NEXTVAL, '${title}', '${payload.name}', '${content}', TO_CHAR(SYSDATE, 'YYYY-MM-DD'), 0)`;

  //Oracle DB에 쿼리 사용
  await conn.execute(query, function (err, result) {
    if (err) {
      //에러 발생시 들어옴
      console.log("등록 중 에러 : " + err);
      res.writeHead(500, { ContentType: "text/html" });
      res.end("fail");
      conn.close();
    } else {
      //정상작동했다면 들어옴
      res.json({ msg: "글이 등록되었습니다." });
      conn.close();
    }
  });
};

//글 수정
exports.updateArticle = async (req, res, next) => {
  const { title, content, no } = req.body;

  //Oracle DB연결
  const conn = await oracledb.getConnection(config.db);
  const query = `UPDATE ARTICLE SET TITLE='${title}', CONTENT='${content}' WHERE ARTICLE_NO='${no}'`;
  const result = await conn.execute(query);
  conn.close();

  //리턴
  res.json({ msg: "수정이 완료되었습니다" });
};

//글 삭제
exports.deleteArticle = async (req, res, next) => {
  const { no } = req.params;

  //Oracle DB연결
  const conn = await oracledb.getConnection(config.db);
  const query = `DELETE FROM ARTICLE WHERE ARTICLE_NO=${no}`;
  const result = await conn.execute(query);
  conn.close();

  //리턴
  res.json({ msg: "해당 글이 삭제되었습니다." });
};
