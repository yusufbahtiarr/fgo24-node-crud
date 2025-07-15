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
  const userOtp = otpUser.find((user) => user.otp === parseInt(otp));
  return userOtp.userid;
};
