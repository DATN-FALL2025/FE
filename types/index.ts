export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  avatarUrl?: string | null;
  roleName?: string;
}

export interface Session {
  user?: User;
  expires: string;
}

