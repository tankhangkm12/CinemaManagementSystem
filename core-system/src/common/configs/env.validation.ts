import * as Joi from 'joi';

export const envValidationSchema = Joi.object({

  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  MONGO_URI: Joi.string().required(),

  MONGO_DB: Joi.string().required(),

  MONGO_USER: Joi.string().optional(),

  MONGO_PASS: Joi.string().optional(),

});