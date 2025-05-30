import * as dotenv from 'dotenv';
import * as Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  PORT: Joi.number().default(3000),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  RABBITMQ_URL: Joi.string().uri().required(),
}).unknown();

const { error, value } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(`❌ Invalid environment variables:\n${error.message}`);
}

export const env = {
  app: {
    env: value.NODE_ENV,
    port: Number(value.PORT),
  },
  jwt: {
    secret: value.JWT_SECRET,
    expiresIn: value.JWT_EXPIRES_IN,
  },
  db: {
    host: value.DB_HOST,
    port: Number(value.DB_PORT),
    username: value.DB_USER,
    password: value.DB_PASS,
    name: value.DB_NAME,
  },
  rabbitmq: {
    url: value.RABBITMQ_URL,
  },
} as const;
