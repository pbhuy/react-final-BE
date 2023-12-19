const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");

const passportConfig = require("../../configs/passport");
const { sendErr } = require("../helpers/response");
const ApiError = require("../helpers/error");

const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, account) => {
    if (err) {
      console.log(err);
      return sendErr(res, new ApiError(401, "Unauthorized"));
    }
    if (!account) {
      return sendErr(
        res,
        new ApiError(401, "Access denied! Missing or invalid token.")
      );
    }
    req._id = account._id;
    req.role = account.role;
    return next();
  })(req, res, next);
};

const authFacebook = (req, res, next) => {
  passport.authenticate("facebook", { session: false }, (err, data) => {
    if (err) return sendErr(res, new ApiError(401, "Unauthorized"));
    if (!data) {
      return sendErr(
        res,
        new ApiError(401, "Access denied! Missing or invalid token.")
      );
    }
    req.data = data;
    return next();
  })(req, res, next);
};

const authorizeStudent = (req, res, next) => {
  if (req.role === "student") {
    return next();
  }
  return sendErr(res, new ApiError(403, "Access denied!"));
};

const authorizeTeacher = (req, res, next) => {
  if (req.role === "teacher") {
    return next();
  }
  return sendErr(res, new ApiError(403, "Access denied!"));
};

module.exports = {
  authenticateJWT,
  authorizeStudent,
  authorizeTeacher,
  authFacebook,
};
