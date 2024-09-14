import sqlite3 from "sqlite3";
import { open } from 'sqlite';

import { MongoClient } from "mongodb";

export function connectSqlite() {
  return open({
    filename: "./mydatabase.db",
    driver: sqlite3.Database,
  });
}

export async function connectMongo() {
  const client = new MongoClient(process.env.MONGO_URL!);
  await client.connect();
  return client.db('crud-server-db');
}
