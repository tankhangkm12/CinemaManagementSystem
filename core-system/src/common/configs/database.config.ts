export default () => ({
  mongo: {
    uri: process.env.MONGO_URI,
    dbName: process.env.MONGO_DB,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
  },
});

