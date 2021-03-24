module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database/trees.sqlite3",
    },
    migrations: {
      directory: "./database/migrations/",
    },
    seeds: {
      directory: "./database/seeds/",
    },
  },
};
