export type Users = {
  id: number;
  name: string;
  email: string;
};

export type Posts = {
  id: number;
  title: string;
};

export const UserSchema = {
  table: "users",
  primaryKey: "id",
  model: {} as Users,
  columns: ["id", "name", "email"] as const,
};

export const PostSchema = {
  table: "posts",
  primaryKey: "id",
  model: {} as Posts,
  columns: ["id", "title"] as const,
};
