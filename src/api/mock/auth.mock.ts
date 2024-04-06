import MockAdapter from "axios-mock-adapter";
import { ApiAuth, ChangeProfileRequest, LoginRequest, LoginResponse, NewPasswordData, ResetPasswordRequest, SecurityCodePayload, SignUpRequest } from "../../shared.lib/api/auth.api";
import { UserStatus } from "../../shared.lib/user-model";

export const startServMockAuth = (mock: MockAdapter) => {
  //mock.onPost(ApiAuth.login, { email: 'admin@admin.com', password: 'admin' }).reply(200)
  //mock.onPost(ApiAuth.login).reply(()=>[503, {message: "Все круто"}])
  const logRespUser: LoginResponse = {
    token: 'testToken',
    user: {
      role: "user",
      email: 'admin@admin.com',
      emailVerified: true,
      licEndOfDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      privileges: {
        readTasks: true
      },
      firstName: "admin Jon",
      lang: "ru",
      id: 234,
      lastName: "Nik",
      status: UserStatus.Active

    }
  }

  // const logRespAdmin: LoginResponse = { ...logRespUser, user: { ...logRespUser.user, role: 'admin' } }
  // const logRespSupAdmin: LoginResponse = { ...logRespUser, user: { ...logRespUser.user, role: 'sadmin' } }

  const regResp: SignUpRequest = {
    firstName: "User",
    lastName: "New",
    lang: 'en',
    role: "user",
    email: "user@gmail.com",
    password: "password123"
  }



  mock.onPost(ApiAuth.login.path).reply((config) => {
    const lr = JSON.parse(config.data || '') as LoginRequest
    //console.info(lr.email+lr.password)
    if ((lr.email === 'admin@gmail.com') && (lr.password === 'admin')) {
      return [200, logRespUser]
    }
    else return [401, { message: 'Invalid Credentials' }]
  })

  mock.onGet(ApiAuth.getProfile.path).reply((config) => {

    if (config.headers?.Authorization === `Bearer ${logRespUser.token}`) return [200, logRespUser]
    return [403, { message: 'Auth error' }];
  })

  mock.onPost(ApiAuth.signUp.path).reply((config) => {
    const regData = JSON.parse(config.data || '') as SignUpRequest
    if (regData.email && regData.password && regData.lastName && regData.firstName && regData.role === "user") return [200, regResp]
    else return [401, { message: 'Invalid SignUp Credentials' }]
  })

  mock.onPost(ApiAuth.forgotPassword.path).reply((config) => {
    const resetPasswordData = JSON.parse(config.data || '') as ResetPasswordRequest

    if (resetPasswordData.email === 'admin@gmail.com') {
      return [200, { message: 'Email Approved' }]
    }
    else return [401, { message: 'Invalid Email' }]
  })

  mock.onPost(ApiAuth.verifySecurityCode.path).reply((config) => {
    const codePayload = JSON.parse(config.data || '') as SecurityCodePayload;

    if (codePayload.code === '7801') {
      return [200, { message: 'Сode Approved' }];
    } else {
      return [401, { message: 'Invalid Code' }];
    }
  });

  mock.onPost(ApiAuth.setNewPassword.path).reply((config) => {
    const passwordPayload = JSON.parse(config.data || '') as NewPasswordData;

    if (passwordPayload.newPassword) {
      return [200, { message: 'New password set' }];
    } else {
      return [401, { message: 'Invalid password or password missing' }];
    }
  });

  mock.onPut(ApiAuth.changeProfile.path).reply((config) => {
    const reqData = JSON.parse(config.data || '') as ChangeProfileRequest
    if (reqData.lang && reqData.lastName && reqData.firstName) {

      return [200, { message: "Profile has been changed" }]
    }
    else return [401, { message: 'Invalid SignUp Credentials' }]
  })

}


