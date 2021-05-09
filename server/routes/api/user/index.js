const router = require("express").Router();
const controller = require("./controllers");

//[POST] /register 요청시 호출
router.post("/register", controller.register);
router.post("/login", controller.login);

module.exports = router;
