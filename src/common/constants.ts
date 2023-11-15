export const generateOtp = (): {
  otp: number;
  otpExpiry: number;
} => {
  const otp: number = Math.floor(Math.random() * 1000000);
  const expiry: number = Date.now() + 10 * 60 * 1000;
  const otpExpiry = 60000;
  return { otp, otpExpiry };
};
