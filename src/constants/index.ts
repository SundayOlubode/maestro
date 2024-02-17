export const DEV_THREAD_ID = process.env.DEV_THREAD_ID;
export const DEV_ASST_ID = process.env.DEV_ASST_ID;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const ASST_ID = process.env.ASST_ID;
export const THREAD_ID = process.env.THREAD_ID;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
export const EMAIL_DOMAIN = process.env.EMAIL_DOMAIN;
export const NODE_ENV = process.env.NODE_ENV;
export const MAESTROSENDER = process.env.MAESTROSENDER;

import * as checkWord from 'check-if-word';
export const EnglishWords = checkWord('en');
