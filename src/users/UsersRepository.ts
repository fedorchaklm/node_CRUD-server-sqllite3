import { Database } from "sqlite";
import { CreateUser, ReadUser, RemoveUser, User } from "../models/User";
import { NotFoundError } from "../common/Errors";
import { Collection, Db, ObjectId, OptionalId } from "mongodb";

export interface IUsersRepository {
  readAll(): Promise<Array<User>>;
  read(user: ReadUser): Promise<User>;
  create(user: CreateUser): Promise<User>;
  update(user: User): Promise<User>;
  remove(user: RemoveUser): Promise<RemoveUser>;
}

export class UsersRepositoryMongo implements IUsersRepository {
  private users: Collection<OptionalId<{ name: string }>>;

  constructor(private database: Db) {
    this.users = this.database.collection("users");
  }

  async readAll(): Promise<Array<User>> {
    const res = await this.users.find({}).toArray();
    return res.map(({ _id, name }) => ({ id: _id.toString(), name }));
  }

  async read(user: ReadUser): Promise<User> {
    const res = await this.users.findOne({ _id: new ObjectId(user.id) });
    if (!res) {
      throw new NotFoundError('User not found.');
    }
    return { id: user.id, name: res.name };
  }

  async create(user: CreateUser): Promise<User> {
    const res = await this.users.insertOne(user);
    return { id: res.insertedId.toString(), name: user.name };
  }

  async update(user: User): Promise<User> {
    const result = await this.users.updateOne(
      { _id: new ObjectId(user.id) },
      { $set: { name: user.name } }
    );
    if (result.matchedCount === 0) {
      throw new NotFoundError('User not found.')
    }
    return user;
  }

  async remove(user: RemoveUser): Promise<RemoveUser> {
    const result = await this.users.deleteOne({ _id: new ObjectId(user.id) });
    if (result.deletedCount === 0) {
      throw new NotFoundError('User not found.');
    }
    return user;
  }
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
    const { changes } = await this.database.run(
      "UPDATE users SET name = ? WHERE id = ?",
      [user.name, user.id]
    );
    if (changes === 0) {
      throw new NotFoundError("User not found.");
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
