import dotenv from "dotenv";
dotenv.config();

const knexConfiguration = {

  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    ssl: {
      rejectUnauthorized: false,
    },
  },

};

export default knexConfiguration;