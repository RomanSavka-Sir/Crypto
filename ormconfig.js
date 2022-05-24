require('dotenv').config();

const { DB_PORT, DB_HOST, DB_USER, DB_NAME, DB_PASSWORD } = process.env;

module.exports = {
  name: 'default',
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  migrations: ['dist/migrations/**/*.js'],
  entities: ['dist/**/*.entity.js'],
  cli: { migrationsDir: 'src/migrations' }
};
