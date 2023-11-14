export const generateOtp = (): { otp: number; otpExpiry: string } => {
  const otp: number = Math.floor(Math.random() * 1000000);
  const expiry: number = Date.now() + 10 * 60 * 1000;
  const otpExpiry = new Date(expiry).toISOString();

  return { otp, otpExpiry };
};
