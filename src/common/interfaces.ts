import { Word } from '@prisma/client';

export class AllWords {
  [key: string]: {
    id: number;
    countdown: number;
    word: Word;
  }[];
}
