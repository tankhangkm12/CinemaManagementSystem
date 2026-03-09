import { access } from "fs";

export default () => ({
  mongo: {
    uri: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  redis : {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

