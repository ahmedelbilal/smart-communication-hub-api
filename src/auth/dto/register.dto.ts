import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({ example: 'user' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value.toLowerCase().trim())
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: 'strongPassword123@', minLength: 6 })
  @IsString()
  @IsStrongPassword({ minLength: 6 })
  password: string;
}
