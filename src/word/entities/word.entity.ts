import { User } from 'src/user/entities/user.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

export class Word extends CoreEntity {
  word: string;
  meaning: string;
  usages: string[];
  users: User[];
}
