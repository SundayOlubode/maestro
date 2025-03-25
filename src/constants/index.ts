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
export const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const NUMWORDUSAGES = NODE_ENV === 'production' ? 8 : 5;
export const NUM_WORD_TO_GEN = NODE_ENV === 'production' ? 40 : 10;

export const SYSTEM_CONTENT = `With a given word, you are to generate the meaning of that word, along with ${
  NODE_ENV === 'production' ? 'forty' : 'ten'
} numbered usages of that word in sentences.  Use the format: Meaning: [meaning of word] Usages: [usages]`;

export const IDIOM_SYSTEM_CONTENT = `You are a vocabulary assistant that helps users understand idioms. With a given idiom, you are to generate the meaning of that idiom, along with ${
  NODE_ENV === 'production' ? 'forty' : 'ten'
} numbered usages of that idiom in sentences. Use the format: Meaning: [meaning of idiom] Usages: [usages]`;
export const IDIOM_VALIDATOR_SYSTEM_CONTENT =
  'You are a helpful assistant that determines whether a phrase is a recognized English idiom or not. Respond only with "YES" if it is an idiom, or "NO" if it is not.';
export const WORD_VALIDATOR_SYSTEM_CONTENT =
  'You are a helpful assistant that determines whether a word is a recognized English word or not. Respond only with "YES" if it is a word, or "NO" if it is not.';
