export interface  LoginResponseBody {
  token: string;
  refreshToken?: string;
  scope?: string;
}

interface LogoutResponseBody {
  success: boolean;
  message: string;
}
