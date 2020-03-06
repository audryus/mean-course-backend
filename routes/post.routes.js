const express = require("express");
const router = express.Router();

const authChecker = require("../middleware/auth.middleware")
const fileMiddleware = require("../middleware/multer.middleware")
const PostController = require("../controller/post.controller")

router.post("", 
authChecker, 
  fileMiddleware, 
  PostController.create
);
router.patch("/:id", 
authChecker,
  fileMiddleware, 
  PostController.update
);
router.get("", PostController.findAll);
router.get("/:id", PostController.findById);
router.delete("/:id", authChecker, PostController.deleteByIdCreator);

module.exports = router;
