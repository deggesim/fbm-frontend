export interface User {
  id?: number;
  email: string;
  password: string;
  tokens?: string[];
  admin?: boolean;
}
