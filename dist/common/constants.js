"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const generateOtp = () => {
    const otp = Math.floor(Math.random() * 1000000);
    const otpExpiry = 600000;
    return { otp, otpExpiry };
};
exports.generateOtp = generateOtp;
//# sourceMappingURL=constants.js.map