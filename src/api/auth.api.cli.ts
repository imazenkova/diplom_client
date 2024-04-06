import {
  LoginRequest, LoginResponse, NewPasswordData,
  ResetPasswordRequest, SecurityCodePayload, SignUpRequest, ApiAuth, ChangeProfileRequest, ApiAccess, ApiAccessSet, ChangeStatusPayload
} from "../shared.lib/api/auth.api";


import axios from 'axios'
import { getAxiosSettings } from "./config.axios"
import { UserModel, UserStatus } from "../shared.lib/user-model";

export const AuthApi = {

  login: async (loginPayload: LoginRequest): Promise<LoginResponse> => {
    debugger
    const res = await axios.post<LoginResponse>(ApiAuth.login.path, loginPayload, getAxiosSettings())
    return res.data
  },

  getProfile: async (): Promise<LoginResponse> => {
    const res = await axios.get<LoginResponse>(ApiAuth.getProfile.path, getAxiosSettings())
    return res.data
  },

  signUp: async (signUpPayload: SignUpRequest): Promise<LoginResponse> => {
    const res = await axios.post<LoginResponse>(ApiAuth.signUp.path, signUpPayload, getAxiosSettings())
    return res.data
  },

  forgotPassword: async (resetPasswordPayload: ResetPasswordRequest): Promise<ResetPasswordRequest> => {
    const res = await axios.post<ResetPasswordRequest>(ApiAuth.forgotPassword.path, { ...resetPasswordPayload }, getAxiosSettings())
    return res.data
  },

  verifySecurityCode: async (verifySecurityCodePayload: SecurityCodePayload): Promise<LoginResponse> => {
    const res = await axios.post<LoginResponse>(ApiAuth.verifySecurityCode.path, { ...verifySecurityCodePayload }, getAxiosSettings())
    return res.data
  },

  setNewPassword: async (newPasswordPayload: NewPasswordData): Promise<LoginResponse> => {
    const res = await axios.post<LoginResponse>(ApiAuth.setNewPassword.path, { ...newPasswordPayload }, getAxiosSettings())
    return res.data
  },

  changeProfile: async (newProfilePayload: ChangeProfileRequest): Promise<LoginResponse> => {
    const res = await axios.put<LoginResponse>(ApiAuth.changeProfile.path, { ...newProfilePayload }, getAxiosSettings())
    return res.data
  },

  getAllUsers: async (): Promise<UserModel[]> => {
    const res = await axios.get<UserModel[]>(ApiAuth.getAllUsers.path, getAxiosSettings())
    return res.data
  },

  getApiAccess: async (): Promise<ApiAccess> => {
    const res = await axios.post<ApiAccess>(ApiAuth.getApiAccess.path, {}, getAxiosSettings())
    return res.data
  },

  setApiAccess: async (apiAccessSet: ApiAccessSet): Promise<ApiAccess> => {
    const res = await axios.post<ApiAccess>(ApiAuth.setApiAccess.path, apiAccessSet, getAxiosSettings())
    return res.data
  },

  refreshApiToken: async (): Promise<ApiAccess> => {
    const res = await axios.post<ApiAccess>(ApiAuth.refreshApiToken.path, {}, getAxiosSettings())
    return res.data
  },

  changeStatus: async (payload: ChangeStatusPayload): Promise<LoginResponse> => {
    const res = await axios.put(ApiAuth.updateStatus.path, { ...payload }, getAxiosSettings())
    return res.data
  },

}

