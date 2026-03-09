import * as Joi from 'joi';

export const envValidationSchema = Joi.object({

  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  MONGO_URI: Joi.string().required(),

  MONGO_DB: Joi.string().required(),

  MONGO_USER: Joi.string().optional(),

  MONGO_PASS: Joi.string().optional(),

  ACCESS_TOKEN_SECRET: Joi.string().required(),

  REFRESH_TOKEN_SECRET: Joi.string().required(),

  JWT_ACCESS_EXPIRES_IN: Joi.string().required(),

  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),

  REDIS_PORT: Joi.string().required(),
});