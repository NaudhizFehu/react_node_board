const router = require("express").Router();
const controller = require("./controller");

// 기능별 /board 라우팅
router.get("/", controller.getList);

module.exports = router;
