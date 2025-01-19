export interface UserState {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  userName?: string | null;
  email: string | null;
  profileImage?: string | null;
  token: string | null;
}

export interface SetUser {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  token: string | null;
  userName?: string | null;
  profileImage?: string | null;
}

export interface UpdateUser {
  userName?: string | null;
  profileImage?: string | null;
}

export interface profilePayload {
  profileImage: string;
  userName: string;
}