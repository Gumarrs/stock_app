import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  dob?: Date;

  @IsOptional()
  @IsIn(['M', 'F'])
  gender?: 'M' | 'F';
}
