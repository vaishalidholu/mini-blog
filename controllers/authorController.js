const { status } = require("express/lib/response");
const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validatePassword,
  isValid,
  isValidTitle,
} = require("../validations/authorValid");

const creatAuthor = async function (req, res) {
  try {
    console.log(req.body);
    console.log(validateEmail(req.body.email));

    if (Object.keys(req.body).length == 0)
      return res
        .status(400)
        .send({ status: false, msg: "Please enter valid input" });

    if (!validateEmail(req.body.email))
      return res
        .status(400)
        .send({ status: false, msg: "Please enter valid Email address" });

    if (!validatePassword(req.body.password))
      return res.status(400).send({
        status: false,
        msg: "Minimum eight characters, at least one letter and one number",
      });

    if (!isValid(req.body.fname))
      return res
        .status(400)
        .send({ status: false, msg: "please enter valid first name" });

    if (!isValid(req.body.lname))
      return res
        .status(400)
        .send({ status: false, msg: "please enter valid last name" });

    if (!isValidTitle(req.body.title))
      return res.status(400).send({ status: false, msg: "please enter title" });

    const author = await authorModel.create(req.body);
    res.status(200).send({ status: true, data: author });
  } catch (err) {
    // console.log()

    console.log(err);
    if (err.code == 11000) {
      res.status(400).send({ status: false, msg: "email is already exists" });
    } else {
    }
    res.status(500).send({ status: false, msg: err.message });
  }
};

const loginAuthor = async function (req, res) {
  try {
    let userName = req.body.email;
    let password = req.body.password;
    console.log(req.body);

    if (!validateEmail(req.body.email))
      return res
        .status(400)
        .send({ status: false, msg: "Please enter valid Email address" });

    if (!validatePassword(req.body.password))
      return res.status(400).send({
        status: false,
        msg: "Minimum eight characters, at least one letter and one number",
      });

    let author = await authorModel.findOne({
      email: userName,
      password: password,
    });

    if (!author)
      return res.send({
        status: false,
        msg: "username or the password is not corerct",
      });

    let token = jwt.sign(
      {
        authorId: author._id.toString(),
      },
      "functionup-radon"
    );
    //   res.setHeader("x-auth-token", token);
    res
      .status(200)
      .send({ status: true, msg: "Author login successfull", token: token });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { creatAuthor, loginAuthor };
