const jwt = require("jsonwebtoken");

const authorAuthentication = async function (req, res, next) {
  try {
    let token = req.headers["x-auth-token"];
    console.log(token);
    //If no token is present in the request header return error
    if (!token)
      return res
        .status(401)
        .send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, "functionup-radon");
    req.decode = decodedToken;
    if (!decodedToken) {
      return res.send({ status: false, msg: "Token is invalid" });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

// const authorization = async function (req, res, next) {
// blogId = req.pqrams.blogId
// if (!isValidObjectId(req.body.blogId))
//   return res
//     .status(400)
//     .send({ status: false, messege: "blog is not present" });
// };
module.exports = { authorAuthentication };
