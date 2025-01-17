export interface loginPayload {
  email: string;
  password: string;
}

export interface signupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface forgotPasswordPayload {
  email: string;
}

export interface resetPasswordPayload {
  newPassword: string;
  token: string;
}

export interface verifyOtpPayload {
  email: string;
  otp: number;
}

export interface resendOtpPayload {
  email: string;
}

export interface resetPasswordPayload {
  password: string;
  newPassword: string;
  token: string;
}


