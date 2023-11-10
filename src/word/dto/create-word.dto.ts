import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateWordDto {
  @IsNotEmpty()
  @IsString()
  word: string;
}
