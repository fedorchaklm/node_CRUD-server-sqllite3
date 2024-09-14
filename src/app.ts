import express from "express";
import dotenv from 'dotenv';

import { connectMongo, connectSqlite } from "./database";
import { UsersRepositorySqlite, UsersRepositoryMongo } from "./users/UsersRepository";
import UsersService from "./users/UsersService";
import UsersRouter from './users/UsersRouter';

const PORT = 3000;
dotenv.config();

(async () => {
  // const database = await connectSqlite();
  // const usersRepository = new UsersRepositorySqlite(database);
  const database = await connectMongo();
  const usersRepository = new UsersRepositoryMongo(database);
  const usersService = new UsersService(usersRepository);
  const usersRouter = new UsersRouter(usersService);

  const app = express();
  app.use(express.json());

  app.use("/users", usersRouter.router);

  app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();
