const express = require("express");
const { creatAuthor, loginAuthor } = require("../controllers/authorController");
const {
  creatblog,
  deletBlog,
  updateBlog,
  getBlog,
  deleteParticularBlog,
} = require("../controllers/blogControllers");
const { authorAuthentication, authorization } = require("../middlewares/mid");

const router = express.Router();
router.post("/creatAuthor", creatAuthor);
router.post("/loginAuthor", loginAuthor);

router.post("/creatblog", authorAuthentication, creatblog);
router.delete("/deletBlog/:blogId", authorAuthentication, deletBlog);
router.put("/updateBlog/:blogId", authorAuthentication, updateBlog);
router.get("/getBlog", authorAuthentication, getBlog);
router.delete(
  "/deleteParticularBlog",
  authorAuthentication,
  deleteParticularBlog
);

module.exports = router;
