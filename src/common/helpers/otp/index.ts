
export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 أرقام
  return otp;
};

export const generateOtpExpiry = () => {
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 دقايق
  return otpExpiry;
};