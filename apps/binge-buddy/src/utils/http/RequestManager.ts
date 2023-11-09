import { LoginResponseBody, LogoutResponseBody } from "@bb/api-interfaces";

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: BodyInit;
  params?: Record<string, string>;
};

export interface RequestManagerOptions {
  baseUrl: string;
}

export class RequestManager {
  private readonly baseUrl: string;
  private accessToken: string | null;
  private static sharedInstance: RequestManager | null = null;

  // Initialize your shared RequestManager instance
  static initialize(options: RequestManagerOptions): RequestManager {
    RequestManager.sharedInstance = new RequestManager(options);
    return RequestManager.sharedInstance;
  }

  static initializeWithInstance(instance: RequestManager): RequestManager {
    RequestManager.sharedInstance = instance;
    return RequestManager.sharedInstance;
  }

  // Get the shared instance
  static getInstance(): RequestManager {
    if (!RequestManager.sharedInstance) {
      throw new Error('Shared RequestManager instance not yet initialized');
    }
    return RequestManager.sharedInstance;
  }

  constructor({baseUrl}: RequestManagerOptions) {
    this.baseUrl = baseUrl;
    this.accessToken = null;
  }

  private async request<T>(url: string, options?: RequestOptions): Promise<T> {
    const {method = 'GET', headers = {}, body, params} = options || {};

    const queryString = params
      ? `?${Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')}`
      : '';

    const accessToken = await this.getAccessToken();
    const finalHeaders = {
      'Content-Type': 'application/json',
      ...(accessToken && {Authorization: `Bearer ${accessToken}`}),
      ...headers,
    };

    try {
      const requestInit: RequestInit = {
        method,
        headers: finalHeaders,
      };

      if (body !== undefined) {
        requestInit.body = body;
      }

      const response = await fetch(`${this.baseUrl}${url}${queryString}`, requestInit);

      if (!response.ok) {
        const error = new Error(response.statusText);
        throw Object.assign(error, {response});
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Error making the request:', error);
      throw error;
    }
  }

  public async login(username: string, password: string): Promise<LoginResponseBody> {
    const {token} = await this.makeRequest<LoginResponseBody>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    });

    await this.setAccessToken(token);
    return {token};
  }

  public async logout(): Promise<LogoutResponseBody> {
    await this.makeAuthorizedRequest<LogoutResponseBody>('/api/auth/logout', {
      method: 'POST',
    });

    await this.removeAccessToken();
    return {message: 'Logout successful', success: true};
  }

  public async makeRequest<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, options);
  }

  public async makeAuthorizedRequest<T>(url: string, options?: RequestOptions): Promise<T> {
    const {headers = {}} = options || {};
    const accessToken = await this.getAccessToken();
    const authorizedHeaders = {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    };

    return this.request<T>(url, {...options, headers: authorizedHeaders});
  }

  public async getAccessToken(): Promise<string | null> {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('access_token');
    }
    return this.accessToken;
  }

  public async setAccessToken(token: string): Promise<void> {
    this.accessToken = token;
    localStorage.setItem('access_token', token);
  }

  public async removeAccessToken(): Promise<void> {
    this.accessToken = null;
    localStorage.removeItem('access_token');
  }
}
