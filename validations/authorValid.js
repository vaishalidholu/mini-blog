const authorModel = require("../models/authorModel");

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

var validatePassword = function (p) {
  var pw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return pw.test(p);
};

const isValid = function (value) {
  if (typeof value == undefined || value == null) return false;
  if (typeof value == "string" && value.trim().length == 0) return false;
  else if (typeof value == "string") return true;
};
//  ====string validation function ======
// function isValidString(str1) {
//   return str1 != null && typeof str1 === "string" && str1.length > 0;
// }
// const isValidArray = function (array) {
//   if (!Array.isArray(array)) return false;
//   array.map((s) => s.trim());
// };
const isValidTitle = function (ti) {
  return ["Mr", "Mrs", "Miss"].includes(ti);
};

module.exports = {
  validateEmail,
  validatePassword,
  isValid,
  isValidTitle,
};
