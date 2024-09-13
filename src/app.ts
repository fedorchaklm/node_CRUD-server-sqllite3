import express from "express";
import { connect } from "./database";
import { UsersRepositorySqlite } from "./users/UsersRepository";
import UsersService from "./users/UsersService";
import UsersRouter from './users/UsersRouter';

const PORT = 3000;

(async () => {
  const database = await connect();

  const usersRepository = new UsersRepositorySqlite(database);
  const usersService = new UsersService(usersRepository);
  const usersRouter = new UsersRouter(usersService);

  const app = express();
  app.use(express.json());

  app.use("/users", usersRouter.router);

  app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();
