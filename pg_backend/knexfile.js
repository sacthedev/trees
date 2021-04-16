// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'trees',
      user: 'admin',
      password: 'password2021',
    },
    migrations: {
      directory: './database/migrations/',
    },
    seeds: {
      directory: './database/seeds/',
    },
  },
};
