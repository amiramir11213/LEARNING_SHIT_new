import { UserRole } from 'src/modules/users/entities/UserEntity';

export type AuthUser = {
  id: number;
  email: string;
  role: UserRole;
};
