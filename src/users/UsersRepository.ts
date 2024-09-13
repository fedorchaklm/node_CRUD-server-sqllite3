import { Database } from "sqlite";
import { CreateUser, ReadUser, RemoveUser, User } from "../models/User";
import { NotFoundError } from "../common/Errors";

export interface IUsersRepository {
  readAll(): Promise<Array<User>>;
  read(user: ReadUser): Promise<User>;
  create(user: CreateUser): Promise<User>;
  update(user: User): Promise<User>;
  remove(user: RemoveUser): Promise<RemoveUser>;
}

export class UsersRepositorySqlite implements IUsersRepository {
  constructor(private database: Database) {
    this.database.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
    );
  }

  async read(user: ReadUser): Promise<User> {
    const result = await this.database.get("SELECT * FROM users WHERE id = ?", [
      user.id,
    ]);
    if (!result) {
      throw new NotFoundError("User not found.");
    }
    return result;
  }

  async readAll(): Promise<Array<User>> {
    return this.database.all("SELECT * from users");
  }

  async create(user: CreateUser): Promise<User> {
    const { lastID } = await this.database.run(
      "INSERT INTO users (name) VALUES (?)",
      [user.name]
    );
    return { id: Number(lastID), name: user.name };
  }

  async update(user: User): Promise<User> {
    const { changes } = await this.database.run("UPDATE users SET name = ? WHERE id = ?", [
      user.name,
      user.id,
    ]);
    if (changes === 0) {
      throw new NotFoundError('User not found.');
    }
    return user;
  }

  async remove(user: RemoveUser): Promise<RemoveUser> {
    const { changes } = await this.database.run(
      "DELETE FROM users WHERE id = ?",
      [user.id]
    );
    if (changes === 0) {
      throw new NotFoundError("User not found.");
    }
    return user;
  }
}
