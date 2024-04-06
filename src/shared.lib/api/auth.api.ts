import { UserModel, UserStatus } from '../user-model'

export interface SignUpRequest extends ChangeProfileRequest, Pick<UserModel, 'email' | 'role'> {
  password: string;
}

export interface Token {
  token: string;
}


export interface LoginResponse extends Token {
  user: UserModel;
}

export interface ApiAccessSet {
  enabled: boolean
}
export interface ChangeStatusPayload {
  id:number,
  status:UserStatus
}

export type ApiAccess = Token & ApiAccessSet

export type ResetPasswordRequest = Pick<UserModel, 'email'>;

export interface SecurityCodePayload extends Pick<LoginResponse, 'token'> {
  code: string;
}

export interface NewPasswordData {
  password: string;
  newPassword: string;
}

export type LoginRequest = Pick<SignUpRequest, 'email' | 'password'>;

export type EmailChangeRequest = Pick<LoginRequest, 'password'>;

export type ChangeProfileRequest = Pick<UserModel, 'firstName' | 'lastName' | 'lang'>;


export const ApiAuth = {
  /** {@link LoginRequest} => {@link LoginResponse}*/
  login: { method: 'post' as const, path: '/api/auth/login' },
  /** {@link SignUpRequest} => {@link LoginResponse}*/
  signUp: { method: 'post' as const, path: '/api/auth/signUp' },

  /** {@link SignUpRequest} => {@link LoginResponse}*/
  forgotPassword: { method: 'post' as const, path: '/api/auth/forgotPassword' },
  /** {@link SecurityCodePayload} => {@link LoginResponse} */
  verifySecurityCode: { method: 'post' as const, path: '/api/auth/verifySecurityCode' },
  /** {@link NewPasswordData} =>  {@link LoginResponse} */
  setNewPassword: { method: 'post' as const, path: '/api/auth/setNewPassword' },
  /** {@link void} => {@link LoginResponse}*/
  getProfile: { method: 'get' as const, path: '/api/auth/getProfile' },
  /** {@link void} => {@link LoginResponse}*/
  getAllUsers: { method: 'get' as const, path: '/users_list' },
  /** {@link ChangeProfileRequest} => {@link LoginResponse} */
  changeProfile: { method: 'put' as const, path: '/api/auth/changeProfile' },
  /** {@link ChangeStatusPayload} => {@link LoginResponse}*/
  updateStatus: { method: 'put' as const, path: '/users_list' },

  /** {@link void} => {@link ApiAccess} */
  getApiAccess: { method: 'post' as const, path: '/api/auth/apiAccess' },
  /** {@link ApiAccessSet} => {@link ApiAccess} */
  setApiAccess: { method: 'post' as const, path: '/api/auth/apiAccessSet' },
  /** {@link void} => {@link ApiAccess} */
  refreshApiToken: { method: 'post' as const, path: '/api/auth/refreshApiToken' },
}
