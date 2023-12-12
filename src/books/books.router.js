const router = require("express").Router();
const controller = require("./books.controller");

router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .patch(controller.update)
  .put(controller.processBooks)
  .delete(controller.delete);

module.exports = router;
