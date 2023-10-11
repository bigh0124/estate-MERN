import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
const verify = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "Unauthorized!"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Forbidden!"));
    req.user = user;
  });

  next();
};

export default verify;
