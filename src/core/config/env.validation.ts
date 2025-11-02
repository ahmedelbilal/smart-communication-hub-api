import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
  // Database
  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  JWT_SECRET: string;

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string;

  @IsOptional()
  @IsString()
  DB_CA_CERT?: string;

  // Environment
  @IsOptional()
  @IsString()
  NODE_ENV?: string;

  @IsOptional()
  @IsNumber()
  PORT?: number;

  // CORS
  @IsOptional()
  @IsString()
  CORS_ORIGINS?: string;

  // Ratelimiter
  @IsOptional()
  @IsNumber()
  THROTTLER_TTL?: number;

  @IsOptional()
  @IsNumber()
  THROTTLER_LIMIT?: number;

  // Bcrypt
  @IsOptional()
  @IsNumber()
  BCRYPT_SALT_ROUNDS?: number;

  // Openai
  @IsString()
  OPENAI_API_KEY: string;

  @IsOptional()
  @IsString()
  OPENAI_MODEL?: string;

  @IsOptional()
  @IsNumber()
  OPENAI_TEMPERATURE?: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true, // converts strings to numbers automatically
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false, // ensure required vars are present
  });

  if (errors.length > 0) {
    console.error(errors.toString());
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
