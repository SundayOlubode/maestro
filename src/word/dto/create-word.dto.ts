import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWordDto {
  @IsNotEmpty()
  @IsString()
  word: string;
}

export class CreateIdiomDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  idiom: string;
}
