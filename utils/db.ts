import knex from 'knex';

export default knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'user',
    password: 'pass',
    database: 'gpsdb',
  },
});
