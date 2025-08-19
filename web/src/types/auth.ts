export type TLoginCredentials = {
  email: string;
  password: string;
};

export type TSignUpCredentials = {
  name: string;
  email: string;
  password: string;
};

export type TUser = {
  id: number;
  email: string;
  name: string;
};

export type TLoginResponse = {
  message: string;
};
