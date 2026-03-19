import knex from "knex";
import knexConfiguration from "../data/knexConfiguration.js";

const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfiguration[environment]);

export default db;
