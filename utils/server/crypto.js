import crypto from "crypto";

const hashPassword = (data) => {
  return crypto.createHash("md5").update(data).digest("hex");
};

export { hashPassword };
