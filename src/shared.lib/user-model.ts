import { TypeLang } from "./locale.lang";

export const RoleValues = ['user', 'admin', 'sadmin'] as const;
export type TypeRole = typeof RoleValues[number];

export enum UserStatus {
  //Статус не определен
  Not = 0,
  Active = 1,
  Block = 2,
  Del = 3,
}

export interface UserModel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  lang: TypeLang;
  role: TypeRole;
  status: UserStatus;

  licEndOfDate: number //До кокого числи будет дейстовать лицензия
  privileges: {
    //Может читать любые задания
    readTasks?: boolean
  }
}
