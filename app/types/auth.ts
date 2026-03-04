export type TUser = {
  name: string
  email: string
  role: string
}

export type TLoginResponse = {
  user: TUser
  token: string
}

export type TMeResponse = {
  user: TUser
}
