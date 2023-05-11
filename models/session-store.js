// session store

const MongoStore = require('connect-mongo');



const sessionStore = function store(dbConnection) {
  return MongoStore.create({
    client: dbConnection,
    ttl: 2 * 24 * 60 * 60, // expires in 2 days
    touchAfter: 24 * 60 * 60, // Only update on user refresh or revisit after 24 hours
    crypto: {
      secret: process.env.SECRET,
    },
    collectionName: "sessions",
  });
};

module.exports = sessionStore;