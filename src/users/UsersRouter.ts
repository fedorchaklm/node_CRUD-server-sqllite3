import express, { Request, Response } from "express";
import UsersService from "./UsersService";
import { CreateUser } from "../models/User";
import { NotFoundError } from "../common/Errors";

export default class UsersRouter {
  public router = express.Router();

  constructor(private usersService: UsersService) {
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const users = await this.usersService.readAll();
        res.status(200).json(users);
      } catch (err) {
        res.status(500).send();
      }
    });

    this.router.get("/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        const users = await this.usersService.read({ id });
        res.status(200).json(users);
      } catch (err) {
        if (err instanceof NotFoundError) {
          res.status(404).send(err.message);
        } else {
          res.status(500).send();
        }
      }
    });

    this.router.post("/", async (req: Request, res: Response) => {
      const { name } = req.body;
      try {
        const user = await this.usersService.create({ name });
        res.status(200).json(user);
      } catch (err) {
        res.status(500).send();
      }
    });

    this.router.put("/:id", async (req: Request, res: Response) => {
      const { name } = req.body;
      const { id } = req.params;
      try {
        const user = await this.usersService.update({ id, name });
        res.status(200).json(user);
      } catch (err) {
        if (err instanceof NotFoundError) {
          res.status(404).send(err.message);
        } else {
          res.status(500).send();
        }
      }
    });

    this.router.delete("/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      try {
        const user = await this.usersService.remove({ id });
        res.status(200).json(user);
      } catch (err) {
        if (err instanceof NotFoundError) {
          res.status(404).send(err.message);
        } else {
          res.status(500).send();
        }
      }
    });
  }
}
