import { IUsersRepository } from "./UsersRepository";
import { CreateUser, ReadUser, RemoveUser, User } from "../models/User";

export default class UsersService {
  constructor(private usersRepository: IUsersRepository) {}

  async readAll(): Promise<Array<User>> {
    return this.usersRepository.readAll();
  }

  async read(user: ReadUser): Promise<User> {
    return this.usersRepository.read(user);
  }

  async create(user: CreateUser): Promise<User> {
    return this.usersRepository.create(user);
  }

  async update(user: User): Promise<User> {
    return this.usersRepository.update(user);
  }

  async remove(user: RemoveUser): Promise<RemoveUser> {
    return this.usersRepository.remove(user);
  }
}
