const router = require("express").Router();
const controller = require("./controller");

// 기능별 /board 라우팅
router.get("/", controller.getArticleList);
router.get("/:no", controller.getArticle);
router.put("/create", controller.registerArticle);
router.post("/update", controller.updateArticle);
router.delete("/delete/:no", controller.deleteArticle);

module.exports = router;
