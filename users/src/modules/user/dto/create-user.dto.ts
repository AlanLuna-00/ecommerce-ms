import {IsEmail, IsString, MinLength, IsOptional, IsEnum} from 'class-validator';
import { UserRole } from '../../../shared/types/role.enum';


export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
