export type User = {
  id: number | string;
  name: string;
};

export type CreateUser = Omit<User, 'id'>;

export type RemoveUser = Pick<User, 'id'>;

export type ReadUser = Pick<User, 'id'>;


