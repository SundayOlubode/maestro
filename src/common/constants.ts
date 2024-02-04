export const generateOtp = (): {
  otp: number;
  otpExpiry: number;
} => {
  const otp: number = Math.floor(Math.random() * 1000000);
  const otpExpiry = 600000;
  return { otp, otpExpiry };
};
