const { Pool } = require('pg')
require('dotenv').config()

module.exports = new Pool({
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
  user: process.env.BD_USER,
  password: process.env.BD_PASSWORD
})