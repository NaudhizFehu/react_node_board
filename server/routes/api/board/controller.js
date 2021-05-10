const oracledb = require("oracledb");
const config = require("../../../config");
oracledb.autoCommit = true;

//글 목록 가져오기
exports.getArticleList = async (req, res, next) => {
  //get방식이므로 주소에있는 query문에서 값을 읽어옴(검색어, 현재페이지)
  let { search, page } = req.query;
  const perPage = 8; //perPage값 지정(한 페이지에서 보여줄 갯수)
  page = page ? parseInt(page) - 1 : 0; //page Int 처리

  //Oracle DB에 연결
  const conn = await oracledb.getConnection(config.db);
  // 검색 데이터가 있을 경우 쿼리에 추가, 페이징 구분
  // const query = `SELECT T.* FROM ()`
};
