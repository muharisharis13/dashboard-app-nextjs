import jwt from "jsonwebtoken";

const tokenLife = "1s"

const createToken = (data) => jwt.sign(data, "admin_22", { expiresIn: tokenLife })
const createRefreshToken = (data) => jwt.sign(data, "admin_ref_22")

const verifyRefreshToken = (username, token) => {
  try {

    const decoded = jwt.verify(token, 'admin_ref_22');
    return decoded.username === username;
  } catch (error) {
    return false;
  }
}

export {
  verifyRefreshToken,
  createToken,
  createRefreshToken
}