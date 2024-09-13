import sqlite3 from "sqlite3";
import { open } from 'sqlite';

export function connect() {
  return open({
    filename: "./mydatabase.db",
    driver: sqlite3.Database,
  });
}
