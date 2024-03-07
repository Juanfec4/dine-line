import { TTL_ONE_MINUTE } from './../common/constants';

export default () => ({
  port: parseInt(process.env.PORT),
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS,
  },
  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  },
  rateLimit: {
    name: 'default',
    ttl: process.env.TTL,
    limit: TTL_ONE_MINUTE,
  },
  mailer: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    isSecure: Boolean(process.env.MAIL_SECURE),
    username: process.env.MAIL_USER,
    password: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM,
    service: process.env.MAIL_SERVICE,
  },
});
