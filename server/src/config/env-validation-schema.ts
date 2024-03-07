import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().port(),
  TTL: Joi.number(),
  LIMIT: Joi.number(),
  DB_HOST: Joi.string().hostname(),
  DB_USER: Joi.string(),
  DB_PASS: Joi.string(),
  DB_NAME: Joi.string(),
  DB_PORT: Joi.number().port(),
  ACCESS_TOKEN_SECRET: Joi.string(),
  REFRESH_TOKEN_SECRET: Joi.string(),
  REDIS_HOST: Joi.string().hostname(),
  REDIS_PORT: Joi.number().port(),
  REDIS_PASS: Joi.string(),
  MAIL_HOST: Joi.string().hostname(),
  MAIL_PORT: Joi.number().port(),
  MAIL_SECURE: Joi.boolean(),
  MAIL_USER: Joi.string(),
  MAIL_PASS: Joi.string(),
  MAIL_FROM: Joi.string(),
  MAIL_SERVICE: Joi.string(),
});
