const { Users } = require("./users.model");

let otpUser = [];

exports.saveOTP = function (id) {
  const otpCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  const newOtp = {
    userid: id,
    otp: otpCode,
  };
  otpUser.push(newOtp);
  return newOtp;
};

exports.verifyOTP = function (otp) {
  parsedOTP = parseInt(otp);
  const index = otpUser.findIndex((item) => item.otp === parsedOTP);
  if (index === -1) {
    return null;
  }
  const userOtp = otpUser[index];
  otpUser.splice(index, 1);

  return userOtp.userid;
};
