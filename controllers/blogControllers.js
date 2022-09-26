const blogModel = require("../models/blogModel");
const { isValidObjectId } = require("mongoose");
const { isValid } = require("../validations/authorValid");
const { is } = require("express/lib/request");
const { decode } = require("jsonwebtoken");

const creatblog = async function (req, res) {
  try {
    const isValidArray = function (array) {
      if (!Array.isArray(array)) return false;
      array = array.map((s) => s.trim());
      return array;
    };

    if (Object.keys(req.body).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Please enter valid input" });

    if (!req.body.authorId)
      return res
        .status(400)
        .send({ status: false, message: "Author ID is required" });

    if (!isValidObjectId(req.body.authorId))
      return res
        .status(400)
        .send({ status: false, messege: "author is not present" });

    if (!isValid(req.body.title))
      return res
        .status(400)
        .send({ status: false, message: "please enter valid title" });

    if (!isValid(req.body.body))
      return res
        .status(400)
        .send({ status: false, message: "please enter valid body" });

    if (!isValid(req.body.category))
      return res
        .status(400)
        .send({ status: false, message: "please enter valid category" });

    let checkTags = isValidArray(req.body.tags);
    if (!checkTags) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid tags" });
    }
    req.body.tags = checkTags;

    let checkSubCategory = isValidArray(req.body.subcategory);
    if (!checkSubCategory)
      return res
        .status(400)
        .send({ status: false, message: "please enter valid subcategory" });
    req.body.subcategory = checkSubCategory;

    if (req.body.isPublished == true) {
      req.body.publishedAt = Date.now();
    }

    let blog = await blogModel.create(req.body);
    res.status(200).send({ status: true, data: blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, msg: err.message });
  }
};

const deletBlog = async function (req, res) {
  try {
    blogId = req.params.blogId;
    console.log(req.params);
    console.log(req.decode, "decode");

    if (!blogId) {
      return res
        .status(404)
        .send({ status: "false", msg: "Blog ID is not found" });
    }
    if (!isValidObjectId(blogId)) {
      return res.status().send({ status: false, msg: "blog id is not valid" });
    }

    let updatedblog = await blogModel.findOneAndUpdate(
      { _id: blogId, authorId: req.decode.authorId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    // res.status(200).send({
    //   status: true,
    //   msg: "The requested data is deleted",
    //   data: updatedblog,
    // });
    console.log(updatedblog, "updatedblog");
    if (updatedblog) {
      return res.status(200).send({
        status: true,
        msg: "delete is successfull",
        data: updatedblog,
      });
    } else {
      return res.status(403).send({
        status: false,
        msg: "you are not authorised to delete this blog",
      });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const updateBlog = async function (req, res) {
  try {
    const isValidArray = function (array) {
      if (!Array.isArray(array)) return false;
      array = array.map((s) => s.trim());
      return array;
    };
    blogId = req.params.blogId;

    updatedData = req.body;
    console.log(req.decode);

    if (!blogId) {
      return res
        .status(404)
        .send({ status: "false", msg: "Blog ID is not found" });
    }
    if (!isValidObjectId(blogId)) {
      return res.status().send({ status: false, msg: "blog id is not valid" });
    }
    if (!isValid(req.body.title))
      return res
        .status(400)
        .send({ status: false, message: "please enter valid title" });

    if (!isValid(req.body.body))
      return res
        .status(400)
        .send({ status: false, message: "please enter valid body" });

    let checkTags = isValidArray(req.body.tags);
    if (!checkTags) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid tags" });
    }
    req.body.tags = checkTags;

    let checkSubCategory = isValidArray(req.body.subcategory);
    if (!checkSubCategory)
      return res
        .status(400)
        .send({ status: false, message: "please enter valid subcategory" });
    req.body.subcategory = checkSubCategory;

    if (req.body.isPublished == true) {
      req.body.publishedAt = Date.now();
    }

    let update = await blogModel.findOneAndUpdate(
      { _id: blogId, authorId: req.decode.authorId },
      { $set: updatedData }
    );

    console.log(update);

    if (update) {
      return res
        .status(200)
        .send({ status: true, msg: "updatre is successfull", data: update });
    } else {
      return res.status(403).send({
        status: false,
        msg: "you are not authorised to update this blog",
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const getBlog = async function (req, res) {
  try {
    let query = { isDeleted: false, isPublished: true };
    if (!isValidObjectId(req.query.authorId))
      return res
        .status(400)
        .send({ status: false, message: "Author ID is not valid" });
    if (req.query.authorId) {
      query.authorId = req.query.authorId;
    }

    if (req.query.category) {
      if (isValid(req.query.category))
        query.category = { $in: req.query.category.split(",") };
    } else {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid tag" });
    }
    if (req.query.tags) {
      if (isValid(req.query.tags)) query.tags = req.query.tags;
    } else {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid tag" });
    }
    if (req.query.subcategory) {
      if (isValid(req.query.subcategory)) {
        query.subcategory = { $in: req.query.subcategory.split(",") };
      } else {
        return res
          .status(400)
          .send({ status: false, message: "please enter valid subcategory" });
      }
    }
    console.log(query);
    const blogs = await blogModel.find(
      query
      //   {
      //   isDeleted: false,
      //   isPublished: true,
      //   authorId: req.query.authorId,
      //   category: req.query.category,
      //   tags: req.query.tags,
      //   subcategory: req.query.subcategory,
      // }
    );
    if (blogs.length) {
      res.status(200).send({ status: true, data: blogs });
    } else {
      res.status(404).send({ status: false, msg: "Blog was not found" });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteParticularBlog = async function (req, res) {
  try {
    console.log(req.decode);

    if (req.decode.authorId !== req.query.authorId) {
      return res.status(403).send({
        status: false,
        message: "you are not authorised to perfome this action",
      });
    }

    let query = { isDeleted: false, isPublished: true };
    if (!isValidObjectId(req.query.authorId))
      return res
        .status(400)
        .send({ status: false, message: "Author ID is not valid" });
    if (req.query.authorId) {
      query.authorId = req.query.authorId;
    }

    if (req.query.category) {
      if (isValid(req.query.category))
        query.category = { $in: req.query.category.split(",") };
    } else {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid tag" });
    }
    if (req.query.tags) {
      if (isValid(req.query.tags)) query.tags = req.query.tags;
    } else {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid tag" });
    }
    if (req.query.subcategory) {
      if (isValid(req.query.subcategory)) {
        query.subcategory = { $in: req.query.subcategory.split(",") };
      } else {
        return res
          .status(400)
          .send({ status: false, message: "please enter valid subcategory" });
      }
    }
    console.log(query);
    const blogs = await blogModel.updateMany(
      query,

      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
      //   {
      //   isDeleted: false,
      //   isPublished: true,
      //   authorId: req.query.authorId,
      //   category: req.query.category,
      //   tags: req.query.tags,
      //   subcategory: req.query.subcategory,
      // }
    );
    console.log(blogs);

    if (blogs.modifiedCount === 0) {
      res.status(404).send({ status: false, msg: "Blog was not found" });
    } else {
      res.status(200).send({ status: true, data: blogs });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};
module.exports = {
  creatblog,
  deletBlog,
  updateBlog,
  getBlog,
  deleteParticularBlog,
};
