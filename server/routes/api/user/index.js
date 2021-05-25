const router = require("express").Router();
const controller = require("./controllers");

//[POST] /register 요청시 호출
router.post("/register", controller.register); //회원가입
router.post("/login", controller.login); //로그인
router.get("/naverlogin", controller.naverlogin); //네이버 로그인
router.post("/myinfo", controller.info); //내정보보기
router.post("/changeDefaultInfo", controller.changeDefaultInfo); //기본 정보 변경
router.post("/changePassword", controller.changePassword); //비밀번호 변경
router.post("/quit", controller.quit); //회원 탈퇴

module.exports = router;
