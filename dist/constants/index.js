"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NUMWORDUSAGES = exports.EnglishWords = exports.MAESTROSENDER = exports.NODE_ENV = exports.EMAIL_DOMAIN = exports.MAILGUN_API_KEY = exports.JWT_SECRET = exports.DATABASE_URL = exports.THREAD_ID = exports.ASST_ID = exports.OPENAI_API_KEY = exports.DEV_ASST_ID = exports.DEV_THREAD_ID = void 0;
exports.DEV_THREAD_ID = process.env.DEV_THREAD_ID;
exports.DEV_ASST_ID = process.env.DEV_ASST_ID;
exports.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
exports.ASST_ID = process.env.ASST_ID;
exports.THREAD_ID = process.env.THREAD_ID;
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
exports.EMAIL_DOMAIN = process.env.EMAIL_DOMAIN;
exports.NODE_ENV = process.env.NODE_ENV;
exports.MAESTROSENDER = process.env.MAESTROSENDER;
const checkWord = require("check-if-word");
exports.EnglishWords = checkWord('en');
exports.NUMWORDUSAGES = exports.NODE_ENV === 'production' ? 8 : 5;
//# sourceMappingURL=index.js.map